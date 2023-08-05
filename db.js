const mongoose = require('mongoose')

const uri = "mongodb+srv://ajervin:dunk7onu@tumblrdatabase.1pkxm5g.mongodb.net/test";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(uri)
	} catch(error){
		console.log(error)
	}
}


module.exports = {connectDB}

