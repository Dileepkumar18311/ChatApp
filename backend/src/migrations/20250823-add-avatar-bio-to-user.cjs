module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'avatar');
    await queryInterface.removeColumn('Users', 'bio');
  },
};
