import cors, { CorsOptions } from 'cors';

const WHITE_LIST: string[] | RegExp[] = process.env.CORS_WHITE_LIST
  ? process.env.CORS_WHITE_LIST.split(' ')
  : [];

export const corsOptions: CorsOptions = {
  origin: process.env.NODE_ENV === 'production' ? WHITE_LIST : [/localhost/],
  credentials: true,
};

export default cors(corsOptions);
