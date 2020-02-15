const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3030;

mongoose.connect(
    'mongodb+srv://Armen:355820431756@cluster0-pm5im.mongodb.net/graphql?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', error => console.log('error', error));
dbConnection.once('open', () => console.log('Connected to DB!'));

app.listen(PORT, err => {
    err
        ? console.log('error in server', err)
        : console.log(`Server started on port ${PORT}`);
});



