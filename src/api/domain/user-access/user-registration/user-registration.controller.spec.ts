import { Application } from 'express';
import request from 'supertest';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { createAppContainer } from '../../../../app-container';
import faker from 'faker';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { createMockProxy } from '@tools/mock-proxy';
import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { AccountStatus } from '@core/user-access/user-registration/account-status.value-object';
import jwt from 'jsonwebtoken';

describe('[API] User registration controller', () => {
  let app: Application;
  let userRegistrationRepository: UserRegistrationRepository;
  const emailChecker = createMockProxy<UniqueEmailChecker>();

  beforeAll(async () => {
    const container = await createAppContainer();
    app = container.resolve('app');
    userRegistrationRepository = container.resolve('userRegistrationRepository');
  });

  beforeEach(() => {
    emailChecker.mockClear();
  });

  test('[POST] /register - should return an error if data is invalid', async () => {
    const res = await request(app).post('/register').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(422);
    expect(res.body.error).toEqual('Input Validation Error');
    expect(res.body.details.map((detail) => detail.key)).toEqual(['email', 'password', 'username']);
  });

  test('[POST] /register - should return error if email is already in use', async () => {
    emailChecker.isUnique.mockResolvedValue(true);

    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.name.findName();

    await userRegistrationRepository.insert(
      await UserRegistration.registerNew(
        {
          email,
          password,
          username,
        },
        emailChecker,
      ),
    );

    const res = await request(app).post('/register').set('Accept', 'application/json').send({
      email,
      password,
      username,
    });

    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual(`Email address: "${email}" is already taken.`);
  });

  test('[POST] /register - should register new user', async () => {
    emailChecker.isUnique.mockResolvedValue(true);

    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.name.findName();

    const res = await request(app).post('/register').set('Accept', 'application/json').send({
      email,
      password,
      username,
    });

    expect(res.status).toEqual(201);
    expect(res.body.success).toBeTruthy();
  });

  test('[GET] /confirm - should return an error if data is invalid', async () => {
    const res = await request(app).get('/register/confirm').set('Accept', 'application/json');

    expect(res.status).toEqual(422);
    expect(res.body.details.map((detail) => detail.key)).toEqual(['token']);
  });

  test('[GET] /confirm - should return an error if account is already confirmed', async () => {
    process.env.VERIFICATION_TOKEN_SECRET = 'secret';

    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.name.findName();
    const id = new UniqueEntityID();

    await userRegistrationRepository.insert(
      UserRegistration.instanceExisting(
        {
          email,
          password,
          username,
          accountStatus: AccountStatus.Confirmed.getValue(),
          confirmationDate: new Date(),
          registrationDate: new Date(),
        },
        id,
      ),
    );

    const token = jwt.sign(
      {
        userId: id.getValue(),
      },
      process.env.VERIFICATION_TOKEN_SECRET,
    );

    const res = await request(app)
      .get(`/register/confirm?token=${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual(
      'Account is already confirmed. Account cannot be actived more than once.',
    );
  });

  test('[GET] /confirm - should return an error if account is expired', async () => {
    process.env.VERIFICATION_TOKEN_SECRET = 'secret';

    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.name.findName();
    const id = new UniqueEntityID();

    await userRegistrationRepository.insert(
      UserRegistration.instanceExisting(
        {
          email,
          password,
          username,
          accountStatus: AccountStatus.Expired.getValue(),
          confirmationDate: new Date(),
          registrationDate: new Date(),
        },
        id,
      ),
    );

    const token = jwt.sign(
      {
        userId: id.getValue(),
      },
      process.env.VERIFICATION_TOKEN_SECRET,
    );

    const res = await request(app)
      .get(`/register/confirm?token=${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual('Cannot activate already expired account.');
  });

  test('[GET] /confirm - should confirm account', async () => {
    process.env.VERIFICATION_TOKEN_SECRET = 'secret';

    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.name.findName();
    const id = new UniqueEntityID();

    await userRegistrationRepository.insert(
      UserRegistration.instanceExisting(
        {
          email,
          password,
          username,
          accountStatus: AccountStatus.WaitingForConfirmation.getValue(),
          confirmationDate: new Date(),
          registrationDate: new Date(),
        },
        id,
      ),
    );

    const token = jwt.sign(
      {
        userId: id.getValue(),
      },
      process.env.VERIFICATION_TOKEN_SECRET,
    );

    const res = await request(app)
      .get(`/register/confirm?token=${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(201);
    expect(res.body.success).toBeTruthy();
  });
});
