var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer= require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{ useNewUrlParser: true });
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());							   
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	image:String,
	body:String,
	created: {type: Date, default:Date.now}	
});

// MONGOOSE/MODEL CONFIG
var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTS

app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!");
		}else{
			res.render("index", {blogs:blogs});
		}
	});
	
});

// NEW ROUT
app.get("/blogs/new", function(req, res){
	res.render("new");
});
// CREATE ROUT

app.post("/blogs", function(req,res){
	// CREAT BLOG
	console.log(req.body);
	Blog.create(req.body.blog, function(err, newBlog){
		req.body.blog.body = req.sanitize(req.body.blog.body)
		console.log(req.body);
		if(err){
			res.render("new");
		}else{
			// then redirect to index
			res.redirect("/blogs");
		}
	});
		
});

// SHOW ROUT

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog:foundBlog});
		}
	});
});


// EDIT ROUT
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
});
// UPDATE ROUT

app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
			
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DELETE ROUT

app.delete("/blogs/:id", function(req, res){
	// DESTROY BLOG
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	} )
	
});

var port = 3000 || process.env.PORT;
app.listen(port, function () {
  console.log("Blogapp server has Statrted!");
});
	