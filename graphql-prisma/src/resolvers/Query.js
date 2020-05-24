/* eslint-disable no-unused-vars */
const Query = {
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
			return ctx.db.users
		} else {
			return ctx.db.users.filter((user) => {
				return user.name.toLowerCase().includes(args.query.toLowerCase())
			})
		}
	},
	posts(parent, args, { db }, info) {
		if (!args.query) {
			return db.posts
		} else {
			return db.posts.filter((post) => {
				return post.body.toLowerCase().includes(args.query.toLowerCase()) ||
					post.title.toLowerCase().includes(args.query.toLowerCase())
			})
		}
	},
	comments(parent, args, { db }, info) {
		return db.comments
	}
}

export { Query }
