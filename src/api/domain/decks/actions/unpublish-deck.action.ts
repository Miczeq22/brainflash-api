import { UnpublishDeckCommand } from '@app/decks/unpublish-deck/unpublish-deck.command';
import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const unpublishDeckActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    deckId: Joi.string().uuid().required(),
  }),
});

/**
 * @swagger
 *
 * /decks/unpublish:
 *   patch:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Unpublishes deck
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
 *        description: Deck unpublished successfully
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Deck is already unpublished
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const unpublishDeckAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new UnpublishDeckCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default unpublishDeckAction;
