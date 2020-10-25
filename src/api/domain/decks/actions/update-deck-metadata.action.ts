import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { UpdateDeckMetadataCommand } from '@app/decks/update-deck-metadata/update-deck-metadata.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const updateDeckMetadataActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      deckId: Joi.string().uuid().required(),
      description: Joi.string().allow(null),
      tags: Joi.array().items(Joi.string().trim().required()).allow(null),
      imageUrl: Joi.string().allow(null),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /decks/update-metadata:
 *   patch:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Updates deck metadata
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              deckId:
 *                type: string
 *              description:
 *                type: string
 *                nullable: true
 *              tags:
 *                type: array
 *                items:
 *                  type: string
 *                nullable: true
 *              imageUrl:
 *                type: string
 *                nullable: true
 *     responses:
 *       204:
 *        description: Deck metadata updated successfully
 *       422:
 *        description: Validation Error
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const updateDeckMetadataAction = ({ commandBus }: Dependencies): RequestHandler => (
  req,
  res,
  next,
) =>
  commandBus
    .handle(
      new UpdateDeckMetadataCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then(() => res.status(204).json({}))
    .catch(next);

export default updateDeckMetadataAction;
