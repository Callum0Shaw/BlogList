const blogRouter = require("express").Router();
const Blog = require("../models/blogs");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });
  const result = await blog.save()
  return response.status(201).json(result)
  
});

module.exports = blogRouter;
