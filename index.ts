// load .env 
import "dotenv/config";

import express from 'express';
import morgan from 'morgan';
import fileupload from "express-fileupload";

import routes from './routes'

const app = express();

app.use(morgan('dev'))
// parse json and url-encoded data in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
// setup fileupload
// Option
app.use(fileupload({
    safeFileNames: true,
    useTempFiles: true,
    preserveExtension: true
}));
// setup routes
app.use(routes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server running on ${port}`);
});