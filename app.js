const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/notesDB', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connected!'))
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
  });

const notesSchema = new mongoose.Schema({
	title: String,
	content: String
});

const Article = mongoose.model('Article', notesSchema);

//////Requests Targetting all Articles//////

app.route('/articles')

    .get((req, res) => {
    
    	Article.find((err, articleFound) => {
    		if (!err) {
    			res.send(articleFound);
    		} else {
    			res.send(err);
    		}
    	});
    })

    .post((req, res) => {
    
    	const newArticle = new Article({
    		title: req.body.title,
    		content: req.body.content
    	});
    	newArticle.save((err) => {
    		if (!err) {
    			res.send("Successfully saved to DB");
    		} else {
    			res.send(err);
    		}
    	});
    })

    .delete((req, res) => {
    
    	Article.deleteMany((err) => {
    		if (!err) {
    			res.send("Successfully deleted all articles");
    		} else {
    			res.send(err);
    		}
    	});
    });


//////Requests targetting specific Article//////

app.route('/articles/:articleTitle')
    
    .get((req, res) => {

    	Article.findOne(
    		{title: req.params.articleTitle},
    		(err, articleFound) => {
    		    if (articleFound) {
    		    	res.send(articleFound);
    		    } else {
    		    	res.send("No articles matching that you searched");
    		    }
    		}
    	);
    })

    .put((req, res) => {
    	
    	Article.update(
    		{title: req.params.articleTitle},
    		{title: req.body.title, content: req.body.content},
    		{overwrite: true},
    		(err) => {
    			if (!err) {
    				res.send("Article updated Successfully.");
    			} else {
    				res.send(err);
    			}
    		}
    	);
    })

    .patch((req, res) => {

    	Article.update(
    		{title: req.params.articleTitle},
    		{$set: req.body},
    		(err) => {
    			if (!err) {
    				res.send("Article updated Successfully.");
    			} else {
    				res.send(err);
    			}
    		}
    	);
    })

    .delete((req,res) => {

    	Article.deleteOne(
    		{title: req.params.articleTitle},
    		(err) => {
    			if (!err) {
    				res.send("Article deleted Successfully");
    			} else {
    				res.send(err);
    			}
    		}
    	);
    });



app.listen(3000, () => {
	console.log("Server is running on port 3000");
});