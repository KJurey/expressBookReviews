const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if the username is already taken
  const existingUser = users.find((user) => user.username === username);
  return !!existingUser;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find((u) => u.username === username && u.password === password);
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    // Get the login data from the request body
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username and password match a registered user
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token for the user
  const token = jwt.sign({ username }, "your-secret-key");

  // Store the token in the session
  req.session.authorization = { accessToken: token };
  console.log(req.session.authorization);

  // Return a success response with the JWT token
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req.session;

  if (books[isbn].reviews.hasOwnProperty(username)) {
    // User has already posted a review, modify the existing one
    books[isbn].reviews[username] = review;
  } else {
    // User has not posted a review, add a new review
    books[isbn].reviews[username] = review;
  }

  return res.status(200).json({ message: "Review added/modified successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { username } = req.session;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const reviews = books[isbn].reviews;
  
    if (!reviews.hasOwnProperty(username)) {
      return res.status(404).json({ message: "Review not found" });
    }
  
    delete reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully" });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;