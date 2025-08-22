import { Sequelize } from 'sequelize';
import userModel from './user.js';

const sequelize = new Sequelize('postgres', 'postgres', '12345', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});

const User = userModel(sequelize);

export { sequelize, User };
