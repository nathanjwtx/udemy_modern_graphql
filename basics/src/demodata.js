// demo user data
const users = [{
	id: '1',
	name: 'nathan',
	email: 'nathan@email.com'
}, {
	id: '2',
	name: 'charlie',
	email: 'doge@email.com',
	age: 2
}, {
	id: '3',
	name: 'thor',
	email: 'thor@email.com'
}]

const posts = [{
	id: '1',
	title: 'this is post 1 title',
	body: 'your post body 1',
	published: true,
	author: '1'
}, {
	id: '2',
	title: 'post number 2',
	body: 'body for post 2',
	published: false,
	author: '2'
}, {
	id: '3',
	title: 'post 3 title',
	body: 'something something post 3',
	published: true,
	author: '2'
}]

const comments = [{
	id: '1',
	text: 'first up, comment 1'
}, {
	id: '2',
	text: 'and here we have number 2'
}, {
	id: '3',
	text: 'last but not least, number 3'
}, {
	id: '4',
	text: 'spoke too soon, here`s number 4'
}]

export { users, posts, comments }
