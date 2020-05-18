import {GraphQLServer} from 'graphql-yoga'
import {v4 as uuidv4} from 'uuid'

let data = require('./demodata')

// resolvers
const resolvers = {
	Query: {
		greeting(parent, args) {
			if (args.name) {
				return `hello, ${args.name}!`
			} else {
				return 'hello'
			}
		},
		post(parent, args, ctx, info) {
			return {
				id: '892',
				title: 'First post',
				body: '',
				published: false
			}
		},
		users(parent, args, ctx, info) {
			if (!args.query) {
				return data.users
			} else {
				return data.users.filter((user) => {
					return user.name.toLowerCase().includes(args.query.toLowerCase())
				})
			}
		},
		posts(parent, args, ctx, info) {
			if (!args.query) {
				return data.posts
			} else {
				return data.posts.filter((post) => {
					return post.body.toLowerCase().includes(args.query.toLowerCase()) ||
						post.title.toLowerCase().includes(args.query.toLowerCase())
				})
			}
		},
		comments(parent, args, ctx, info) {
			return data.comments
		}
	},
	Mutation: {
		createUser(parent, args, ctx, info) {
			const emailTaken = data.users.some((user) => {
				return user.email === args.data.email
			})

			if (emailTaken) {
				throw new Error('email address already in user')
			}

			const user = {
				id: uuidv4(),
				...args.data
			}

			data.users.push(user)

			return user
		},
		createPost(parents, args, ctx, info) {
			// check user exists and throw an error if not
			const userExists = data.users.some((user) => user.id === args.data.author)

			console.log(args.data)
			if (!userExists) {
				throw new Error('user not found')
			}

			const post = {
				id: uuidv4(),
				...args.data
			}

			data.posts.push(post)

			return post
		},
		createComment(parents, args, ctx, info) {
			const postExists = data.posts.some((post) => post.id === args.data.post && post.published)

			if (!postExists) {
				throw new Error('either post does not exist or is not published')
			}

			const userExists = data.users.some((user) => user.id === args.data.author)

			if (!userExists) {
				throw new Error('user not found')
			}

			const comment = {
				id: uuidv4(),
				...args.data
			}

			data.comments.push(comment)

			return comment
		},
		deleteUser(parents, args, ctx, info) {
			const userExists = data.users.findIndex((user) => user.id === args.id)

			if (userExists === -1) {
				throw new Error('Delete user: user does not exist')
			}

			const deletedUsers = data.users.splice(userExists, 1)

			data.posts = data.posts.filter((post) => {
				const match = post.author === args.id

				if (match) {
					data.comments = data.comments.filter((comment) => comment.post !== post.id)
				}

				return !match
			})

			data.comments = data.comments.filter((comment) => comment.author !== args.id)

			return deletedUsers[0]
		},
		deletePost(parents, args, ctx, info) {
			const postExists = data.posts.findIndex((post) => post.id === args.id)

			if (postExists === -1) {
				throw new Error('Delete post: post does not exist')
			}

			// delete comments on the post
			data.comments = data.comments.filter((comment) => comment.post !== args.id)

			// remove post from Posts
			const deletedPosts = data.posts.splice(postExists, 1)

			// deletedPosts is an array containing a single Post that was deleted
			return deletedPosts[0]
		},
		deleteComment(parents, args, ctx, info) {
			const commentExists = data.comments.findIndex((comment) => comment.id === args.id)

			if (commentExists === -1) {
				throw new Error('Delete comment: comment does not exists')
			}

			const deletedComment = data.comments.splice(commentExists, 1)

			return deletedComment[0]
		}
	},
	Post: {
		author(parent, args, ctx, info) {
			return data.users.find((user) => {
				return user.id === parent.author
			})
		},
		comments(parent, args, ctx, info) {
			return data.comments.filter((comment) => {
				return comment.post === parent.id
			})
		}
	},
	User: {
		posts(parent, args, ctx, info) {
			return data.posts.filter((post) => {
				return post.author === parent.id
			})
		},
		comments(parent, args, ctx, info) {
			return data.comments.filter((comment) => {
				return comment.author === parent.id
			})
		}
	},
	Comment: {
		author(parent, args, ctx, info) {
			return data.users.find((user) => {
				return user.id === parent.author
			})
		},
		post(parent, args, ctx, info) {
			return data.posts.find((post) => {
				return post.id === parent.post
			})
		}
	}
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers: resolvers
})

server.start(() => {
	console.log('the server is running')
})
