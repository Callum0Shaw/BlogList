const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;

  const sumLikes = blogs.reduce(reducer, 0);

  return sumLikes;
};

module.exports = { dummy, totalLikes };
