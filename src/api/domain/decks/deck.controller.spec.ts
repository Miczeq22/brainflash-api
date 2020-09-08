import { Application } from 'express';
import { createAppContainer } from '../../../app-container';
import request from 'supertest';
import faker from 'faker';
import { DeckRepository } from '@core/decks/deck/deck.repository';
import { UserRegistration } from '@core/user-access/user-registration/user-registration.aggregate-root';
import { UniqueEmailChecker } from '@core/user-access/user-registration/rules/user-should-have-unique-email.rule';
import { createMockProxy } from '@tools/mock-proxy';
import jwt from 'jsonwebtoken';
import { UserRegistrationRepository } from '@core/user-access/user-registration/user-registration.repository';
import { UniqueEntityID } from '@core/shared/unique-entity-id';
import { CardRepository } from '@core/cards/card/card.repository';
import { Card } from '@core/cards/card/card.aggregate-root';
import { createDeckMock } from '@tests/deck.mock';

describe('[API] Deck controller', () => {
  let app: Application;
  let deckRepository: DeckRepository;
  let userRegistrationRepository: UserRegistrationRepository;
  let cardRepository: CardRepository;
  const emailChecker = createMockProxy<UniqueEmailChecker>();

  beforeAll(async () => {
    const container = await createAppContainer();
    app = container.resolve('app');
    deckRepository = container.resolve('deckRepository');
    userRegistrationRepository = container.resolve('userRegistrationRepository');
    cardRepository = container.resolve('cardRepository');
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

    const deck = createDeckMock({
      ownerId: user.getId(),
      name,
    });

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

    const deck = createDeckMock({
      name,
      ownerId: user.getId(),
    });

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

  test('[PUT] /decks/update-metadata - should throw an error if data is invalid', async () => {
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

    const deck = createDeckMock({
      name,
      ownerId: user.getId(),
    });

    await deckRepository.insert(deck);

    const res = await request(app)
      .put('/decks/update-metadata')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.details.map((detail) => detail.key)).toEqual(['deckId']);
  });

  test('[PUT] /decks/update-metadata - should throw an error if user is not authorized', async () => {
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

    const name = faker.name.findName();

    const deck = createDeckMock({
      name,
      ownerId: user.getId(),
    });

    await deckRepository.insert(deck);

    const res = await request(app).put('/decks/update-metadata').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('[PUT] /decks/update-metadata - should update deck metadata', async () => {
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

    const deck = createDeckMock({
      name,
      ownerId: user.getId(),
    });

    await deckRepository.insert(deck);

    const newTags = ['#new-tag-1', '#new-tag-2'];
    const newDescription = '#new-description';

    const res = await request(app)
      .put('/decks/update-metadata')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deckId: deck.getId().getValue(),
        tags: newTags,
        description: newDescription,
      });

    const updatedDeck = await deckRepository.findById(deck.getId().getValue());

    expect(res.statusCode).toEqual(204);
    expect(updatedDeck.getDescription()).toEqual(newDescription);
  });

  test('[POST] /decks/add-card - should return an error if data is invalid', async () => {
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
      .post('/decks/add-card')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.details.map((detail) => detail.key)).toEqual(['deckId', 'question', 'answer']);
  });

  test('[POST] /decks/add-card - should return an error if user is not authorized', async () => {
    process.env.JWT_TOKEN = 'secret';

    const res = await request(app).post('/decks/add-card').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('[POST] /decks/add-card - should add new card to deck', async () => {
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

    const deck = createDeckMock({
      name,
      ownerId: user.getId(),
    });

    await deckRepository.insert(deck);

    const res = await request(app)
      .post('/decks/add-card')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deckId: deck.getId().getValue(),
        question: faker.internet.domainName(),
        answer: '#answer',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.cardId).toBeTruthy();
  });

  test('[DELETE] /decks/remove-card - should return an error if data is invalid', async () => {
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
      .delete('/decks/remove-card')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.details.map((detail) => detail.key)).toEqual(['deckId', 'cardId']);
  });

  test('[DELETE] /decks/remove-card - should return an error if user is not authorized', async () => {
    process.env.JWT_TOKEN = 'secret';

    const res = await request(app).delete('/decks/remove-card').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('[DELETE] /decks/remove-card - should remove card', async () => {
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

    const deck = createDeckMock({
      name,
      ownerId: user.getId(),
    });

    await deckRepository.insert(deck);

    const cardId = new UniqueEntityID();

    cardRepository.insert(
      Card.instanceExisting(
        {
          answer: '#answer',
          createdAt: new Date(),
          deckId: deck.getId(),
          question: faker.internet.domainName(),
        },
        cardId,
      ),
    );

    const res = await request(app)
      .delete('/decks/remove-card')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deckId: deck.getId().getValue(),
        cardId: cardId.getValue(),
      });

    expect(res.statusCode).toEqual(204);
  });

  test('[DELETE] /decks - should return an error if data is invalid', async () => {
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
      .delete('/decks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.details.map((detail) => detail.key)).toEqual(['deckId']);
  });

  test('[DELETE] /decks - should return an error if user is not authorized', async () => {
    process.env.JWT_TOKEN = 'secret';

    const res = await request(app).delete('/decks').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('[DELETE] /decks - should remove card', async () => {
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

    const deck = createDeckMock({
      name,
      ownerId: user.getId(),
    });

    await deckRepository.insert(deck);

    const res = await request(app)
      .delete('/decks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deckId: deck.getId().getValue(),
      });

    expect(res.statusCode).toEqual(204);
  });

  test('[PUT] /decks/publish - should return an error if data is invalid', async () => {
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
      .put('/decks/publish')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(422);
    expect(res.body.details.map((detail) => detail.key)).toEqual(['deckId']);
  });

  test('[PUT] /decks/decks - should return an error if user is not authorized', async () => {
    process.env.JWT_TOKEN = 'secret';

    const res = await request(app).put('/decks/publish').set('Accept', 'application/json');

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual('Unauthorized.');
  });

  test('[PUT] /decks/publish - should publish card', async () => {
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

    const deck = createDeckMock({
      name,
      ownerId: user.getId(),
    });

    await deckRepository.insert(deck);

    const res = await request(app)
      .put('/decks/publish')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deckId: deck.getId().getValue(),
      });

    expect(res.statusCode).toEqual(204);
  });
});
