import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { ConfirmAccountCommand } from '@app/user-access/confirm-account/confirm-account.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const confirmAccountValidation = celebrate({
  [Segments.QUERY]: {
    token: Joi.string().trim().required(),
  },
});

/**
 * @swagger
 *
 * /register/confirm:
 *   get:
 *     tags:
 *       - User Registration
 *     security: []
 *     summary: Confirm account email
 *     parameters:
 *      - in: path
 *        name: token
 *        type: string
 *        required: true
 *        description: JWT activation token
 *     responses:
 *       204:
 *        description: Account confirmed successfully
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Account is already confirmed or expired
 *       500:
 *         description: Internal Server Error
 */
const confirmAccountAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(new ConfirmAccountCommand(req.query.token as string))
    .then(() => res.status(204).json({}))
    .catch(next);

export default confirmAccountAction;
