// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', async (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
  let newBook = new book({
    "Title": '',
    "Description": '',
    "Price": '',
    "Author": '',
    "Genre": ''
  })  
  try{
    res.render('books/details',{
      title: 'Add New Book',
      books: newBook
    })
    }catch (err) {
      console.log(err);
    }
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', async (req, res, next) => {
    /*****************
     * ADD CODE HERE *
     *****************/
  let newBook = new book({
    "Title": req.body.title,
    "Description": req.body.description,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre,
  })
  try {
    await newBook.save();
    res.redirect('/books')
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// GET the Book Details page in order to edit an existing Book
router.get('/edit/:id', async (req, res, next) => {
    /*****************
     * ADD CODE HERE *
     *****************/
  let id = req.params.id;
  try {
    let bookDetails = await book.findById(id);
    res.render('books/details',
      {
        title: 'Edit Book',
        books: bookDetails
      })
  } catch (err) {
    console.log("Error inside Edit Book loading page: ",err);
  }
});

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', async (req, res, next) => {
    /*****************
     * ADD CODE HERE *
     *****************/
  let { id } = req.params;
  let { title, description, price, author, genre } = req.body;
  book.findByIdAndUpdate(id, { Title:title, Description:description, Price:price, Author:author, Genre:genre }, { new: true })
  .then(() => {
    console.log(title);
    // Redirect to books list view after updating the contact
    res.redirect('/books');
  })
  .catch((error) => {
    console.log(error);
    res.status(500).send('Internal Server Error');
  });
});

// GET - process the delete by user id
router.get('/delete/:id', async (req, res, next) => {
    /*****************
     * ADD CODE HERE *
     *****************/
  let {id} = req.params;
  try{
    await book.findByIdAndRemove(id);
    res.redirect('/books');
    }catch (err){
        console.log(err);
        res.status(500).send(err);
  }
});


module.exports = router;
