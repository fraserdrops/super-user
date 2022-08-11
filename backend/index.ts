import express, { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
const app: Express = express();
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Typescript!");
});

type User = {
  id: number;
  avatar?: string;
  first_name: string;
  last_name: string;
  email: string;
  emailVerified: boolean;
  dob: Date;
  company: Company;
  skills: string[];
};

type Company = {
  name: string;
  department: string;
};

app.get("/users", (req: Request, res: Response, next: NextFunction) => {
  fs.readFile("./users.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      next(err);
      return;
    }
    try {
      const users = JSON.parse(jsonString);
      console.log("users", users);
      return res.json(jsonString);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

app.get("/users/:id", (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  fs.readFile("./users.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      next(err);
      return;
    }
    try {
      const users = JSON.parse(jsonString);
      const user = users.find((user: User) => user.id.toString() === id);
      console.log("user", user);
      return res.json(user);
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
