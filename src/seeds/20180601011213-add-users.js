module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('users', [{
      username: 'sebibi',
      password: '$2b$10$QIXOKTadNbwOLAK/gqwJeuPCcrLl4C3lEs9uJbBDGJD1YG9drEbgi',
      name: 'sebi',
      email: 'sialvarez@uc.cl',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
