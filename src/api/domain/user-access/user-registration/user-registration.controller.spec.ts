import { Application } from 'express';
import request from 'supertest';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { createAppContainer } from '../../../../app-container';
import faker from 'faker';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { createMockProxy } from '@tools/mock-proxy';
import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';

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
});
