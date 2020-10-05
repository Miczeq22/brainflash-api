import { CommandBus } from '@app/processing/command-bus';
import { RefreshTokenCommand } from '@app/user-access/refresh-token/refresh-token.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const refreshTokenActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
});

/**
 * @swagger
 *
 * /user-access/refresh-token:
 *   post:
 *     tags:
 *       - User Access
 *     security: []
 *     summary: Refreshes token by sending new access token (JWT)
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              refreshToken:
 *                type: string
 *     responses:
 *       200:
 *        description: Token refreshed successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *       422:
 *        description: Validation Error
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const refreshTokenAction = ({ commandBus }: Dependencies): RequestHandler => (req, res, next) =>
  commandBus
    .handle(new RefreshTokenCommand(req.body.refreshToken))
    .then((accessToken) =>
      res.status(200).json({
        accessToken,
      }),
    )
    .catch(next);

export default refreshTokenAction;
