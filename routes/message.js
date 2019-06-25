const KoaRouter = require('koa-router');
const jwt = require('jsonwebtoken');

const router = new KoaRouter();

const axios = require('axios');

router.post('message.create', '/', async ctx => {
  const token = ctx.request.header.authorization.slice(7);
  const currentUser = jwt.verify(token, process.env.WORD_SECRET);
  console.log(currentUser);
  if (currentUser) {
    const message = ctx.orm.message.build(ctx.request.body);
    message.userId = currentUser.id;
    try {
      await message.save({
        fields: ['content', 'chatId', 'userId'],
      });
    } catch (validationError) {
      ctx.status = 500;
      ctx.message = 'Internal Server Error';
      ctx.body = { message: ctx.message, status: ctx.status };
      return ctx.body;
    }
    const chat = await ctx.orm.chat.findOne({
      where: { id: message.chatId, isActive: true },
    });
    const usersId = [];
    usersId.push(chat.userCreatorId, chat.userId);
    let otherUserId;
    if (chat.userCreatorId !== currentUser.id) {
      otherUserId = chat.userCreatorId;
    } else {
      otherUserId = chat.userId;
    }
    const firebase = {
      to: null,
      notification: {
        title: 'Nueva mensaje',
        body: 'Mensaje de ' + currentUser.username,
        click_action: 'http://localhost:3000/chats/' + chat.id,
        icon:
          'https://raw.githubusercontent.com/sialvarez/FoodTrader-Frontend/master/src/assets/img/logo.jpg',
      },
      data: {
        senderId: currentUser.id,
        message: message.content,
        receiver: otherUserId,
      },
    };
    const tokens = [];
    const firebaseTokenCurrentUser = await ctx.orm.firebaseToken.findOne({
      where: { isActive: true, userId: currentUser.id },
    });
    if (firebaseTokenCurrentUser) {
      tokens.push(firebaseTokenCurrentUser.token);
    }
    const firebaseTokenOtherUser = await ctx.orm.firebaseToken.findOne({
      where: { isActive: true, userId: otherUserId },
    });
    if (firebaseTokenOtherUser) {
      tokens.push(firebaseTokenOtherUser.token);
    }
    for (const token of tokens) {
      firebase.to = token;
      axios.post('https://fcm.googleapis.com/fcm/send', firebase, {
        headers: {
          Authorization: `key=${process.env.FCM_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    }
    ctx.status = 201;
    ctx.body = {
      message: 'Message created correctly',
      status: ctx.status,
      message: message.get({ plain: true }),
    };
    return ctx.body;
  } else {
    ctx.status = 403;
    ctx.message = 'You must be logged';
    ctx.body = { message: ctx.message, status: ctx.status };
    return ctx.body;
  }
});

module.exports = router;
