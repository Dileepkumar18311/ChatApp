import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: true, // null for group messages
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true, // null for direct messages
    },
    messageType: {
      type: DataTypes.ENUM('text', 'image', 'file'),
      defaultValue: 'text',
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};
