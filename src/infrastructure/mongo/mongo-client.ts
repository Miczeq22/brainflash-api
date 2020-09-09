import MongoClient from 'mongodb';

export const createMongoClient = () =>
  MongoClient.connect(
    `${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
    {
      useUnifiedTopology: true,
    },
  );
