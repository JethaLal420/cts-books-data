
var express = require('express');
var app = express();


var exphbs  = require('express-handlebars');
app.engine('hbs', exphbs());
app.set('view engine', 'hbs');

app.use(express.json())
app.use(express.urlencoded({extended:false}))

var booksRoutes = require("./booksRoutes")
var universalRoutes = require('./universalRoutes')


app.use("/books", booksRoutes)

// app.use('**', universalRoutes)

app.listen(9090,()=>{console.log("web application running on 9090")})