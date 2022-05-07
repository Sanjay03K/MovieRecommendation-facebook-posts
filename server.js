// Models
const express = require('express')
const app = express();
const bodyParser = require("body-parser"); //Middleware
const facebook = require("./models/get_posts");
const check = require("./models/check_valid_posts");
var cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

//PORT
const port = 3000

app.get('/', (req, res) => {
     facebook.get_fb_posts((results)=>{
      console.log("\nFacebook posts are : \n");
      console.log(results);
      if (results!="error") {
        check.check_movies_in_posts(results, (result)=>{
            if (result.length!=0) {
              res.send("<h1>Obtained movies lists from FB posts</h1>")
            }
            else{
              res.send("<h1>No movies available in FB posts</h1>")
            }
        });
      }
      else{
        res.send("<h1>Fetch posts failed</h1>").status(500);
      }
    })
})

app.post('/recieve_posts_ui',(req,res)=>{
  var postsUi = req.body.user;
  postsUi =JSON.parse(postsUi);
  var arr_postsUi = [];
  for (let i = 0; i < postsUi.length; i++) {
    if (postsUi[i].message) {
      arr_postsUi.push(postsUi[i].message);
    }
  }
  console.log("\nFacebook posts are : \n");
  console.log(arr_postsUi);
  check.check_movies_in_posts(arr_postsUi, (result)=>{
    if (result.length!=0) {
      res.send("<h1>Obtained movies lists from FB posts</h1>")
    }
    else{
      res.send("<h1>No movies available in FB posts</h1>")
    }
  });
})

app.listen(port, () => {
  console.log(`\nApp running in port : ${port}`)
})