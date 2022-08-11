import express, { Express, Request, Response, NextFunction } from "express";
import { User, Users, getUser, getAllUsers } from "./db";

const app: Express = express();
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Typescript!");
});

app.get("/users", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.log("Error getting users");
    res.status(404).send("Error getting users!");
  }
});

app.get("/users/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  try {
    const user = await getUser(parseInt(id));
    res.json(user);
  } catch (err) {
    console.log("Error getting user");
    res.status(404).send("User not found!");
  }
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
