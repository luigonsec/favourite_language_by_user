var request = require('request');

var client_id = sails.config.github.client_id;
var client_secret = sails.config.github.client_secret;


module.exports = {

  // This function receives a username throught the user parameter in the request.
  // It send a request to the Github API for getting the user repositories.
  // Each repository contains a URL with the codelines by languages.
  // We group the codelines by language and project to get the total amount by language.
  languages_by_user : function(req, res){

    // We get the user parameter
    var user = req.param('user');

    // If there is not an access_token we set it to empty string
    var access_token = sails.config.github.access_token || '';

    // we build the URL with the user and the access_token
    var url = 'https://api.github.com/users/'+user+'/repos?'+access_token;

    // We set some options
    var options = {
      url: url,
      headers: {
        'User-Agent': user
      }
    };

    // This object will cotain the codelines by language information
    var stadistics = {};

    // We send a request to the Github API with all the options already set
    request(options, function(error, response, body){

        // We convert to JSON the body response
        var repos = JSON.parse(body);

        if(repos['message']) {

          // If we receive this message, the user doesn't exists and send 404 status.
          if(repos['message'] == 'Not Found'){

            res.status(404);
            return res.send();
          }

          // If we receive this message, we have reached the API limit
          if(repos['message'].indexOf('API rate limit') != -1){
            res.status(400);
            return res.send();
          }

        }



        // We loop over each repository
        async.each(repos, function(repo, callback){

          // We get the languages_url of the repository
          var languages_url = repo['languages_url'];

          // We change the URL of the options object
          options.url = languages_url+'?'+access_token;

          // We send a new request after change the options url
          request(options, function(error, response, body){

            // We receive a response with the language and its codelines in the reposity
            var codelines_by_language = JSON.parse(body);

            // We accumulate the codelines for each language in the stadistics object
            for(language in codelines_by_language){
              if( !stadistics.hasOwnProperty(language) ){
                stadistics[language] = 0;
              }
              stadistics[language] += codelines_by_language[language];
            }

            // We have finished with this repostory, callback
            callback();

          });
        },
        // Finally, we send the stadisctis object
        function(err){

            return res.send(stadistics);
        });
    });
  },

  // This way the user is redirected to the Github login page. In this page, Github will ask
  // the user if he allow this app access to his github profile and information.
  authenticate : function(req,res){
    return res.redirect('https://github.com/login/oauth/authorize?client_id=d09e0f4db9504f2648bb');
  },

  // After the user allow our APP access to his Github data, he is redirected here.
  // This function set the github configuration with the access token gotten by the user.
  oauth_redirect : function(req,res){

    // We get this code from Github
    var code = req.param('code');

    // The URL where we have to send the code
    var oauth_url = 'https://github.com/login/oauth/access_token';

    // The parameters required by the URL
    var parameters = {};
    parameters['client_id'] = client_id;
    parameters['client_secret'] = client_secret;
    parameters['code'] = code;

    var form = {};
    form['form'] = parameters;

    // A POST request is sent with the information
    request.post(oauth_url, form, function(error,response,body){

      // When the answer comes, the response body will be the access_token for each request.
      sails.config.github.access_token = body;
      return res.redirect('/');
    })

  }
}
