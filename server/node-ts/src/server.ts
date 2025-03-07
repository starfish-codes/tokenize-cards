import env from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
env.config({ path: './.env' });

const app = express();
app.use(express.static(process.env.CLIENT_DIR));

app.get('/', (_: Request, res: Response): void => {
  const index = path.resolve(process.env.CLIENT_DIR + '/index.html');
  res.sendFile(index);
});

app.get('/config', async (_: Request, res: Response): Promise<void> => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  headers.set('X-API-KEY', process.env.HELLGATE_API_KEY);

  const request = new Request(
    process.env.HELLGATE_BACKEND + '/tokens/session',
    {
      method: 'POST',
      headers: headers,
    }
  );

  const response = await fetch(request);
  const data = await response.json();

  if (!response.ok) {
    res.status(response.status).send(data);
    return;
  }

  const { session_id } = data;

  res.send({
    session_id: session_id,
    backend_url: process.env.HELLGATE_BACKEND,
  });
});


app.get('/tokens', async (_: Request, res: Response): Promise<void> => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  headers.set('X-API-KEY', process.env.HELLGATE_API_KEY);

  const request = new Request(
    process.env.HELLGATE_BACKEND + '/tokens',
    {
      method: 'GET',
      headers: headers,
    }
  );

  const response = await fetch(request);
  const data = await response.json();

  if (!response.ok) {
    res.status(response.status).send(data);
    return;
  }


  res.send(data);
});


app.delete('/token/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;  
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  headers.set('X-API-KEY', process.env.HELLGATE_API_KEY as string); 

  const request = new Request(
    `${process.env.HELLGATE_BACKEND}/tokens/${id}`, 
    {
      method: 'DELETE', 
      headers: headers,
    }
  );

  try {
    const response = await fetch(request);
    console.log(response)

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).send(data);
      return;
    }

    res.send(data);
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete the token' });
  }
});



app.listen(4711, (): void => console.log(`Server listening on port ${4711}!`));
