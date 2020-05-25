import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: 'http://localhost:4466'
})

prisma.exists.Post({
	id: 'ckamiw59b01170988gefbgx0f'
}).then(result => {
	console.log(result)
})

const createPostForUser =  async (authorId, data) => {
	const userExists = await prisma.exists.User({
		id: authorId
	})

	if (!userExists) {
		throw new Error('the user does not exist')
	}

	const post = await prisma.mutation.createPost({
		data: {
			...data,
			author: {
				connect: {
					id: authorId
				}
			}
		}
	}, '{ author { id name email posts { id title published }}}')
	return post.author
}

// createPostForUser('ckaimetie002e07461oap8a83', {
// 	title: 'nathan\'s second prisma post',
// 	published: true,
// 	body: 'Second one worked so this should as well!'
// }).then((user) => {
// 	console.log(JSON.stringify(user))
// }).catch(error => {
// 	console.log(`Error: ${error.message}`)
// })

const updatePostForUser = async (postId, data) => {
	const postExists = await prisma.exists.Post({
		id: postId
	})

	if (!postExists) {
		throw new Error('Post does not exist')
	}

	const post = await prisma.mutation.updatePost({
		where: {
			id: postId
		},
		data: {
			...data
		}
	}, '{ author { id name posts { id title }}}')

	return post.author
}

// updatePostForUser('ckamh4qnr00bk0988qlyvffjn', {
// 	published: false,
// 	body: 'charlie changed her mind yet again'
// })
// 	.then((post) => {
// 		console.log(JSON.stringify(post, undefined, 4))
// 	})
// 	.catch(error => {
// 		console.log(`Error: ${error.message}`)
// 	})

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
