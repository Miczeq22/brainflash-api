import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { RemoveCardCommand } from '@app/decks/remove-card/remove-card.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const removeCardActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      deckId: Joi.string().uuid().required(),
      cardId: Joi.string().uuid().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /decks/remove-card:
 *   delete:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Removes card from deck
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              cardId:
 *                type: string
 *              deckId:
 *                type: string
 *     responses:
 *       204:
 *        description: Card removed successfully from deck
 *       422:
 *        description: Validation Error
 *       400:
 *        description: User already have deck with selected name
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const removeCardAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new RemoveCardCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default removeCardAction;
