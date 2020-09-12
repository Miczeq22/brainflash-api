import { DeckRepository } from '@core/decks/deck/deck.repository';
import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { Application } from 'express';
import { createAppContainer } from '../../../../app-container';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import faker from 'faker';
import { createMockProxy } from '@tools/mock-proxy';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { createDeckMock } from '@tests/deck.mock';

describe('[API] Create deck action', () => {
  let app: Application;
  let deckRepository: DeckRepository;
  let userRegistrationRepository: UserRegistrationRepository;
  const emailChecker = createMockProxy<UniqueEmailChecker>();

  beforeAll(async () => {
    const container = await createAppContainer();
    app = container.resolve('app');
    deckRepository = container.resolve('deckRepository');
    userRegistrationRepository = container.resolve('userRegistrationRepository');
  });

  beforeEach(() => {
    emailChecker.mockClear();
  });

  test('[POST] /decks - should return error if data is invalid', async () => {
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
      .post('/decks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.details.map((detail) => detail.key)).toEqual(['name', 'description', 'tags']);
  });

  test('[POST] /decks - should return error if user is not authorized', async () => {
    const res = await request(app).post('/decks').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('[POST] /decks - should return error if user already have deck with provided name', async () => {
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

    const name = faker.name.findName();

    await deckRepository.insert(
      createDeckMock({
        ownerId: user.getId(),
        name,
      }),
    );

    const res = await request(app)
      .post('/decks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name,
        description: '#description',
        tags: ['#tag-1'],
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(`You've already created deck with name: "${name}".`);
  });

  test('[POST] /decks - should create new deck', async () => {
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

    const name = faker.name.findName();

    const res = await request(app)
      .post('/decks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name,
        description: '#description',
        tags: ['#tag-1'],
      });

    expect(res.statusCode).toEqual(201);
    expect(typeof res.body.deckId).toEqual('string');
  });
});
