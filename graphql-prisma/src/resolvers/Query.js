/* eslint-disable no-unused-vars */
import {getUserId} from '../utils/getUserId'

const Query = {
	async me(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const user = await prisma.query.users({
				where: {
					id: userId
				}
			}, info)
		return user[0]
	},
	users(parent, args, { prisma }, info) {
		const opArgs = {}

		if (args.query) {
			opArgs.where = {
				OR: [{
					name_contains: args.query
				}, {
					email_contains: args.query
				}]
			}
		}

		return prisma.query.users(opArgs, info)
	},
	// published posts are public. logged in users can see their unpublished posts
	async post(parent, { id }, { prisma, request}, info) {
		const userId = getUserId(request, false)

		const posts = await prisma.query.posts({
			where: {
				id,
				OR: [{
					published: true
				}, {
					author: {
						id: userId
					}
				}]
			}
		}, info)

		if (posts.length === 0) {
			throw new Error('Post not found')
		}

		return posts[0]
	},
	// all posts for logged in user - could add filtering as in 'posts' below
	usersPosts(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		const opArgs = {
			where: {
				author: {
					id: userId
				}
			}
		}

		return prisma.query.posts(opArgs, info)
	},
	// public posts
	posts(parent, args, { prisma, request }, info) {
		const opArgs = {
			where: {
				published: true
			}
		}

		if (args.query) {
			opArgs.where.OR = [{
					body_contains: args.query
				}, {
					title_contains: args.query
				}]
			}

		return prisma.query.posts(opArgs, info)
	},
	comments(parent, args, { prisma }, info) {
		return prisma.query.comments(null, info)
	}
}

export { Query }
