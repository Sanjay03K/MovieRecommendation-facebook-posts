const readXlsxFile = require('read-excel-file/node')
const similarity = require('string-cosine-similarity')

//Labels for videos 
const movie_likability = [
    "good",
    "best",
    "awesome",
    "worst",
    "bad",
    "wonderful",
    "fantastic",
    "awful"
];

function check_movies_in_posts(posts, callback) {
    var obtained_movies = [];
    readXlsxFile('./excels/movies.xlsx').then((rows) => {
        for (let i = 0; i < posts.length; i++) {
            for (let j = 1; j < rows.length; j++) {
                var lower_posts = posts[i].toLowerCase();
                var lower_movies = rows[j][1].toLowerCase();
                if (lower_posts.indexOf(lower_movies)!=-1) {
                    get_movie_details(rows[j][1], lower_posts, movie_likability, (results)=>{
                        obtained_movies.push(results)
                    })
                }                
            }
        }
        console.log("\nObtained movies are : \n");
        console.log(obtained_movies);
        return callback(obtained_movies);
    })
}

function get_movie_details(movie, posts, likes, callback) {
    var value = null;
    for (let i = 0; i < likes.length; i++) {
        if(posts.indexOf(likes[i])!=-1){
            value = likes[i];
        }
        if (i == likes.length-1){
            var final_list = {"name" : movie}
            return callback(final_list);
        }
    }
}

module.exports = { check_movies_in_posts : check_movies_in_posts }