const Blog = require("../models/blogs");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const initialBlogs = [
  {
    title: "Blog 1",
    author: "Author 1",
    url: "url 1",
    likes: 1,
  },
  {
    title: "Blog 2",
    author: "Author 2",
    url: "url 2",
    likes: 2,
  },
  {
    title: "Blog 3",
    author: "Author 3",
    url: "url 3",
    likes: 3,
  },
];

const initalUsers = [
  {
    username: "username1",
    name: "name1",
    password: "password1"
  },
  {
    username: "username2",
    name: "name2",
    password: "password2"
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const getUser1 = async () => {
  const user = await User.findOne({username: "username1"})
  return user
}

const nonExistantId = async () => {
  const blog = new Blog({
    title: "Test",
    author: "Test",
    url: "Test",
  });
  await blog.save();
  await blog.remove();

  return blog.id.toString();
};

const getToken = async (username, id) => {
  const userForToken = {
    username,
    id,
  }
  const token = jst.sign(userForToken, process.env.SECRET)
  return token
}

module.exports = { initialBlogs, blogsInDb, nonExistantId, usersInDb, initalUsers, getUser1, getToken };
