var express = require("express");
var router = express.Router();
var mongoose = require('mongoose');
var navLink = require('./navLink')
// var helpers = require('handlebars-helpers');

mongoose.connect('mongodb://localhost:27017/booksDB', {useNewUrlParser: true, useUnifiedTopology: true});
const booksSchema = new mongoose.Schema({
    "title": String,
    // 'categories': [String],
    // 'authors': [String],
    // 'price': [Number],
})

// var append = helpers.string().append();

const books = mongoose.model('Books', booksSchema)

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:')
})

db.on('error', err => {
    console.error('connection error:', err)
})



let d;
var link = 'http://localhost:9090/books/allBooksData';
router.get("/allBooksData", (req, res) => {
    books.find().then(data => {
        // res.json(data)
        d = JSON.parse(JSON.stringify(data))
        // console.log(typeof(data));
        // console.log(typeof(d));
        // console.log(d.length)
        
        res.render('booksView', {layout: false, allBooksData: d});
    })
    
})
var r, p;
router.get("/:page",(req,res)=>{
    var page = parseInt(req.params.page);
    console.log(req.params)
    p = (page-1)*40;
    console.log('page:', page, 'p:', p)

    books.find().skip(p).limit(40).exec(function(err, results) {
        // console.log(err);
        results = JSON.parse(JSON.stringify(results));
        r = [...results]
        // console.log(r)
        // console.log("length===", r.length)
    });
    // var prev, next;
    // if (page > 1) 
    //     prev = 'http://localhost:9090/books/'+ String(page - 1);
    // console.log(prev)
    // if (page < 8)
    //     next = 'http://localhost:9090/books/'+ String(page + 1);
    
    // var slicedbooks = d.slice((page-1)*10, page*10)
    
    res.render("booksView",{layout:false, allBooksData: r, navLink: navLink})
})


module.exports = router;