import jwt from 'jsonwebtoken';
import { DomainSubscriber } from '@core/shared/domain-subscriber';
import {
  UserRegisteredDomainEvent,
  ACCOUNT_REGISTERED_DOMAIN_EVENT,
} from '@core/user-access/user-registration/events/user-registered.domain-event';
import { Mailer } from '@infrastructure/mailer/mailer.types';
import { Logger } from '@infrastructure/logger/logger';
import { DomainEvents } from '@core/shared/domain-events';

interface Dependencies {
  mailer: Mailer;
  logger: Logger;
}

export class UserRegisteredSubscriber extends DomainSubscriber<UserRegisteredDomainEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public setupSubscriptions() {
    DomainEvents.register(this.sendEmailToUser.bind(this), ACCOUNT_REGISTERED_DOMAIN_EVENT);
  }

  public async sendEmailToUser(event: UserRegisteredDomainEvent) {
    const { mailer, logger } = this.dependencies;

    const token = jwt.sign(
      {
        userId: event.userId,
      },
      process.env.VERIFICATION_TOKEN_SECRET,
      {
        expiresIn: '2d',
      },
    );

    await mailer.sendMail({
      to: event.email,
      payload: {
        username: event.username,
        link: `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/register/activate?token=${token}`,
      },
      subject: 'Brainflash - Account registration',
      template: 'activate-account',
    });

    logger.info(`Account confirmation email sent to: "${event.email}"`);
  }
}
