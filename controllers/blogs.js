const blogRouter = require("express").Router();
const Blog = require("../models/blogs");

blogRouter.get("/", (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => logger.error(`Failed to get blogs: ${error.message}`));
});

blogRouter.post("/", (request, response) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) =>
      logger.error(`Failed ot post new blog: ${error.message}`)
    );
});

module.exports = blogRouter;
