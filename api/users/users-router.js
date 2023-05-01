// `sinirli` middleware'ını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!

const router = require("express").Router();
const Users = require("./users-model");
const { sinirli } = require("../auth/auth-middleware");

/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  status: 401
  {
    "message": "Geçemezsiniz!"
  }
 */

  router.get("/", sinirli, (req, res, next) => {
    Users.bul()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        next(err);
      });
  });


// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

module.exports = router;