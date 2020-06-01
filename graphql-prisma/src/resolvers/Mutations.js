/* eslint-disable no-unused-vars */

/* NOTE: this is the node.js api running on localhost:4000 which limits what the end user can access from the prisma
api running on localhost:4466 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { getUserId } from '../utils/getUserId'

const testing = async () => {
	const email = 'doge@email.io'
	const password = 'wibble321'

	const hashedPWD = '$2a$10$ABfKLuwnbL0obK/zhv4xPOShlJYb9T0TanVnRqWoyU57dm1ukS9Ce'

	const isMatch = await bcrypt.compare(password, hashedPWD)
	console.log(isMatch)
}
testing()

const Mutation = {
	async userLogin(parent, {credentials: {email, password}}, {prisma}, info) {
		const user = await prisma.query.user({
			where: {
				email
			}
		})

		if (!user) {
			throw new Error('Unable to login')
		}

		const isMatch = bcrypt.compare(password, user.password)

		if (!isMatch) {
			// good idea to keep message generic
			throw new Error('Unable to login')
		}

		return {
			user,
			token: jwt.sign({userid: user.id}, 'wibble123')
		}
	},
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
	async createPost(parents, { data }, { prisma, request }, info) {
		const userId = getUserId(request)

		return prisma.mutation.createPost({
			data: {
				title: data.title,
				body: data.body,
				published: data.published,
				author: {
					connect: {
						id: userId
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
