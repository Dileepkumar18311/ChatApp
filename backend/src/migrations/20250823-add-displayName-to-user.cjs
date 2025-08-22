module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'displayName', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'displayName');
  },
};
