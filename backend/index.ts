import express, { Express, Request, Response } from "express";
const app: Express = express();
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Typescript!");
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
