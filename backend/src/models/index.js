import { Sequelize } from 'sequelize';
import userModel from './user.js';
import messageModel from './Message.js';

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://postgres:12345@localhost:5432/postgres', {
  dialect: 'postgres',
});

const User = userModel(sequelize);
const Message = messageModel(sequelize);

// Define associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export { sequelize, User, Message };
