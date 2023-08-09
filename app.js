const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { connectDB } = require("./db");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const cors = require('cors')
const { User, Post, addUser, addPost } = require("./database");
connectDB()
const app = express();
/* MiddleWare */
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use this route to conduct testing
app.get('/', ( req, res, next ) => {
	res.send("Test Route")
})

// Creates a new user when someone is logged in
app.post('/user', async (req,res) => {
	const user = req.body;
	const newUser = await addUser(user);
	res.json(newUser);
})

// Creates a post
app.post('/post', async (req,res) => {
	const posts = req.body;
	console.log(posts);
	for ( const post of posts ) {
		const newPost = await addPost(post);
	}
	res.json({message: "Added Posts"});
})

// Adding and removing favorites
// Favorites are on the user object
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

app.listen(8000, () => {
	console.log("Server is listening")
})