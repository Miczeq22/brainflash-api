import { CommandBus } from '@app/processing/command-bus';
import { celebrate, Segments, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { LoginCommand } from '@app/user-access/login/login.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const loginActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().trim().required(),
    }),
  },
  {
    abortEarly: false,
  },
);

/**
 * @swagger
 *
 * /user-access/login:
 *   post:
 *     tags:
 *       - User Access
 *     security: []
 *     summary: Login and receive tokens
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
 *     responses:
 *       200:
 *        description: User logged successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                refreshToken:
 *                  type: string
 *       422:
 *        description: Validation Error
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const loginAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(new LoginCommand(req.body))
    .then((tokens) => res.status(200).json(tokens))
    .catch(next);

export default loginAction;
