const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = process.env.MONGODB_URI;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to MongoDB"))
  .catch((error) =>
    console.log(`Failed to connect to MongoDB: ${error.message}`)
  );

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => console.log(`Failed to get blogs: ${error.message}`));
});

app.post("/api/blogs", (request, response) => {
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
    .catch((error) => console.log(`Failed ot post new blog: ${error.message}`));
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
