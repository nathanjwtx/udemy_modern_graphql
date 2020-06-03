/* eslint-disable no-unused-vars */
import {getUserId} from '../utils/getUserId'

const Query = {
	async me(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		return prisma.query.users({
			where: {
				id: userId
			}
		}, info)
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
	posts(parent, args, { prisma, request }, info) {
		const opArgs = {}

		if (args.query) {
			opArgs.where = {
				OR: [{
					body_contains: args.query
				}, {
					title_contains: args.query
				}]
			}
		}

		return prisma.query.posts(opArgs, info)
	},
	comments(parent, args, { prisma }, info) {
		return prisma.query.comments(null, info)
	}
}

export { Query }
