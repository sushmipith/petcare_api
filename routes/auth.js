const router = require("express").Router();
const User = require("../model/User");
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

// Register new user
router.post("/register", async (req, res) => {
  //Validate the date before creating
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //Check if user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  //Hash the password
  const salt = await bcrpyt.genSalt(10);
  const hashedPassword = await bcrpyt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login user
router.post("/login", async (req, res) => {
  //Validate the date before login
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //Check if email exists in the database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email doesn't exists");
  }

  //Password is correct
  const validPass = await bcrpyt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("Password is wrong");
  }

  //Create and assign a token
  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send({
    id: user._id,
    name: user.name,
    email: user.email,
    auth_token: token,
  });
});

module.exports = router;
