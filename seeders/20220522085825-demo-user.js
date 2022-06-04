const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("password", 10);
    return queryInterface.bulkInsert("Users", [
      {
      firstName: "Tristan",
      lastName: "Gautama",
      email: "example@example.com",
      password: "password",
      dateOfBirth: "19-12-2004",
      gender: "Male",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};