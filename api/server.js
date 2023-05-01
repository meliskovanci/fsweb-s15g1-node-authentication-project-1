const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const session = require("express-session");
const Store = require('connect-session-knex')(session);

const UsersRouter = require("./users/users-router");
const AuthRouter = require("./auth/auth-router");

/**
  Kullanıcı oturumlarını desteklemek için `express-session` paketini kullanın!
  Kullanıcıların gizliliğini ihlal etmemek için, kullanıcılar giriş yapana kadar onlara cookie göndermeyin. 
  'saveUninitialized' öğesini false yaparak bunu sağlayabilirsiniz
  ve `req.session` nesnesini, kullanıcı giriş yapana kadar değiştirmeyin.

  Kimlik doğrulaması yapan kullanıcıların sunucuda kalıcı bir oturumu ve istemci tarafında bir cookiesi olmalıdır,
  Cookienin adı "cikolatacips" olmalıdır.

  Oturum memory'de tutulabilir (Production ortamı için uygun olmaz)
  veya "connect-session-knex" gibi bir oturum deposu kullanabilirsiniz.
 */

const server = express();

server.use(session({
  name: 'cikolatacips',
  secret: 'secret_cikolatacips',
  cookie: {
      maxAge: 1000*60*60,  //ms cinsinden geçerlilik süresi = 1 saat
      secure: false, //https only
      httpOnly: false  //js'den cookie erişimini yasakla, sadece http'ye izin var
  },
  resave: false,
  saveUninitialized: false,
  store: new Store({
      knex: require('../data/db-config'),
      tablename: 'sessions',
      sidfieldname:'sid',
      createtable: true,
      clearInterval: 1000*60*60
  })
}))

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", UsersRouter);
server.use("/api/auth", AuthRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
