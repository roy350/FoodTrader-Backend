'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'publications',
      [
        {
          title: 'Piña',
          content: 'Piña deliciosa',
          place: 'Vitacura',
          image:
            'http://2.bp.blogspot.com/-s60TKw_snpM/T4lOptuCKdI/AAAAAAAAJjw/D__Gf7cZk-E/s1600/156188_437354362948112_109752169041668_1874688_427113254_n.jpg',
          userId: 1,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          title: 'Frutillas',
          content: 'Frutilla natural',
          place: 'Santiago Centro',
          image:
            'https://aldianews.com/sites/default/files/styles/article_image/public/articles/fresas_articulo.jpg?itok=bx8v5DjF',
          userId: 2,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          title: 'Paltas',
          content: 'Palta natural, cultivada en mi propio jardín',
          place: 'Ñuñoa',
          image: 'https://img.yapo.cl/images/36/3635145001.jpg',
          userId: 3,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          title: 'Vienesas',
          content: 'Vienesas veganas compradas hace 5 días',
          place: 'Las Condes',
          image:
            'https://emporio4estaciones.cl/image/cache/catalog/404/emporio4estaciones-vienesaveggie250-min-1000x1000.jpg',
          userId: 4,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          title: 'Yoghurt',
          content: 'Yoghurt Colun light de distintos sabores',
          place: 'Vitacura',
          image:
            'https://scontent.cdninstagram.com/vp/cfc491db62fe62b9837c14bdee0ce31b/5D409D48/t51.2885-15/e35/c135.0.810.810a/s480x480/44674367_367698093803259_6716032249010125812_n.jpg?_nc_ht=scontent-msp1-1.cdninstagram.com',
          userId: 1,
          createdAt: '2019-04-14 19:11:36.847+00',
          updatedAt: '2019-04-14 19:11:36.847+00',
        },
        {
          title: 'Papayas',
          content: 'Papayas naturales cultivadas en mi huerto',
          place: 'La Serena',
          image:
            'https://www.chileestuyo.cl/wp-content/uploads/2016/04/papayas.jpg',
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
