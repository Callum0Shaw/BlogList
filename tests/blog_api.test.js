const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blogs");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));

  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("Verify app gets correct number of blogs in JSON", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body.length).toEqual(helper.initialBlogs.length);
  expect(response.type).toEqual("application/json");
});

test("Verify that unique identifer 'id' exists", async () => {
  const blogs = await helper.blogsInDb();

  expect(blogs[0].id).toBeDefined();
});

test("Verify posting new blog correcting updates DB", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Test Author",
    url: "Test url",
    likes: 10,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const blogTitles = response.body.map((blog) => blog.title);

  expect(blogTitles.length).toEqual(helper.initialBlogs.length + 1);
  expect(blogTitles).toContain("Test Blog");
});

test("Verify Likes defualt to 0 if missing", async () => {
  const noLikesBlog = {
    title: "Test Blog",
    author: "Test Author",
    url: "Test url",
  };
  await api
    .post("/api/blogs")
    .send(noLikesBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const blogLikes = response.body.map((blog) => blog.likes);
  expect(blogLikes).toContain(0);
});

test("Verify new blogs missing title/url are rejected with 400", async () => {
  const noUrlBlog = {
    title: "Test Blog",
    author: "Test Author",
    likes: 10,
  };

  const noTitleBlog = {
    author: "Test Author",
    url: "Test url",
    likes: 10,
  };
  await api.post("/api/blogs").send(noUrlBlog).expect(400)
  await api.post("/api/blogs").send(noTitleBlog).expect(400)
});

afterAll(() => {
  mongoose.connection.close();
});
