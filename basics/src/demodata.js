// demo user data
let users = [{
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

let posts = [{
	id: '4',
	title: 'this is post 0 title',
	body: 'your post body 0',
	published: true,
	author: '3'
}, {
	id: '1',
	title: 'post number 1',
	body: 'body for post 1',
	published: false,
	author: '1'
}, {
	id: '2',
	title: 'post 2 title',
	body: 'something something post 2',
	published: true,
	author: '1'
}, {
	id: '3',
	title: 'post 3 title',
	body: 'blah blah wibble',
	published: true,
	author: '2'
}]

let comments = [{
	id: '1',
	text: 'first up, comment 1',
	author: '1',
	post: '1'
}, {
	id: '2',
	text: 'and here we have number 2',
	author: '1',
	post: '1'
}, {
	id: '3',
	text: 'last but not least, number 3',
	author: '3',
	post: '2'
}, {
	id: '4',
	text: 'spoke too soon, here`s number 4',
	author: '2',
	post: '3'
}]

export { users, posts, comments }
