const Users = require("../models/Users");
const jwt = require("jsonwebtoken");

exports.Refresh = async (req, res) => {
  const cookie = req.cookies;
  // console.log("cookie", cookie);
  if (!cookie?.jwt) return res.sendStatus(401);

  const refreshToken = cookie.jwt;

  // console.log("refreshtoken", refreshToken);
  const checkUser = await Users.findOne({ refreshToken: refreshToken });

  // console.log("here");
  // console.log(checkUser);

  if (!checkUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log("decoded", decoded);

    if (err || checkUser.email !== decoded.UserInfo.email) {
      return res.sendStatus(403);
    }
  });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: checkUser.email,
        _id: checkUser._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ accessToken: accessToken });
};
