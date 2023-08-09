const jwt = require("jsonwebtoken");
app.post('/login', async (req,res) => {
	const user = await User.findOne({ email: req.body.email, password: req.body.password });
	if ( user ){
		const token = jwt.sign({user}, secretKey)
		res.cookie('jwt', token, {
			httpOnly: true,
		})
		res.json({token});
	} else {
		res.send("User is not in database")
	}
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