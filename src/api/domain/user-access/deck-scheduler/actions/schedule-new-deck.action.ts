import { CommandBus } from '@app/processing/command-bus';
import { ScheduleDeckCommand } from '@app/user-access/schedule-deck/schedule-deck.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const scheduleNewDeckActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      deckId: Joi.string().uuid().required(),
      scheduledDate: Joi.date().timestamp().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /deck-scheduler:
 *   post:
 *     tags:
 *       - Deck Scheduler
 *     security:
 *      - bearerAuth: []
 *     summary: Creates new deck
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              deckId:
 *                type: string
 *              scheduledDate:
 *                type: string
 *     responses:
 *       204:
 *        description: Deck scheduled successfully
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Deck is already scheduled
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const scheduleNewDeckAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new ScheduleDeckCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default scheduleNewDeckAction;
