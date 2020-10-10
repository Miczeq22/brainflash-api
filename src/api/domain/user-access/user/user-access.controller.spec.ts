import { Application } from 'express';
import { createAppContainer } from '../../../../app-container';
import request from 'supertest';
import faker from 'faker';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';
import { createMockProxy } from '@tools/mock-proxy';
import jwt from 'jsonwebtoken';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[API] User access controller', () => {
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

  test('[POST] /user-access/login - should return error if data is invalid', async () => {
    const res = await request(app).post('/user-access/login').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(422);
    expect(res.body.error).toEqual('Input Validation Error');
    expect(res.body.details.map((detail) => detail.key)).toEqual(['email', 'password']);
  });

  test('[POST] /user-access/login - should return error if email or password is incorrect', async () => {
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

    const res = await request(app)
      .post('/user-access/login')
      .set('Accept', 'application/json')
      .send({
        email,
        password: '#invalid-password',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('[POST] /user-access/login - should return proper tokens with user id', async () => {
    process.env.JWT_TOKEN = 'secret';

    emailChecker.isUnique.mockResolvedValue(true);

    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.name.findName();

    const user = await UserRegistration.registerNew(
      {
        email,
        password,
        username,
      },
      emailChecker,
    );

    user.confirmAccount();

    await userRegistrationRepository.insert(user);

    const res = await request(app)
      .post('/user-access/login')
      .set('Accept', 'application/json')
      .send({
        email,
        password,
      });

    const payload = jwt.decode(res.body.accessToken) as { userId: string };

    expect(res.statusCode).toEqual(200);
    expect(Object.keys(res.body)).toEqual(['accessToken', 'refreshToken']);
    expect(payload.userId).toEqual(user.getId().getValue());
  });

  test('[PATCH] /user-access/update-password - should return an error if data is invalid', async () => {
    process.env.JWT_TOKEN = 'secret';

    emailChecker.isUnique.mockResolvedValue(true);

    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.name.findName();

    const user = await UserRegistration.registerNew(
      {
        email,
        password,
        username,
      },
      emailChecker,
    );

    await userRegistrationRepository.insert(user);

    const token = jwt.sign(
      {
        userId: user.getId().getValue(),
      },
      process.env.JWT_TOKEN,
    );

    const res = await request(app)
      .patch('/user-access/update-password')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.details.map((detail) => detail.key)).toEqual(['oldPassword', 'newPassword']);
  });

  test('[PATCH] /user-access/update-password - should return an error if user is unauthorized', async () => {
    process.env.JWT_TOKEN = 'secret';

    const token = jwt.sign(
      {
        userId: new UniqueEntityID().getValue(),
      },
      process.env.JWT_TOKEN,
    );

    const res = await request(app)
      .patch('/user-access/update-password')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'invalid-password',
        newPassword: 'new-password',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('[PATCH] /user-access/update-password - should update user possword', async () => {
    process.env.JWT_TOKEN = 'secret';

    emailChecker.isUnique.mockResolvedValue(true);

    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.name.findName();

    const user = await UserRegistration.registerNew(
      {
        email,
        password,
        username,
      },
      emailChecker,
    );

    await userRegistrationRepository.insert(user);

    const token = jwt.sign(
      {
        userId: user.getId().getValue(),
      },
      process.env.JWT_TOKEN,
    );

    const res = await request(app)
      .patch('/user-access/update-password')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: password,
        newPassword: 'new-password',
      });

    expect(res.statusCode).toEqual(204);
  });
});
