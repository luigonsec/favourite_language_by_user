var request = require('request');

var client_id = sails.config.github.client_id;
var client_secret = sails.config.github.client_secret;


module.exports = {

  oauth_redirect : function(req,res){

    var code = req.param('code');

    var oauth_url = 'https://github.com/login/oauth/access_token';

    var parameters = {};
    parameters['client_id'] = client_id;
    parameters['client_secret'] = client_secret;
    parameters['code'] = code;

    var form = {};
    form['form'] = parameters;
    request.post(oauth_url, form, function(error,response,body){
      sails.config.github.access_token = body;
      return res.redirect('/');
    })

  }
}
