// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model");

const {
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi,
} = require("./auth-middleware");

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */
  router.post("/register", usernameBostami, sifreGecerlimi, (req, res, next) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 12);
    const user = { username, password: hashedPassword };
    Users.ekle(user)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        next(err);
      });
  });

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */


  router.post("/login", usernameVarmi, (req, res) => {
    const { password } = req.body;
    const success = bcrypt.compareSync(password, req.user.password);
    if (success) {
      req.session.user = req.user;
      res.status(200).json({ message: `Hoşgeldin ${req.user.username}` });
    } else {
      res.status(401).json({ message: "Geçersiz kriter!" });
    }
  });


/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

  router.get("/logout", (req, res, next) => {
    if (req.session.user) {
      req.session.destroy((err) => {
        if (!err) {
          res.status(200).json({ message: "Çıkış yapildi" });
        } else {
          next(err);
        }
      });
    } else {
      res.status(200).json({ message: "Oturum bulunamadı!" });
    }
  });

 
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
 
module.exports = router;