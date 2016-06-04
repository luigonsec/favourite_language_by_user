var request = require('request');

var client_id = sails.config.github.client_id;
var client_secret = sails.config.github.client_secret;

module.exports = {

  user_languages : function(req, res){

    var user = req.param('user');

    var access_token = sails.config.github.access_token;

    var url = 'https://api.github.com/users/'+user+'/repos?'+access_token;

    console.log(url);

    var options = {
      url: url,
      headers: {
        'User-Agent': user
      }
    };

    var stadistics = {};

    request(options, function(error, responde, body){

        var repos = JSON.parse(body);



        async.each(repos, function(repo, callback){

          var languages_url = repo['languages_url'];

          console.log(languages_url)

          options.url = languages_url+'?'+access_token;
          //console.log(languages_url)

          request(options, function(error, response, body){

            var codelines_by_language = JSON.parse(body);

            for(language in codelines_by_language){

              if( !stadistics.hasOwnProperty(language) ){
                stadistics[language] = 0;
              }

              stadistics[language] += codelines_by_language[language];
            }
            callback();

          });
        },function(err){

          console.log(stadistics);
          return res.send(stadistics);
        });
    });
  }
}
