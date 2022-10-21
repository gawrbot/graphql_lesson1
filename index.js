import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source. ID is a kind of data type in GraphQL
  type Book {
    id: ID
    title: String
    author: String
    createdAt: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    book(ids: ID): [Book]
  }
`;

// This is our fake data source
const books = [
  {
    id: 1,
    title: 'The Awakening',
    author: 'Kate Chopin',
    createdAt: 4582959425,
  },
  {
    id: 2,
    title: 'City of Glass',
    author: 'Paul Auster',
    createdAt: 4582935525,
  },
  {
    id: 3,
    title: 'Maskerade',
    author: 'Terry Pratchett',
    createdAt: 4582975785,
  },
  {
    id: 4,
    title: 'The Left Hand of Darkness',
    author: 'Ursula K. LeGuin',
    createdAt: 4585465423,
  },
  {
    id: 5,
    title: 'The Barbara Johnson Reader',
    author: 'Barbara Johnson',
    createdAt: 4584569542,
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, args, context, info) => {
      console.log("It's working" + args.ids);
      const arrayInfos = Array.from(args.ids);
      return books.filter((book) =>
        arrayInfos.indexOf(parseint(book.id) !== -1),
      );
    },
  },
  Book: {
    createdAt: (parent) => {
      return new Date(parent.createdAt).toISOString();
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
