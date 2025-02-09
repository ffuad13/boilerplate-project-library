/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const { CreateData, ReadData, DeleteData, ReadById, CreateComment, DeleteById } = require('../controllers/controller')

module.exports = function (app) {

  app.route('/api/books')
    .get(/* function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    } */ ReadData)

    .post(/* function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
    } */CreateData)

    .delete(/* function(req, res){
      //if successful response will be 'complete delete successful'
    } */ DeleteData);



  app.route('/api/books/:id')
    .get(/* function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    } */ ReadById)

    .post(/* function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    } */ CreateComment)

    .delete(/* function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    } */ DeleteById);

};
