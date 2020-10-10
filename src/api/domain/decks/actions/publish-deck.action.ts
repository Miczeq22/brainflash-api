import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { PublishDeckCommand } from '@app/decks/publish-deck/publish-deck.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const publishDeckActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    deckId: Joi.string().uuid().required(),
  }),
});

/**
 * @swagger
 *
 * /decks/publish:
 *   patch:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Publishes deck
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
 *        description: Deck published successfully
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Deck is already published
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const publishDeckAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new PublishDeckCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default publishDeckAction;
