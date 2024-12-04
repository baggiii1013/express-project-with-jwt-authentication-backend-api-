const asyncHandler = require("express-async-handler");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc register a user
//@route post/api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All the fields are mandatory!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("Email already registered");
  }

  //Hash password
  const hashedPassword = await bcrpyt.hash(password, 10);
  console.log("Hashed password :" + hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("user data is not valid");
  }
  console.log(`User created successfully ${user}`);
  res.json({ message: "Register the user " });
});

//@desc login a user
//@route post/api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All the fields are mandatory!");
  }
  const user = await User.findOne({ email });
  // compare the passwords
  if (user && (await bcrpyt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m"
      }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password not found");
  }
});

//@desc current user
//@route get/api/user/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
