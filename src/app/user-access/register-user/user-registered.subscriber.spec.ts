import jwt from 'jsonwebtoken';
import { createMockProxy } from '@tools/mock-proxy';
import { Mailer } from '@infrastructure/mailer/mailer.types';
import { UserRegisteredSubscriber } from './user-registered.subscriber';
import { Logger } from '@infrastructure/logger/logger';
import { UserRegisteredDomainEvent } from '@core/user-access/user-registration/events/user-registered.domain-event';

describe('[App] User registered subscriber', () => {
  const mailer = createMockProxy<Mailer>();
  const logger = createMockProxy<Logger>();

  beforeEach(() => {
    mailer.mockClear();
    logger.mockClear();
  });

  test('should send email with proper payload', async () => {
    process.env.VERIFICATION_TOKEN_SECRET = 'secret';

    const subscriber = new UserRegisteredSubscriber({
      mailer,
      logger,
    });

    await subscriber.sendEmailToUser(
      new UserRegisteredDomainEvent('#email', '#username', '#user-id'),
    );

    const mailPayload = mailer.sendMail.mock.calls[0][0];

    expect(mailPayload.to).toEqual('#email');

    // @ts-ignore
    const tokenPayload = jwt.decode(mailPayload.payload.link.split('?token=')[1]) as any;

    expect(tokenPayload.userId).toEqual('#user-id');
  });
});
