import express, { Express, Request, Response, NextFunction } from "express";
import { User, Users, getUser, getAllUsers } from "./db";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Typescript!");
});

app.get("/api/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.log("Error getting users");
    res.status(404).send("Error getting users!");
  }
});

app.get("/api/users/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const user = await getUser(parseInt(id));
    res.json(user);
  } catch (err) {
    console.log("Error getting user");
    res.statusMessage = "User not found!";
    res.status(404).end();
  }
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
