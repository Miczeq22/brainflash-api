import { DeleteImageCommand } from '@app/decks/delete-image/delete-image.command';
import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const deleteDeckImageActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      deckId: Joi.string().uuid().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /decks/delete-image:
 *   delete:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Deletes deck image
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
 *        description: Deck image removed successfuly
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                deckId:
 *                  type: string
 *       422:
 *        description: Validation Error
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const deleteDeckImageAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new DeleteImageCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default deleteDeckImageAction;
