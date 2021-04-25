var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var navLink = require("./navLink");
var sortLink = require("./sortLink");

mongoose.connect("mongodb://localhost:27017/booksDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const booksSchema = new mongoose.Schema({
  title: String,
  // 'categories': [String],
  // 'authors': [String],
  // 'price': [Number],
});

// var append = helpers.string().append();

const books = mongoose.model("Books", booksSchema);

// const db = mongoose.connection;
// db.once("open", (_) => {
//   console.log("Database connected:");
// });

// db.on("error", (err) => {
//   console.error("connection error:", err);
// });

function mware(req, res, next) {
  console.log("JaY");
  next();
}

let d, slicedData;

books.find().then((data) => {
  d = JSON.parse(JSON.stringify(data));

  router.get("/allBooksData", mware, (req, res) => {
    res.render("booksView", { layout: false, allBooksData: d });
  });

  router.get("/:page", (req, res) => {
    var page = req.params.page;
    console.log(req.params);

    if(page === 'sortedByPrice') {
      slicedData = d.sort((a, b)=>{

        // let priceOfa = parseInt(a.price);
        // let priceOfb = parseInt(b.price);

        // if ( priceOfa < priceOfb ){
        //   return -1;
        // }
        // if ( priceOfa > priceOfb){
        //   return 1;
        // }
        // return 0;
        return parseInt(b.price) - parseInt(a.price);
      })
    }
    else if (page === 'sortedByPageCount'){
      slicedData = d.sort((a, b)=>{
        return parseInt(b.pageCount) - parseInt(a.pageCount);
      })
    }
    else if (page === 'sortedByCategory'){
      slicedData = d.sort((a,b) => {
        if ( a.categories < b.categories ){
          return -1;
        }
        if ( a.categories > b.categories){
          return 1;
        }
        return 0;
      })
    }
    else if (page === 'sortedByDiscount'){
      slicedData = d.sort((a,b) => {
        if ( a.discount < b.discount ){
          return 1;
        }
        if ( a.discount > b.discount){
          return -1;
        }
        return 0;
      })
    }
    else{
      if (page == 1) slicedData = d.slice(page, 50);
      else slicedData = d.slice((page - 1) * 50, page * 50);
    }

    res.render("booksView", {
      layout: false,
      allBooksData: slicedData,
      navLink: navLink,
      sortLink: sortLink
    });
  });

  // var prev, next;
  // if (page > 1)
  //     prev = 'http://localhost:9090/books/'+ String(page - 1);
  // console.log(prev)
  // if (page < 8)
  //     next = 'http://localhost:9090/books/'+ String(page + 1);

  // var slicedbooks = d.slice((page-1)*10, page*10)
});

module.exports = router;
