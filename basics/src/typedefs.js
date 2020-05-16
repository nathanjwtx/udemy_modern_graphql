// type definitions (schema)
const typeDefs = `
	type Query {
		greeting(name: String): String!
		users(query: String): [User!]!
		post: Post!
		posts(query: String): [Post!]!
	}
		
	type User {
		id: ID!
		name: String!
		age: Int
		email: String
	}
	
	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
	}
`;

export { typeDefs }
