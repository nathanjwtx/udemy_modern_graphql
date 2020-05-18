/* eslint-disable no-unused-vars */
import {GraphQLServer} from 'graphql-yoga'
import {v4 as uuidv4} from 'uuid'

import { db } from './db'

// resolvers
const resolvers = {

	Mutation: {
		createUser(parent, args, { db }, info) {
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
		createPost(parents, args, { db }, info) {
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

			return post
		},
		createComment(parents, args, { db }, info) {
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

			return comment
		},
		deleteUser(parents, args, { db }, info) {
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
		deletePost(parents, args, { db }, info) {
			const postExists = db.posts.findIndex((post) => post.id === args.id)

			if (postExists === -1) {
				throw new Error('Delete post: post does not exist')
			}

			// delete comments on the post
			db.comments = db.comments.filter((comment) => comment.post !== args.id)

			// remove post from Posts
			const deletedPosts = db.posts.splice(postExists, 1)

			// deletedPosts is an array containing a single Post that was deleted
			return deletedPosts[0]
		},
		deleteComment(parents, args, { db }, info) {
			const commentExists = db.comments.findIndex((comment) => comment.id === args.id)

			if (commentExists === -1) {
				throw new Error('Delete comment: comment does not exists')
			}

			const deletedComment = db.comments.splice(commentExists, 1)

			return deletedComment[0]
		}
	},
	Post: {
		author(parent, args, { db }, info) {
			return db.users.find((user) => {
				return user.id === parent.author
			})
		},
		comments(parent, args, { db }, info) {
			return db.comments.filter((comment) => {
				return comment.post === parent.id
			})
		}
	},
	User: {
		posts(parent, args, { db }, info) {
			return db.posts.filter((post) => {
				return post.author === parent.id
			})
		},
		comments(parent, args, { db }, info) {
			return db.comments.filter((comment) => {
				return comment.author === parent.id
			})
		}
	},
	Comment: {
		// eslint-disable-next-line no-unused-vars
		author(parent, args, { db }, info) {
			return db.users.find((user) => {
				return user.id === parent.author
			})
		},
		post(parent, args, { db }, info) {
			return db.posts.find((post) => {
				return post.id === parent.post
			})
		}
	}
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers: resolvers,
	context: {
		db
	}
})

server.start(() => {
	console.log('the server is running')
})
