'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'chats',
      [
        {
          title: 'Sebi-Javi',
          userCreatorId: 3,
          userId: 4,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          title: 'Jorge-Roy',
          userCreatorId: 1,
          userId: 2,
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
