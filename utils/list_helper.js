const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;

  const sumLikes = blogs.reduce(reducer, 0);

  return sumLikes;
};

const favouriteBlog = (blogs) => {
  const reducer = (mostLikes, current) => {
    mostLikes = mostLikes.likes > current.likes ? mostLikes : current;
    return mostLikes;
  };

  const favourite = blogs.reduce(reducer);

  return favourite;
};

module.exports = { dummy, totalLikes, favouriteBlog };
