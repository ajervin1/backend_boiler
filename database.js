import mongoose from "mongoose";

/* User */
const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	favorites: { type : Array , "default" : [] }
}, {
	_id: false,
	timestamps: true,
	strict: false,
})
export const User = mongoose.model('User', userSchema)



/* Post */
const postSchema = new mongoose.Schema({
	_id: Number,
	original_title: String,
	backdrop_path: String,
	poster_path: String,
	release_date: String,
	vote_average: Number,
}, { _id: false, strict: false });

export const Post = mongoose.model('Post', postSchema);

export async function addPost( post ) {
	const newPost = await Post.findOneAndUpdate({_id: post.id}, {
		$setOnInsert: {_id: post.id, ...post},
	}, {upsert: true, new: true })
	console.log(newPost);
	return newPost
}
// Add user if found don't just return the user if not create a new user
export async function addUser( user ) {
	const newUser = await User.findOneAndUpdate({_id: user.id}, {
		$setOnInsert: {_id: user.id, ...user},
	}, {upsert: true, new: true })
	return newUser
}
