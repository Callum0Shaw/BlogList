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

const mostBlogs = (blogs) => {
  const listAuthors = blogs.map((blog) => blog.author);
  const counts = {};
  let mostFreq = "";

  listAuthors.forEach((author) => {
    if (counts[author]) {
      counts[author]++;
      if (counts[author] > counts[mostFreq] || !counts[mostFreq]) {
        mostFreq = author;
      }
    } else {
      counts[author] = 1;
    }
  });

  return mostFreq;
};

const mostLikes = (blogs) => {
  const reducer = (mostLiked, currentBlog) => {
    return mostLiked.likes > currentBlog.likes ? mostLiked : currentBlog;
  };

  const mostLikedBlog = blogs.reduce(reducer);

  return {
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  };
};

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };
