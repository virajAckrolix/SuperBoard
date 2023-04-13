const Users = require("../../models/Users")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.SignUp  = async (req, res) => {
    const { fullName , email , password } = req.body;
    if (!fullName || !password || !email) return res.status(400).json({ 'message': 'Email , fullname and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await Users.findOne({ email: email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await Users.create({
            fullName : fullName,
            email: email,
            password: hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${fullName} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

exports.Login = async (req , res) => {
    const {email , password} = req.body
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const checkUser = await Users.findOne({email : email})
    if(checkUser){
        const passwordMatch = await bcrypt.compare(checkUser.password , password)

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    email: checkUser.email,
                    _id : checkUser._id
                    
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            {
                UserInfo: {
                    email: checkUser.email,
                    _id : checkUser._id
                    
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('jwt' , refreshToken , { httpOnly : true , maxAge : 24 * 60 * 60 * 1000})
        res.json({accessToken : accessToken})
    }else{
        res.status(401).json({message : "User does not exist."})
    }
}



