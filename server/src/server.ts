import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
dotenv.config();
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static('../client/dist'));

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes
app.use(routes);

app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
