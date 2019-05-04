'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Jorge',
          username: 'jabecerra',
          password: bcrypt.hashSync('123456', 10),
          address: 'Backend',
          email: 'jorge@backend.cl',
          isOrganization: false,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          name: 'Rodrigo',
          username: 'roy350',
          password: bcrypt.hashSync('123456', 10),
          address: 'Backend',
          email: 'rodrigo@backend.cl',
          isOrganization: false,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          name: 'Javiera',
          username: 'jatrijori',
          password: bcrypt.hashSync('123456', 10),
          address: 'Frontend',
          email: 'javiera@frontend.cl',
          isOrganization: false,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          name: 'Sebastian',
          username: 'sebibi',
          password: bcrypt.hashSync('123456', 10),
          address: 'Frontend',
          email: 'sebastian@frontend.cl',
          isOrganization: false,
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
