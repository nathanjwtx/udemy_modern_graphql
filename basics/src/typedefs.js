// type definitions (schema)
const typeDefs = `
	type Query {
		greeting(name: String): String!
		users(query: String): [User!]!
		post: Post!
		posts(query: String): [Post!]!
		comments: [Comment!]!
	}
		
	type User {
		id: ID!
		name: String!
		age: Int
		email: String
		posts: [Post!]!
	}
	
	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
	}
	
	type Comment {
		id: ID!
		text: String!
		author: User!
	}
`;

export { typeDefs }
