// load .env 
import "dotenv/config";

import express from 'express';
import morgan from 'morgan';

import routes from './routes'

const app = express();

app.use(morgan('dev'))
// parse json and url-encoded data in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// setup routes
app.use(routes);
// setup static assets
app.use(express.static(process.env.STORAGE_DIR!))

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server running on ${port}`);
});