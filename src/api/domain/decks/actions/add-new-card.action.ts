import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { AddNewCardCommand } from '@app/decks/add-new-card/add-new-card.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const addNewCardActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      deckId: Joi.string().uuid().required(),
      question: Joi.string().trim().required(),
      answer: Joi.string().trim().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /decks/add-card:
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
 *              deckId:
 *                type: string
 *              question:
 *                type: string
 *              answer:
 *                type: string
 *     responses:
 *       201:
 *        description: Card added successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                cardId:
 *                  type: string
 *       422:
 *        description: Validation Error
 *       400:
 *        description: User already added deck with selected question
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const addNewCardAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(
      new AddNewCardCommand({
        ...req.body,
        userId: res.locals.userId,
      }),
    )
    .then((cardId) => res.status(201).json({ cardId }))
    .catch(next);

export default addNewCardAction;
