const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { connectDB } = require("./db");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
connectDB()
const secretKey = "1234"
function generateToken(res, user  ) {
	const token = jwt.sign({user}, secretKey)
	res.cookie('jwt', token, {
		httpOnly: true,
	})
}
const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String
}, {
	timestamps: true
})
const User = mongoose.model('User', userSchema)
const app = express();



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
// TODO: Create Login functionatlity, add JWT

app.post('/login', (req,res) => {

})
app.post('/register', async ( req, res ) => {
	console.log(req.body)
	const user = await User.findOne({ email: req.body.email });
	if ( user ) {
		const {jwt: jsonToken} = req.cookies
		const decoded =  await jwt.verify(jsonToken, secretKey);
		console.log(decoded);
		// Create Json Web Toke
		res.json(decoded);
	} else {
		const user = await User.create(req.body);
		console.log(user)
		// Create JSON WebToken
		const token = jwt.sign({user}, secretKey)
		res.cookie('jwt', token, {
			httpOnly: true,
		})
		res.json({token});
	}
})

// TODO: Create Logout Functionality
app.get('/logout', ( req, res ) => {

})
app.listen(8000, () => {
	console.log("Server is listening")
})