import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";
import createConnection from "./database";
import { router } from './router';
import { AppError } from './errors/AppError';

createConnection();
const app = express();

app.use(express.json())
app.use(router);

app.use(
    (err: Error, req: Request, res: Response, _next: NextFunction) => {
        if(err instanceof AppError) {
            return res.status(err.statusCode).json({
                menssage: err.menssage,
            })
        }

        return res.status(500).json({
            status: "Error",
            menssage: `Internal server error ${err.message}`,
        })
})

export { app };