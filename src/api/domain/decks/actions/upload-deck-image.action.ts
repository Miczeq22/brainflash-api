import { RequestHandler } from 'express';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import multer from 'multer';
import { BusinessRuleValidationError } from '@errors/business-rule-validation.error';

require('dotenv').config();

const s3 = new AWS.S3({
  secretAccessKey: process.env.S3_SECRET_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  apiVersion: 'v4',
});

export const multerUpload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (_, file, cb) => {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      // @ts-ignore
      cb(new BusinessRuleValidationError('File extension is not supported'), false);
    } else {
      cb(null, true);
    }
  },
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    key: (req, file, cb) => {
      cb(
        null,
        `${file.originalname.split('.')[0]}-${Date.now()}.${file.originalname.split('.').pop()}`,
      );
    },
  }),
});

/**
 * @swagger
 *
 * /decks/upload-image:
 *   post:
 *     tags:
 *       - Decks
 *     security:
 *      - bearerAuth: []
 *     summary: Uploads image for deck
 *     requestBody:
 *       content:
 *        multipart/form-data:
 *         schema:
 *          type: object
 *          properties:
 *           file:
 *            type: string
 *            format: binary
 *     responses:
 *       201:
 *        description: Deck image uploaded successfully
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
 *        description: File is not supported or invalid file extension
 *       401:
 *        description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
const uploadDeckImageAction = (): RequestHandler => (req, res, next) => {
  if (!req.file) {
    next(new BusinessRuleValidationError('File is not provided.'));
  }

  return res.status(201).json({
    fileName: req.file.originalname,
    fileLocation: (req.file as any).location,
  });
};

export default uploadDeckImageAction;
