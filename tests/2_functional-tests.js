/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const path = '/api/books'

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        // assert.isArray(res.body, 'response should be an array');
        // assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        // assert.property(res.body[0], 'title', 'Books in array should contain title');
        // assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    let _id

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server).post(path).send({title: 'A book with Code'}).end((err, res) => {
          const {body} = res
          assert.equal(req.status, 200)
          _id = body._id
          assert.hasAllKeys(body, ['_id', 'title'])
          assert.equal(body.title, 'A book with Code')
        })
        done();
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server).post(path).send({}).end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.body)
          assert.equal(res.body, 'missing required field title')
        })
        done();
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server).get(path).end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          res.body.forEach((book) => {
            assert.isString(book._id)
            assert.isString(book.title)
            assert.isNumber(book.commentcount)
            assert.isAtLeast(book.commentcount, 0)
          })
        })
        done();
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server).get(path+'wrongid').end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body, 'no book exists')
        })
        done();
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server).get(path+_id).end((err, res) => {
          const {body} = res
          assert.equal(res.status, 200)
          assert.hasAllKeys(body, ['id', 'title', 'comments'])
          assert.isString(body._id)
          assert.isString(body.title)
          assert.isArray(body.comments)
          assert.isAtLeast(body.comments.length, 0)
          body.comments.forEach((comment) => assert.isString(comment))
        })
        done();
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server).post(path+_id).send({comment: 'This is comment'}).end((err, res) => {
          const {body} = res
          assert.equal(res.status, 200)
          assert.isObject(body)
          assert.hasAllKeys(body, ['id', 'title', 'comments'])
          assert.equal(body._id, _id)
          assert.isString(body.title)
          assert.isArray(body.comments)
          assert.include(body.comments, 'This is comment')
        })
        done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server).post(path+_id).send({}).end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.body)
          assert.equal(res.body, 'missing required field comment')
        })
        done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server).post(path+'noididid').send({comment: 'This is is'}).end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.body)
          assert.equal(res.body, 'no book exists')
        })
        done();
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server).delete(path+_id).end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.body)
          assert.equal(res.body, 'delete successful')
        })
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server).delete(path+'niniidid').end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.body)
          assert.equal(res.body, 'no book exists')
        })
        done();
      });

    });

  });

});
