import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466'
})

// const createPostForUser =  async (authorId, data) => {
// 	const post = await prisma.mutation.createPost({
// 		data: {
// 			...data,
// 			author: {
// 				connect: {
// 					id: authorId
// 				}
// 			}
// 		}
// 	}, '{ id }')
// 	const user = await prisma.query.user({
// 		where: {
// 			id: authorId
// 		}
// 	}, '{ id name email post { id title published }}')
// 	return user
// }
//
// createPostForUser('ckaimetie002e07461oap8a83', {
// 	title: 'nathan\'s second prisma post',
// 	published: true,
// 	body: 'First one worked so this should as well!'
// }).then((user) => {
// 	console.log(JSON.stringify(user))
// })

const updatePostForUser = async (postId, data) => {
	const post = await prisma.mutation.updatePost({
		where: {
			id: postId
		},
		data: {
			...data
		}
	}, '{ id author { id name }}')

	return await prisma.query.user({
		where: {
			id: post.author.id
		}
	}, '{ id name posts { id title }}')
}

updatePostForUser('ckamiw59b01170988gefbgx0f', {
	published: false,
	body: 'ok, i changed my mind yet again'
})
	.then((result) => {
		console.log(JSON.stringify(result))
	})

// prisma.mutation.createPost({
// 	data: {
// 		title: 'Second post from Prisma',
// 		body: 'tbd',
// 		published: false,
// 		author: {
// 			connect: {
// 				id: 'ckaimeerx001w0746ketvkjeb'
// 			}
// 		}
// 	}
// }, '{ id title body published author { id name }}')
// 	.then((data) => {
// 		console.log(data)
// 		return prisma.query.users(null, '{ id name email posts { id title }}')
// 	}).then((data) => {
// 		console.log(JSON.stringify(data, undefined, 4))
// 	})

// prisma.mutation.updatePost({
// 	data: {
// 		title: 'Updated post title',
// 		published: true
// 	},
// 	where: {
// 		id: 'ckamh4qnr00bk0988qlyvffjn'
// 	}
// }, '{ id title published author { name }}')
// .then((data) => {
// 	console.log(data)
// 	return prisma.query.posts(null, '{id title published author { name }}')
// }).then((data) => {
// 	console.log(JSON.stringify(data, undefined, 4))
// })
