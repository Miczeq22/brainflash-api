import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { DeleteDeckCommand } from '@app/decks/delete-deck/delete-deck.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const deleteDeckActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    deckId: Joi.string().uuid().required(),
  }),
});

/**
 * @swagger
 *
 * /decks:
 *   delete:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Deletes deck
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
 *        description: Deck deleted successfully
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Deck is already deleted
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const deleteDeckAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new DeleteDeckCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default deleteDeckAction;
