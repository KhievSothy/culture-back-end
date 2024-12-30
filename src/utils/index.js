const jwt = require("jsonwebtoken");

function signJWT(id, email, username, fullname) {
  const token = jwt.sign(
    { id: id, email: email, username: username, fullname: fullname },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return token;
}

module.exports = { signJWT };
