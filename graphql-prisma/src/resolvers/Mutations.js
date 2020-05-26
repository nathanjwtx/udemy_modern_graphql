/* eslint-disable no-unused-vars */

/* NOTE: this is the node.js api running on localhost:4000 which limits what the end user can access from the prisma
api running on localhost:4466 */

import {v4 as uuidv4} from 'uuid'

const Mutation = {
	async createUser(parent, args, {prisma}, info) {
		// data is the name given to the object in schema.graphql
		console.log(args)
		const emailTaken = await prisma.exists.User({ email: args.data.email})

		if (emailTaken) {
			throw new Error('email in use')
		}

		return prisma.mutation.createUser({data: args.data}, info)
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
	async deleteUser(parents, { id }, {prisma}, info) {

		const userExists = await prisma.exists.User({ id })

		if (!userExists) {
			throw new Error('User does not exist')
		}

		return prisma.mutation.deleteUser({where: {id}}, info)
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
		pubsub.publish(`comment ${args.data.post}`, {
			comment: {
				mutation: 'CREATED',
				data: comment
			}
		})
		return comment
	},
	updateComment(parent,  args, { db, pubsub }, info) {
		const comment = db.comments.find((comment) => comment.id === args.id)

		if (!comment) {
			throw new Error('Update comment: comment not found')
		}

		if (typeof args.data.text === 'string') {
			comment.text = args.data.text
		}

		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: 'UPDATED',
				data: comment
			}
		})

		return comment
	},
	deleteComment(parents, { id }, {db, pubsub}, info) {
		const commentExists = db.comments.findIndex((comment) => comment.id === id)

		if (commentExists === -1) {
			throw new Error('Delete comment: comment does not exists')
		}

		const deletedComment = db.comments.splice(commentExists, 1)

		pubsub.publish(`comment ${deletedComment[0].post}`, {
			comment: {
				mutation: 'DELETED',
				data: deletedComment[0]
			}
		})
		return deletedComment[0]
	}
}

export { Mutation }
