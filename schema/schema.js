const graphql = require('graphql');
const Movies = require('../models/movie');
const Directors = require('../models/director');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;


const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
       id: { type: GraphQLID },
       name: { type: new GraphQLNonNull(GraphQLString) },
       genre: { type: new GraphQLNonNull(GraphQLString) },
       rate: { type: GraphQLInt },
       watched: { type: new GraphQLNonNull(GraphQLBoolean) },
       director: {
           type: DirectorsType,
           resolve: ({ directorId }) => {
               return Directors.findById(directorId);
           }
       }
    }),
});

const DirectorsType = new GraphQLObjectType({
    name: 'Directors',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve: ({id}) => {
                return Movies.find({ directorId: id });
            },
        }
    }),
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, {id}) => {
                return Movies.findById(id);
            }
        },
        director: {
            type: DirectorsType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, {id}) => {
                return Directors.findById(id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve: () => {
                return Movies.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorsType),
            resolve: () => {
                return Directors.find({});
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorsType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, { name, age }) {
                const director = new Directors({
                    name,
                    age,
                });
                return director.save();
            },
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                rate: { type: GraphQLInt },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                directorId: { type: GraphQLID },
            },
            resolve(parent, { name, genre, directorId, rate, watched }) {
                const movie = new Movies({
                    name,
                    genre,
                    directorId,
                    rate,
                    watched,
                });
                return movie.save();
            },
        },
        deleteDirector: {
            type: DirectorsType,
            args: { id: { type: GraphQLID } },
            resolve(parent, {id}) {
                return Directors.findByIdAndRemove(id);
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, {id}) {
                return Movies.findByIdAndRemove(id);
            }
        },
        updateDirector: {
            type: DirectorsType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, { name, age, id }) {
                return Directors.findByIdAndUpdate(
                    id,
                    { $set: { name, age } },
                    { new: true },
                );
            },
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                rate: { type: GraphQLInt },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                directorId: { type: GraphQLID },
            },
            resolve(parent, { name, genre, directorId, rate, watched, id }) {
                return Movies.findByIdAndUpdate(
                    id,
                    { $set: {
                        name,
                        genre,
                        directorId,
                        rate,
                        watched,
                    } },
                    { new: true },
                );
            },
        },
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});
