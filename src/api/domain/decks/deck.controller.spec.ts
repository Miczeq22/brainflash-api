import { Application } from 'express';
import { createAppContainer } from '../../../app-container';
import request from 'supertest';
import faker from 'faker';
import { DeckRepository } from '@core/decks/decks/deck.repository';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';
import { createMockProxy } from '@tools/mock-proxy';
import jwt from 'jsonwebtoken';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { Deck } from '@core/decks/decks/deck.aggregate-root';
import { UniqueEntityID } from '@core/shared/unique-entity-id';

describe('[API] Deck controller', () => {
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
      Deck.instanceExisting(
        {
          name,
          cardIDs: [],
          createdAt: new Date(),
          description: '#description',
          ownerId: user.getId(),
          tags: ['#tag-1'],
        },
        new UniqueEntityID(),
      ),
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

  test('[PUT] /decks/update-name - should return error if data is invalid', async () => {
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
      .put('/decks/update-name')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.details.map((detail) => detail.key)).toEqual(['newName', 'deckId']);
  });

  test('[PUT] /decks/update-name - should return error if user is not authorized', async () => {
    const res = await request(app).put('/decks/update-name').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('[PUT] /decks/update-name - should return error if deck name is not unique', async () => {
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

    const deck = Deck.instanceExisting(
      {
        name,
        cardIDs: [],
        createdAt: new Date(),
        description: '#description',
        ownerId: user.getId(),
        tags: ['#tag-1'],
      },
      new UniqueEntityID(),
    );

    await deckRepository.insert(deck);

    const res = await request(app)
      .put('/decks/update-name')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        newName: name,
        deckId: deck.getId().getValue(),
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual(`You've already created deck with name: "${name}".`);
  });

  test('[PUT] /decks/update-name - should update deck name', async () => {
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

    const deck = Deck.instanceExisting(
      {
        name,
        cardIDs: [],
        createdAt: new Date(),
        description: '#description',
        ownerId: user.getId(),
        tags: ['#tag-1'],
      },
      new UniqueEntityID(),
    );

    await deckRepository.insert(deck);

    const res = await request(app)
      .put('/decks/update-name')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        newName: faker.name.findName(),
        deckId: deck.getId().getValue(),
      });

    expect(res.statusCode).toEqual(204);
  });
});
