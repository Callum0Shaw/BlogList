const blogRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });

  return response.json(blogs);
});

blogRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const user = request.user

  if (!request.token || !user._id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  return response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user

  if (blog.user.toString() !== user.id.toString()) {
    response.status(401).json({ error: "missing or invalid" });
  }
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
  const body = request.params.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog.toJSON());
});

module.exports = blogRouter;
