const Users = require("../../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.SignUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !password || !email)
    return res
      .status(400)
      .json({ message: "Email , fullname and password are required." });

  // check for duplicate usernames in the db
  const duplicate = await Users.findOne({ email: email }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await Users.create({
      fullName: fullName,
      email: email,
      password: hashedPwd,
    });

    console.log(result);

    res.status(201).json({ success: `New user ${fullName} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const checkUser = await Users.findOne({ email: email });
  if (checkUser) {
    const passwordMatch = await bcrypt.compare(password, checkUser.password);

    if (passwordMatch) {
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
      const refreshToken = jwt.sign(
        {
          UserInfo: {
            email: checkUser.email,
            _id: checkUser._id,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      const patchRefreshToken = await Users.findByIdAndUpdate(
        { _id: checkUser._id },
        { refreshToken: refreshToken }
      );
      console.log("patchRefreshToken", patchRefreshToken);

  
      res.cookie('jwt' , refreshToken , { httpOnly : true  , sameSite : 'none'  , maxAge : 24*60*60*1000 })

      res.json({ accessToken: accessToken });
    } else if (!passwordMatch) {
      return res.status(402).json({ message: "passwords do not match" });
    }
  } else {
    res.status(401).json({ message: "User does not exist." });
  }
};

exports.Logout = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie.jwt) return res.sendStatus(204);

  const refreshToken = cookie.jwt;

  const match = await Users.findOne({ refreshToken: refreshToken });
  if(match){
    await Users.findOneAndUpdate({ refreshToken: refreshToken } , { refreshToken : null})
    console.log("herexxx")
    res.clearCookie('jwt' , { httpOnly : true , sameSite : 'none' , maxAge : 24*60*60*1000 })
    return res.sendStatus(204)
  }
  else if(!match){
    res.clearCookie('jwt' , { httpOnly : true , sameSite : 'none'  , maxAge : 24*60*60*1000 })
    return res.sendStatus(204)
  }
};

exports.getAllUsers = async (req, res) => {
  const body = req.userData;
  const cookie = req.cookies;

  console.log({ userData: body, cookie: cookie });

  const data = await Users.find({});

  return res
    .status(200)
    .json({ success: true, message: "All users", data: data });
};
