/* eslint-disable no-unused-vars */
import {v4 as uuidv4} from 'uuid'

const Mutation = {
	createUser(parent, args, {db}, info) {
		const emailTaken = db.users.some((user) => {
			return user.email === args.data.email
		})

		if (emailTaken) {
			throw new Error('email address already in user')
		}

		const user = {
			id: uuidv4(),
			...args.data
		}

		db.users.push(user)

		return user
	},
	updateUser(parent, { id, data }, { db }, info) {
		const user = db.users.find((user) => user.id === id)

		if (!user) {
			throw new Error('Update user: user not found')
		}

		if (typeof data.email === 'string') {
			const emailTaken = db.users.some((user) => user.email === data.email)
			if (emailTaken) {
				throw new Error('Update user: email in use')
			}
			user.email = data.email
		}

		if (typeof data.name === 'string') {
			user.name = data.name
		}

		if (typeof data.age !== 'undefined') {
			user.age = data.age
		}

		return user
	},
	createPost(parents, args, {db, pubsub}, info) {
		// check user exists and throw an error if not
		const userExists = db.users.some((user) => user.id === args.data.author)

		if (!userExists) {
			throw new Error('user not found')
		}

		const post = {
			id: uuidv4(),
			...args.data
		}

		db.posts.push(post)
		// only publish subscription if published property is true
		if (args.data.published) {
			pubsub.publish('post', {
				post:
					{
						mutation: 'CREATE',
						data: post
					}
			})
		}
		return post
	},
	updatePost(parent, { id, data }, { db, pubsub }, info) {
		const post = db.posts.find((post) => post.id === id)
		const originalPost = { ...post }

		if (!post) {
			throw new Error('Update post: post not found')
		}

		if (typeof data.published === 'boolean') {
			post.published = data.published

			if (originalPost.published && !post.published) {
				// deleted
				pubsub.publish('post', {
					post: {
						mutation: 'DELETED',
						data: originalPost // prevents inadvertent changes being published
					}
				})
			} else if (!originalPost.published && post.published) {
				// created
				pubsub.publish('post', {
					post: {
						mutation: 'CREATED',
						data: post
					}
				})
			}
		} else if (post.published) {
			// updated
			pubsub.publish('post', {
				post: {
					mutation: 'UPDATED',
					data: post
				}
			})
		}

		if (typeof data.title === 'string') {
			post.title = data.title
		}

		if (typeof data.body === 'string') {
			post.body = data.body
		}

		return post
	},
	createComment(parents, args, {db, pubsub}, info) {
		const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

		if (!postExists) {
			throw new Error('either post does not exist or is not published')
		}

		const userExists = db.users.some((user) => user.id === args.data.author)

		if (!userExists) {
			throw new Error('user not found')
		}

		const comment = {
			id: uuidv4(),
			...args.data
		}

		db.comments.push(comment)

		pubsub.publish(`comment ${args.data.post}`, {comment: comment})
		return comment
	},
	updateComment(parent, { id, data }, { db }, info) {
		const comment = db.comments.find((comment) => comment.id === id)

		if (!comment) {
			throw new Error('Update comment: comment not found')
		}

		if (typeof data.text === 'string') {
			comment.text = data.text
		}

		return comment
	},
	deleteUser(parents, args, {db}, info) {
		const userExists = db.users.findIndex((user) => user.id === args.id)

		if (userExists === -1) {
			throw new Error('Delete user: user does not exist')
		}

		const deletedUsers = db.users.splice(userExists, 1)

		db.posts = db.posts.filter((post) => {
			const match = post.author === args.id

			if (match) {
				db.comments = db.comments.filter((comment) => comment.post !== post.id)
			}

			return !match
		})

		db.comments = db.comments.filter((comment) => comment.author !== args.id)

		return deletedUsers[0]
	},
	deletePost(parents, args, {db, pubsub}, info) {
		const postExists = db.posts.findIndex((post) => post.id === args.id)

		if (postExists === -1) {
			throw new Error('Delete post: post does not exist')
		}

		// delete comments on the post
		db.comments = db.comments.filter((comment) => comment.post !== args.id)

		// remove post from Posts
		// const deletedPosts = db.posts.splice(postExists, 1)

		// use array destructuring. only one name is required as there will only be one element in the array
		const [post] = db.posts.splice(postExists, 1)

		if (post.published) {
			pubsub.publish('post', {
				post: {
					mutation: 'DELETED',
					data: post
				}
			})
		}

		// deletedPosts is an array containing a single Post that was deleted
		return post
	},
	deleteComment(parents, args, {db}, info) {
		const commentExists = db.comments.findIndex((comment) => comment.id === args.id)

		if (commentExists === -1) {
			throw new Error('Delete comment: comment does not exists')
		}

		const deletedComment = db.comments.splice(commentExists, 1)

		return deletedComment[0]
	}
}

export { Mutation }
