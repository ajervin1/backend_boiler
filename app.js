const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { connectDB } = require("./db");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const cors = require('cors')
connectDB()
const secretKey = "1234"
function generateToken(res, user  ) {
	const token = jwt.sign({user}, secretKey)
	res.cookie('jwt', token, {
		httpOnly: true,
	})
}
const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	favorites: { type : Array , "default" : [] }
}, {
	_id: false,
	timestamps: true,
	strict: false,
})
const User = mongoose.model('User', userSchema)

const postSchema = new mongoose.Schema({
	_id: Number,
	original_title: String,
	backdrop_path: String,
	poster_path: String,
	release_date: String,
	vote_average: Number,
}, { _id: false, strict: false });


const Post = mongoose.model('Post', postSchema);

async function addPost( post ) {
	const newPost = await Post.findOneAndUpdate({_id: post.id}, {
		$setOnInsert: {_id: post.id, ...post},
	}, {upsert: true, new: true })
	console.log(newPost);
	return newPost
}
// Add user if found don't just return the user if not create a new user
async function addUser( user ) {
	const newUser = await User.findOneAndUpdate({_id: user.id}, {
		$setOnInsert: {_id: user.id, ...user},
	}, {upsert: true, new: true })
	return newUser
}


const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', ( req, res, next ) => {
	res.send("hello")
})
// Update findOneAndUpdate
// Single Item findOneById
// Create new User user.save()
// User.findByIdAndDelete()
// TODO: Create Login functionality, add JWT

app.post('/user', async (req,res) => {
	const user = req.body;
	const newUser = await addUser(user);
	console.log(newUser)
	res.json(newUser);
})


app.post('/post', async (req,res) => {
	const posts = req.body;
	console.log(posts);
	for ( const post of posts ) {
		const newPost = await addPost(post);
	}
	res.json({message: "Added Posts"});
})

app.post('/user/:userId/favorites', async (req,res) => {
	const {userId} = req.params;
	const favorite = req.body;
	const user = await User.findById(userId);

	if ( user.favorites ){
		const favoriteIds = user.favorites.map(fav => fav.id);
		const isInArray = favoriteIds.includes(favorite.id);
		if ( isInArray ){
			res.json(user)
		} else {
			user.favorites.push(favorite);
			await user.save()
			res.json(user)
		}
	} else {
		user.favorites.push(favorite);
		await user.save()
		res.json(user)
	}

})
app.post('/user/:userId/favorites/remove', async (req,res) => {
	const {userId} = req.params;
	const favorite = req.body;
	const user = await User.findById(userId);
	user.favorites = user.favorites.filter(fav => fav.id !== favorite.id);
	await user.save();
	res.json(user);

})
app.get('/logout', (req,res) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		expires: new Date(0)
	});
	res.send("Logged Out")
})
app.listen(8000, () => {
	console.log("Server is listening")
})