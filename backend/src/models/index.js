import { Sequelize } from 'sequelize';
import userModel from './user.js';

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://postgres:12345@localhost:5432/postgres', {
  dialect: 'postgres',
});

const User = userModel(sequelize);

export { sequelize, User };
