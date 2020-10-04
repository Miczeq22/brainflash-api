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
