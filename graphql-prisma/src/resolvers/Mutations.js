/* eslint-disable no-unused-vars */

/* NOTE: this is the node.js api running on localhost:4000 which limits what the end user can access from the prisma
api running on localhost:4466 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
	async createUser(parent, {data: {name, email, password}}, {prisma}, info) {
		// data is the name given to the object in schema.graphql
		if (password.length < 8) {
			throw new Error('Password must be 8 characters or longer')
		}

		const pwd = await bcrypt.hash(password, 10)

		const emailTaken = await prisma.exists.User({ email})

		if (emailTaken) {
			throw new Error('email in use')
		}

		const user = await prisma.mutation.createUser({
				data: {
					name,
					email,
					password: pwd
				}
			})

		return {
			user,
			token: jwt.sign({userid: user.id}, 'wibble123')
		}
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
