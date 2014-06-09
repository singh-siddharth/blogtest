var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
 res.render('index', { title: 'BlogUp' });
});

/* GET Userlist page. */
router.get('/list', function(req, res) {
    var db = req.db;
    var collection = db.get('blogd');
    collection.find({},{},function(e,docs){
        res.render('list', {
            "list" : docs
        });
    });
});


// get blog content
router.get('/content/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('blogd');
    var dbc = db.get('comm');
    var ObjectID = require('mongodb').ObjectID;
    collection.findOne({_id:new ObjectID(req.params.id)},function(e,docs){
        res.render('content', {            
	"content" : docs
        });
    });
    dbc.find({blogid:new ObjectID(req.params.id)},{},function(e,docs){
	console.log(e);
	console.log(docs);
	res.render('content',{"commentar":docs}
	);
	});	
});


/* GET New blog page. */
router.get('/newblog', function(req, res) {
    res.render('newblog', { title: 'Make New Blog' });
});

/* POST to Add User Service */
router.post('/addblog', function(req, res) {

    // Set our internal DB variable4
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var title = req.body.title;
    var body = req.body.body;

    // Set our collection
    var collection = db.get('blogd');

    // Submit to the DB
    collection.insert({
        "title" : title,
        "body" : body
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("list");
            // And forward to success page
            res.redirect("list");
        }
    });
});

/*comments*/
router.post('/comment',function(req,res){

	var db = req.db;

	//get comment value
	var comment = req.body.comment;
	var blogid =req.body.blogid;
	//set collection
	var dbc = db.get('comm');

	//post to db
	dbc.insert({
		"comment":comment,"blogid":blogid
		},function(err,doc){
			if(err){
				//failed, return error
				res.send("problem");
			}
			else {
			  //worked
//			     res.location("content");
			     res.redirect("content/:id");
			}
		});
		
	});      

module.exports = router;
