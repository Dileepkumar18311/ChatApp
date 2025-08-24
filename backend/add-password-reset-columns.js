import { sequelize } from './src/models/index.js';

async function addPasswordResetColumns() {
  try {
    // Add resetPasswordToken column
    await sequelize.getQueryInterface().addColumn('Users', 'resetPasswordToken', {
      type: sequelize.Sequelize.STRING,
      allowNull: true,
    });
    
    // Add resetPasswordExpires column
    await sequelize.getQueryInterface().addColumn('Users', 'resetPasswordExpires', {
      type: sequelize.Sequelize.DATE,
      allowNull: true,
    });
    
    console.log('Password reset columns added successfully!');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Columns already exist, skipping...');
    } else {
      console.error('Error adding columns:', error.message);
    }
  } finally {
    await sequelize.close();
  }
}

addPasswordResetColumns();
