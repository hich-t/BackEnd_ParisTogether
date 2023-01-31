const express = require("express");
const authRouter = express.Router();
const User = require("../models/UsersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { request } = require("express");
authRouter.use(express.json());

authRouter.post("/registrer", async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(409).send("Email already exist");
  if (req.body.password !== req.body.confirm_password)
    return res.status(409).send("Confirmation password is not Ok");
  if (!emailExist && req.body.password === req.body.confirm_password) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashPassword,
    });
    user.save();

    const token = jwt.sign({ user }, process.env.SECRET);
    res.header("auth-token", token);
    res.json(token);
  }
});

authRouter.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");
  console.log(user);
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Password is not valid");

  const token = jwt.sign({ user }, process.env.SECRET);
  res.header({ "auth-token": token });
  res.json(token);
});

authRouter.get("/user", async (req, res) => {
  let checkToken = jwt.verify(req.headers.authorization, process.env.SECRET);
  let id = checkToken.user._id;
  User.findOne({ _id: id })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

authRouter.put("/user", async (req, res) => {
  let checkToken = jwt.verify(req.headers.authorization, process.env.SECRET);
  let id = checkToken.user._id;
  const user = await User.findOne({ _id: id });
  if (user.favoriteEvent.includes(req.body.favoriteEvent))
    return res.status(400).send("Already in your favorite");

  User.findOneAndUpdate({ _id: id }, { $push: req.body })
    .then((NewUser) => res.json(NewUser))
    .catch((err) => res.json(err));
});

authRouter.delete("/user", async (req, res) => {
  console.log(req.body.favoriteEvent);
  console.log(req.headers.authorization);

  let checkToken = jwt.verify(req.headers.authorization, process.env.SECRET);

  let id = checkToken.user._id;
  User.findOneAndUpdate({ _id: id }, { $pull: req.body })
    .then((NewUser) => res.json(NewUser))
    .catch((err) => res.json(err));
});

module.exports = authRouter;
