var request = require('supertest');




describe('GithubController', function() {


  describe('/authenticate', function() {

    it('should redirect to /', function (done) {
      request(sails.hooks.http.app)
        .get('/authenticate')
        .send()
        .expect('location','https://github.com/login/oauth/authorize?client_id=d09e0f4db9504f2648bb', done);
    });
  });


  describe('/languages/luigonsec', function() {


    it('should return a 200 status code', function (done) {

      request(sails.hooks.http.app)
        .get('/languages/luigonsec')
        .send()
        .expect(200)
        .end(done)
    });

  });

  describe('/languages/dewgfwegwegwe', function() {


    it('should return a 404 status code', function (done) {

      request(sails.hooks.http.app)
        .get('/languages/dewgfwegwegwe')
        .send()
        .expect(404)
        .end(done)
    });

  });

});
