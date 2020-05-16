import { GraphQLServer } from 'graphql-yoga';

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
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author
			})
		}
	},
	User: {
		posts(parent, args, ctx, info) {
			return posts.filter((post) => {
				return post.author === parent.id
			})
		}
	},
	Comment: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author
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
