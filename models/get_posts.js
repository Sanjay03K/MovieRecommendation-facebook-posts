// MODULES
const FB = require('fb');

// ACCESS TOKEN
FB.setAccessToken('EABDHP3ahI0MBAHXQxqC7HMVM2hZBfGlX1auGydKZCflY0oCQvr69MPDZCHIJ2BBBuQyQFlgsoeSO2jwG83RrHdB43VozPKgKiZCtSL7IX9JZCkBoHaoSKLGLW6X7DsAy2yE4yEsVOPD5zWP2P0foDb2bnDQxZBWpMKc3eEErtxbT8wrdabgvaJZCVl5oef8kBa3k7SQG2Dy8kQmAhi9Xl29ZBzEOVfre5X22mVgkSZAMVEWvb1lJgZCd2D');

function get_fb_posts(callback) {
    FB.api('/me/feed',function(response) {
        var all_user_posts = [];
        if (response.data==undefined) {
          return callback("error");
        }
        else{
          for (let i = 0; i < response.data.length; i++) {
                if ((response.data[i].message!=undefined)){
                    all_user_posts.push(response.data[i].message);
            }
          }
          return callback(all_user_posts);
        }     
      }) 
}

module.exports = {
    get_fb_posts : get_fb_posts
}