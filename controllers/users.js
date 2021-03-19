const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Blog = require("../models/blogs");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });

  return response.json(users);
});

userRouter.post("/", async (request, response, next) => {
  const body = request.body;

  if (body.password === undefined || body.password.length < 4) {
    return response.status(400).json({ error: "Invalid password" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = userRouter;
