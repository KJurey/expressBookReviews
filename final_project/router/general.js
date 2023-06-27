const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  // Get the registration data from the request body
  const { username, password } = req.body;

  // Check if the username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is already taken
  if (isValid(username)) {
    return res.status(400).json({ message: "Username is already taken" });
  }

  // Create a new user object
  const user = {
    username,
    password
  };

  // Add the new user to the list of users
  users.push(user);

  // Return a success response
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      const bookList = response.data.books;
      return res.status(200).json({ books: bookList });
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving book list" });
    }
  });

  //public_users.get('/',function (req, res) {
  //Write your code here
    // Get the list of books from your database or data source
    //const books = require("../router/booksdb.js");

    // Extract the book details from the books object
    //const bookList = Object.values(books);
  
    // Return the book list as a JSON response
    //return res.status(200).json({ books: bookList });
//});

// Get book details based on ISBN

public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const { isbn } = req.params;
      const response = await axios.get(`http://localhost:5000/books/${isbn}`);
      const book = response.data.book;
      return res.status(200).json({ book });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Book not found" });
      } else {
        return res.status(500).json({ message: "Error retrieving book details" });
      }
    }
  });
//public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // Get the ISBN parameter from the request URL
  //const { isbn } = req.params;

  // Get the list of books from your database or data source
  //const books = require("../router/booksdb.js");

  // Find the book with the matching ISBN
  //const book = books[isbn];

  //if (book) {
    // If the book is found, return its details as a JSON response
    //return res.status(200).json({ book });
  //} else {
    // If the book is not found, return an error response
    //return res.status(404).json({ message: "Book not found" });
  //}
 //});
  
// Get book details based on author

public_users.get('/author/:author', async (req, res) => {
    try {
      const { author } = req.params;
      const response = await axios.get(`http://localhost:5000/books/author/${author}`);
      const books = response.data.books;
      if (books.length > 0) {
        return res.status(200).json({ books });
      } else {
        return res.status(404).json({ message: "Books by the author not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving book details" });
    }
  });
//public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //const { author } = req.params;

  // Get the list of books from your database or data source
  //const books = require("../router/booksdb.js");

  // Find books with the matching author
  //const matchingBooks = Object.values(books).filter(book => book.author === author);

  //if (matchingBooks.length > 0) {
    // If matching books are found, return the book details as a JSON response
    //return res.status(200).json({ books: matchingBooks });
  //} else {
    // If no matching books are found, return an error response
    //return res.status(404).json({ message: "Books by the author not found" });
  //}
//});

// Get all books based on title

public_users.get('/title/:title', async (req, res) => {
    try {
      const { title } = req.params;
      const response = await axios.get(`http://localhost:5000/books/title/${title}`);
      const books = response.data.books;
      if (books.length > 0) {
        return res.status(200).json({ books });
      } else {
        return res.status(404).json({ message: "Books with the specified title not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving book details" });
    }
  });
//public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // Get the title parameter from the request URL
  //const { title } = req.params;

  // Get the list of books from your database or data source
  //const books = require("../router/booksdb.js");

  // Find books with the matching title
  //const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  //if (matchingBooks.length > 0) {
    // If matching books are found, return the book details as a JSON response
    //return res.status(200).json({ books: matchingBooks });
  //} else {
    // If no matching books are found, return an error response
    //return res.status(404).json({ message: "Books with the specified title not found" });
  //}
//});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const { isbn } = req.params;

  // Get the list of books from your database or data source
  const books = require("../router/booksdb.js");

  // Find the book with the specified ISBN
  const book = books[isbn];

  if (book) {
    // If the book is found, return the reviews as a JSON response
    const { reviews } = book;
    return res.status(200).json({ reviews });
  } else {
    // If the book is not found, return an error response
    return res.status(404).json({ message: "Book with the specified ISBN not found" });
  }
});

module.exports.general = public_users;