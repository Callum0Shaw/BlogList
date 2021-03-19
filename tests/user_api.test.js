const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/user");
const Blog = require("../models/blogs");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await User.deleteMany({});

  const userObjects = helper.initalUsers.map((user) => new User(user));

  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
});

describe("inital test of user db", () => {
  test("correct number of users in JSON", async () => {
    const response = await api.get("/api/users");

    expect(response.body.length).toEqual(helper.initalUsers.length);
  });
});

describe("Create a new user", () => {
  test("New User saved", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "User3",
      name: "Name3",
      password: "password3",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("content-type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test("Returns 400 if username is missing", async () => {
    const noUsername = {
      name: "Name3",
      password: "password3",
    };

    await api.post("/api/users").send(noUsername).expect(400);
  });

  test("Returns 400 if password is missing", async () => {
    const noPassword = {
      username: "Username3",
      name: "Name3",
    };
    await api.post("/api/users").send(noPassword).expect(400);
  });

  test("Returns 400 if username is too short", async () => {
    const newUser = {
      username: "ab",
      name: "Name3",
      password: "password3",
    };
    await api.post("/api/users").send(newUser).expect(400)
  });
  test("Returns 400 if password is too short", async () => {
    const newUser = {
      username: "Username3",
      name: "Name3",
      password: "ab",
    };
    await api.post("/api/users").send(newUser).expect(400)
  });
});

afterAll(() => {
  mongoose.connection.close();
});
