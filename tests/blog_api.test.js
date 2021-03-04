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

describe("Inital test of database", () => {
  test("correct number of blogs in JSON", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body.length).toEqual(helper.initialBlogs.length);
    expect(response.type).toEqual("application/json");
  });

  test("Verify that unique identifer 'id' exists", async () => {
    const blogs = await helper.blogsInDb();

    expect(blogs[0].id).toBeDefined();
  });
});

describe("Posting new blog", () => {
  test("correctly updates DB", async () => {
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

  test("Likes defualt to 0 if missing", async () => {
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

  test("Missing title/url are rejected with 400", async () => {
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
    await api.post("/api/blogs").send(noUrlBlog).expect(400);
    await api.post("/api/blogs").send(noTitleBlog).expect(400);
  });
});

describe("Deleting a post", () => {
  test("Succeeds with status code of 204 if correct id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    console.log(blogsAtStart);
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAfter = await helper.blogsInDb();
    expect(blogsAfter.length).toEqual(blogsAtStart.length - 1);
    const titles = blogsAfter.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
  test("Fails with 400 if incorrect id", async () => {
    await api.delete(`/api/blogs/${helper.nonExistantId()}`).expect(400);
  });
});

describe("Updating blog post", () => {
  test("Update likes", async () => {
    const blogs = await helper.blogsInDb();
    const toUpdate = blogs[0];

    await Blog.findByIdAndUpdate(toUpdate.id, { likes: 100 }, { new: true });

    const blogsAfter = await helper.blogsInDb();
    const updatedLikes = blogsAfter.map((blog) => blog.likes);

    expect(updatedLikes).toContain(100);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
