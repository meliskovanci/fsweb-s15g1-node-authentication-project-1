
const db = require("../../data/db-config");
/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
  function bul() {
    return db("users").select("user_id", "username");
  } 

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */

  function goreBul(filter) {
    return db("users").where(filter);
  }

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
  function idyeGoreBul(user_id) {
    return db("users").select("user_id", "username").where("user_id", user_id).first();
  }

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
 
 async function ekle(user) {
  const [id] = await db("users").insert(user);
  return idyeGoreBul(id);

}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
};
