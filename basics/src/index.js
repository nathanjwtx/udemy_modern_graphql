import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid'

import { typeDefs } from './typedefs';
import { users, posts, comments } from './demodata'

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
				return users
			} else {
				return users.filter((user) => {
					return user.name.toLowerCase().includes(args.query.toLowerCase())
				})
			}
		},
		posts(parent, args, ctx, info) {
			if (!args.query) {
				return posts
			} else {
				return posts.filter((post) => {
					return post.body.toLowerCase().includes(args.query.toLowerCase()) ||
						post.title.toLowerCase().includes(args.query.toLowerCase())
				})
			}
		},
		comments(parent, args, ctx, info) {
			return comments
		}
	},
	Mutation: {
		createUser(parent, args, ctx, info) {
			const emailTaken = users.some((user) => {
				return user.email === args.data.email
			})

			if (emailTaken) {
				throw new Error('email address already in user')
			}

			const user = {
				id: uuidv4(),
				...args.data
			}

			users.push(user)

			return user
		},
		createPost(parents, args, ctx, info) {
			// check user exists and throw an error if not
			const userExists = users.some((user) => user.id === args.data.author)

			console.log(args.data)
			if (!userExists) {
				throw new Error('user not found')
			}

			const post = {
				id: uuidv4(),
				...args.data
			}

			posts.push(post)

			return post
		},
		createComment(parents, args, ctx, info) {
		  const postExists = posts.some((post) => post.id === args.data.post && post.published)

			if (!postExists) {
				throw new Error("either post does not exist or is not published")
			}

			const userExists = users.some((user) => user.id === args.data.author)

			if (!userExists) {
				throw new Error('user not found')
			}

			const comment = {
				id: uuidv4(),
				...args.data
			}

			comments.push(comment)

			return comment
		}
	},
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author
			})
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.post === parent.id
			})
		}
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter((post) => {
				return post.author === parent.id
			})
		},
		comments(parent, args, ctx, info) {
			return comments.filter((comment) => {
				return comment.author === parent.id
			})
		}
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author
			})
		},
		post(parent, args, ctx, info) {
			return posts.find((post) => {
				return post.id === parent.post
			})
		}
	}
};

const server = new GraphQLServer({
	typeDefs: typeDefs,
	resolvers: resolvers
});

server.start(() => {
	console.log('the server is running');
});
