import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { CreateNewDeckCommand } from '@app/decks/create-new-deck/create-new-deck.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const createDeckActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim().required(),
      description: Joi.string().trim().required(),
      tags: Joi.array().items(Joi.string().trim().required()).required(),
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
 * /decks:
 *   post:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Creates new deck
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              tags:
 *                type: array
 *                items:
 *                  type: string
 *              imageUrl:
 *                  type: string
 *                  nullable: true
 *     responses:
 *       201:
 *        description: Deck created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                deckId:
 *                  type: string
 *       422:
 *        description: Validation Error
 *       400:
 *        description: User already have deck with selected name
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const createDeckAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new CreateNewDeckCommand({
        ...req.body,
        ownerId: res.locals.userId,
      }),
    )
    .then((deckId) =>
      res.status(201).json({
        deckId,
      }),
    )
    .catch(next);

export default createDeckAction;
