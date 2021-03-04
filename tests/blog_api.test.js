const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app)
const Blog = require('../models/blogs');

let initialBlogs = [
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
]


beforeEach(async () => {
  await Blog.deleteMany({})
 
  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

})

test("Verify app gets correct number of blogs in JSON", async () => {
  await api.get("/api/blogs").expect(200).expect("Content-Type", /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})