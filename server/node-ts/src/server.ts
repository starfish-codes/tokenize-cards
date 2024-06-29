import env from "dotenv";
import path from "path";
env.config({ path: "./.env" });
import express, { Request, Response } from "express";

const app = express();
app.use(express.static(process.env.CLIENT_DIR));

app.get("/", (_: Request, res: Response): void => {
    const index = path.resolve(process.env.CLIENT_DIR + "/index.html");
    res.sendFile(index);
});

app.get("/config", async (_: Request, res: Response): Promise<void> => {
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Accept', 'application/json')
    headers.set('X-API-KEY', process.env.HELLGATE_API_KEY)
    
    const request = new Request(process.env.HELLGATE_BACKEND + "/tokens/session", {
        method: 'POST',
        headers: headers,
    })

    const response = await fetch(request)
    const {session_id} = await response.json()

    res.send({
        session_id: session_id,
        backend_url: process.env.HELLGATE_BACKEND,
    });
});

app.listen(4711, (): void =>
    console.log(`Server listening on port ${4711}!`)
);