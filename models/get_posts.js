// MODULES
const FB = require('fb');

// ACCESS TOKEN
FB.setAccessToken('EABDHP3ahI0MBANVNCkyF2vZC68p8dXKBum4IU20gmZB9RFH8lwFLJBnMCGbUpROLxlzeK9kDNQdgldj3b3InXTVRCnNiAXoBaZADy6ZBz0smtVyZAy7SdXkP3ZA4ruzkRykINpHmqEhp3p7DaAVqltLmyMDJAEDSoGVAMJwYBtFXkzGI0wyoL9rOZC0lkJwzCeVSNsU2Y6dvgi4IRV1o219w6bmIyUlYNkir8PMUYvL9ZBT8upqUzlBi');

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