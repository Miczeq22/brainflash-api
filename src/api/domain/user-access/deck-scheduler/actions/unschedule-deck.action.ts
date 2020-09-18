import { CommandBus } from '@app/processing/command-bus';
import { UnscheduleDeckCommand } from '@app/user-access/unschedule-deck/unschedule-deck.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const unschedulDeckActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    deckId: Joi.string().uuid().required(),
  }),
});

/**
 * @swagger
 *
 * /deck-scheduler/unschedule:
 *   delete:
 *     tags:
 *       - Deck Scheduler
 *     security:
 *      - bearerAuth: []
 *     summary: Unschedules deck
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              deckId:
 *                type: string
 *     responses:
 *       204:
 *        description: Deck unscheduled successfully
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Deck is not scheduled
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const unscheduleDeckAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new UnscheduleDeckCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default unscheduleDeckAction;
