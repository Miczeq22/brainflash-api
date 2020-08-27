import { celebrate, Segments, Joi } from 'celebrate';
import { CommandBus } from '@app/processing/command-bus';
import { RequestHandler } from 'express';
import { RegisterUserCommand } from '@app/user-access/register-user/register-user.command';

interface Dependecies {
  commandBus: CommandBus;
}

export const RegisterUserValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).trim().required(),
      username: Joi.string().min(3).trim().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /register:
 *   post:
 *     tags:
 *       - User registration
 *     security: []
 *     summary: Register new user account
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              username:
 *                type: string
 *     responses:
 *       201:
 *        description: Account registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *       422:
 *        description: Validation Error
 *       400:
 *        description: Email already taken error
 *       500:
 *         description: Internal Server Error
 */
const registerUserAction = ({ commandBus }: Dependecies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(new RegisterUserCommand(req.body))
    .then(() =>
      res.status(201).json({
        success: true,
      }),
    )
    .catch(next);

export default registerUserAction;
