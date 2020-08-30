import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { UpdateUserPasswordCommand } from '@app/user-access/update-user-password/update-user-password.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const updateUserPasswordValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      oldPassword: Joi.string().trim().required(),
      newPassword: Joi.string().trim().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /user-access/update-password:
 *   put:
 *     tags:
 *       - User Access
 *     security:
 *      - bearerAuth: []
 *     summary: Update user password
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              oldPassword:
 *                type: string
 *              newPassword:
 *                type: string
 *     responses:
 *       204:
 *        description: Password updated successfully
 *       422:
 *        description: Validation Error
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const updateUserPasswordAction = ({ commandBus }: Dependencies): RequestHandler => (
  req,
  res,
  next,
) =>
  commandBus
    .handle(new UpdateUserPasswordCommand({ ...req.body, userId: res.locals.userId }))
    .then(() => res.status(204).json({}))
    .catch(next);

export default updateUserPasswordAction;
