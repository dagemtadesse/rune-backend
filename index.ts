// load .env 
import "dotenv/config";

import express from 'express';

import routes from './routes'

const app = express();

// parse json and url-encoded data in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// setup routes
app.use(routes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server running on ${port}`);
});
