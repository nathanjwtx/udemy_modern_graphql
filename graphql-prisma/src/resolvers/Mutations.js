/* eslint-disable no-unused-vars */

/* NOTE: this is the node.js api running on localhost:4000 which limits what the end user can access from the prisma
api running on localhost:4466 */

import {v4 as uuidv4} from 'uuid'
import {prisma} from '../prisma'

const Mutation = {
	async createUser(parent, args, {prisma}, info) {
		// data is the name given to the object in schema.graphql
		const emailTaken = await prisma.exists.User({ email: args.data.email})

		if (emailTaken) {
			throw new Error('email in use')
		}

		return prisma.mutation.createUser({data: args.data}, info)
	},
	async updateUser(parent, { id, data }, { prisma }, info) {
		return prisma.mutation.updateUser({
			where: {
				id: id
			},
			data: data
		}, info)
	},
	async deleteUser(parents, { id }, {prisma}, info) {

		const userExists = await prisma.exists.User({ id })

		if (!userExists) {
			throw new Error('User does not exist')
		}

		return prisma.mutation.deleteUser({where: {id}}, info)
	},
	async createPost(parents, args, { prisma }, info) {
		// check user exists and throw an error if not
		const userExists = await prisma.exists.User({ id: args.data.author })

		if (!userExists) {
			throw new Error('user not found')
		}

		return prisma.mutation.createPost({
			data: {
				title: args.data.title,
				body: args.data.body,
				published: args.data.published,
				author: {
					connect: {
						id: args.data.author
					}
				}
			}}, info)
	},
	async updatePost(parent, { id, data }, {prisma}, info) {
		return prisma.mutation.updatePost({
			where: {
				id
			},
			data
		}, info)
	},
	async deletePost(parents, {id}, {prisma}, info) {
		return prisma.mutation.deletePost({
			where: {
				id
			}
		}, info)
	},
	async createComment(parents, { data: {text, post, author} }, { prisma }, info) {
		return prisma.mutation.createComment({
			data: {
				text,
				post: {
					connect: {
						id: post
					}
				},
				author: {
					connect: {
						id: author
					}
				}
			}
		}, info)
	},
	async updateComment(parent, { id, data }, { prisma }, info) {
		return prisma.mutation.updateComment({
			where: {
				id
			},
			data
		}, info)
	},
	async deleteComment(parents, { id }, { prisma }, info) {
		return prisma.mutation.deleteComment({
			where: {
				id
			}
		}, info)
	}
}

export { Mutation }
