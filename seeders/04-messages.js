'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'messages',
      [
        {
          content: 'Hola Sebi',
          userId: 4,
          chatId: 1,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          content: 'Hola Javi',
          userId: 3,
          chatId: 1,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          content: 'Hola Jorge',
          userId: 2,
          chatId: 2,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          content: 'Hola Roy',
          userId: 1,
          chatId: 2,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          content: 'Hola Sebi',
          userId: 2,
          chatId: 3,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          content: 'Hola Roy',
          userId: 4,
          chatId: 3,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
      ],
      {}
    );
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.sequelize.query(
      'alter sequence users_id_seq restart with 1;'
    );
  },
};
