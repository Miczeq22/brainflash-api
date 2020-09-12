import { EnrollDeckCommand } from '@app/decks/enroll-deck/enroll-deck.command';
import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const enrollDeckActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    deckId: Joi.string().uuid().required(),
  }),
});

/**
 * @swagger
 *
 * /decks/enroll:
 *   post:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Enrolls selected deck
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
 *        description: Deck enrolled successfully
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Deck is already enrolled
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const enrollDeckAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new EnrollDeckCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default enrollDeckAction;
