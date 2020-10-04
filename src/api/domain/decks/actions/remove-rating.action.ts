import { RemoveRatingCommand } from '@app/decks/remove-rating/remove-rating.command';
import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const removeRatingActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    deckId: Joi.string().uuid().required(),
  }),
});

/**
 * @swagger
 *
 * /decks/remove-rating:
 *   delete:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Remove deck rating
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
 *        description: Deck rating removed successfully
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Deck is not assessed
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const removeRatingAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new RemoveRatingCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default removeRatingAction;
