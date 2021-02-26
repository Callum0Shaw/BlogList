const listHelper = require("../utils/list_helper");

describe("Total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Blog1",
      author: "Author1",
      url: "url.com",
      likes: 5,
      __v: 0,
    },
  ];

  test("with one blog", () => {
    const result = listHelper.totalLikes(listWithOneBlog);

    expect(result).toBe(5);
  });

  const listWithMultipleBlogs = [
    {
      _id: "5a422ab71b54a676234d17f8",
      title: "Blog2",
      author: "Author1",
      url: "url.com",
      likes: 1,
      __v: 0,
    },
    {
      _id: "5a422aa71b55a676234d17f8",
      title: "Blog3",
      author: "Author1",
      url: "url.com",
      likes: 0,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "Blog4",
      author: "Author1",
      url: "url.com",
      likes: 99,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Blog5",
      author: "Author2",
      url: "url.com",
      likes: 10,
      __v: 0,
    },
  ];

  test("with one 4 blogs", () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);

    expect(result).toBe(110);
  });
});
