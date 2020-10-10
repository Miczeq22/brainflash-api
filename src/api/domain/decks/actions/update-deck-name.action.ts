import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { UpdateDeckNameCommand } from '@app/decks/update-deck-name/update-deck-name.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const updateDeckNameActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      newName: Joi.string().trim().required(),
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
 * /decks/update-name:
 *   patch:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Updates deck name
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newName:
 *                type: string
 *              deckId:
 *                type: string
 *     responses:
 *       204:
 *        description: Deck name updated successfully
 *       422:
 *        description: Validation Error
 *       400:
 *        description: User already have deck with selected name
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const updateDeckNameAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new UpdateDeckNameCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default updateDeckNameAction;
