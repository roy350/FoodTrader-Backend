const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new KoaRouter();

router.get('chats', '/', async ctx => {
  console.log('hola');
  const token = ctx.request.header.authorization.slice(7);
  const { Op } = ctx.orm.Sequelize;
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const chats = await ctx.orm.chat
        .findAll({
          where: {
            isActive: true,
            [Op.or]: [
              {
                userCreatorId: currentUser.id,
              },
              {
                userId: currentUser.id,
              },
            ],
          },
        })
        .map(element => element.get({ plain: true }));
      const response = [];
      for (const chat of chats) {
        const usersId = [];
        usersId.push(chat.userCreatorId, chat.userId);
        let otherUserId;
        if (chat.userCreatorId !== currentUser.id) {
          otherUserId = chat.userCreatorId;
        } else {
          otherUserId = chat.userId;
        }
        const user = await ctx.orm.user.findOne({
          where: { id: otherUserId },
        });
        const messages = await ctx.orm.message
          .findAll({
            where: { isActive: true, chatId: chat.id },
          })
          .map(element => element.get({ plain: true }));
        response.push({ chat, user: user.get({ plain: true }), messages });
      }
      ctx.body = response;
      return ctx.body;
    } catch (validationError) {
      ctx.status = 500;
      ctx.message = 'Internal Server Error';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

router.get('chat', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const initialChat = await ctx.orm.chat.findOne({
        where: { id: ctx.params.id, isActive: true },
      });
      if (!initialChat) {
        ctx.status = 404;
        ctx.message = 'Chat not found';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
      const chat = initialChat.get({ plain: true });
      const usersId = [];
      usersId.push(chat.userCreatorId, chat.userId);
      let otherUserId;
      if (chat.userCreatorId !== currentUser.id) {
        otherUserId = chat.userCreatorId;
      } else {
        otherUserId = chat.userId;
      }
      const user = await ctx.orm.user.findOne({
        where: { id: otherUserId },
      });
      const messages = await ctx.orm.message
        .findAll({
          where: { isActive: true, chatId: chat.id },
        })
        .map(element => element.get({ plain: true }));
      ctx.body = { chat, user: user.get({ plain: true }), messages };
      return ctx.body;
    } catch (validationError) {
      ctx.status = 500;
      ctx.message = 'Internal Server Error';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

router.post('chat.create', '/', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    const chat = ctx.orm.chat.build(ctx.request.body);
    chat.userCreatorId = currentUser.id;
    console.log(chat.userId);
    console.log(chat.userCreatorId);
    const oldChat1 = await ctx.orm.chat.findOne({
      where: {
        isActive: true,
        userCreatorId: chat.userCreatorId,
        userId: chat.userId,
      },
    });
    const oldChat2 = await ctx.orm.chat.findOne({
      where: {
        isActive: true,
        userId: chat.userCreatorId,
        userCreatorId: chat.userId,
      },
    });
    if (oldChat1) {
      const chat1 = oldChat1.get({ plain: true });
      ctx.status = 201;
      ctx.body = {
        status: ctx.status,
        id: chat1.id,
      };
      return ctx.body;
    } else if (oldChat2) {
      const chat2 = oldChat2.get({ plain: true });
      ctx.status = 201;
      ctx.body = {
        status: ctx.status,
        id: chat2.id,
      };
      return ctx.body;
    } else {
      try {
        await chat.save({
          fields: ['title', 'userCreatorId', 'userId'],
        });
        const message = ctx.orm.message.build();
        const otherUser = await ctx.orm.user.findOne({
          where: {
            id: chat.userId,
          },
        });
        message.content = 'Hola ' + otherUser.name;
        message.userId = currentUser.id;
        message.chatId = chat.id;
        try {
          await message.save({
            fields: ['content', 'userId', 'chatId'],
          });
        } catch (validationError) {
          ctx.status = 500;
          ctx.message = 'Internal Server Error';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
      } catch (validationError) {
        ctx.status = 500;
        ctx.message = 'Internal Server Error';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
      ctx.status = 201;
      ctx.body = {
        message: 'Chat created correctly',
        status: ctx.status,
        chat: chat.get({ plain: true }),
      };
      return ctx.body;
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

router.del('user.delete', '/:id', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  if (currentUser) {
    try {
      const chat = await ctx.orm.chat.findOne({
        where: { id: ctx.params.id },
      });
      if (!chat) {
        ctx.status = 404;
        ctx.message = 'Chat not found';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
      if (
        currentUser.id === chat.userId ||
        currentUser.id === chat.userCreatorId
      ) {
        try {
          const isActive = false;
          await chat.update({ isActive });
        } catch (validationError) {
          ctx.status = 500;
          ctx.message = 'Internal Server Error';
          ctx.body = { message: ctx.message, status: ctx.status };
          return ctx.body;
        }
        ctx.status = 200;
        ctx.body = {
          message: 'Chat deleted correctly',
          status: ctx.status,
          chat: chat.get({ plain: true }),
        };
        return ctx.body;
      } else {
        ctx.status = 401;
        ctx.message = 'Unauthorized for update chat';
        ctx.body = { message: ctx.message, status: ctx.status };
        return ctx.body;
      }
    } catch (validationError) {
      ctx.status = 500;
      ctx.message = 'Internal Server Error';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

module.exports = router;
