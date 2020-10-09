import { AddRatingCommand } from '@app/decks/add-rating/add-rating.command';
import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const addRatingActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object({
      deckId: Joi.string().uuid().required(),
      rating: Joi.number().integer().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /decks/add-rating:
 *   put:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Add deck rating
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              deckId:
 *                type: string
 *              rating:
 *                type: number
 *     responses:
 *       204:
 *        description: Deck rating added successfully
 *       422:
 *        description: Validation Error
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const addRatingAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new AddRatingCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default addRatingAction;
