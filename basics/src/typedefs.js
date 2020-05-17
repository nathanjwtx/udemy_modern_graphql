// type definitions (schema)
const typeDefs = `
	type Query {
		greeting(name: String): String!
		users(query: String): [User!]!
		post: Post!
		posts(query: String): [Post!]!
		comments: [Comment!]!
	}
	
	type Mutation {
		createUser(name: String!, email: String!, age: Int): User!
		createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
	}
		
	type User {
		id: ID!
		name: String!
		age: Int
		email: String
		posts: [Post!]!
		comments: [Comment!]!
	}
	
	type Post {
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
		comments: [Comment!]!
	}
	
	type Comment {
		id: ID!
		text: String!
		author: User!
		post: Post!
	}
`;

export { typeDefs }
