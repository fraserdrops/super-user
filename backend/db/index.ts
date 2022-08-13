import fs from "fs";

export type User = {
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

export type Users = Array<User>;

const readUsersFromFile = async (): Promise<Users> => {
  try {
    const jsonString = await fs.promises
      .readFile("./db/users.json", "utf8")
      // delay the promise for a bit to give time for loading states to to show on the frontend
      .then((value) => wait(1000, value));
    const users = JSON.parse(jsonString);
    return users;
  } catch (err) {
    console.log("Error reading file from disk:", err);
    throw err;
  }
};

export const getAllUsers = async (): Promise<Users> => {
  const users = await readUsersFromFile();
  return users;
};

export const getUser = async (id: number): Promise<User> => {
  const users = await readUsersFromFile();
  const user = users.find((user: User) => user.id === id);
  if (!user) {
    const error = new Error(`User with id ${id} not found`);
    throw new Error(`User with id ${id} not found`);
  }
  return user;
};

// delay a promise for a given amount of time
function wait<T>(ms: number, value: T) {
  return new Promise<T>((resolve) => setTimeout(resolve, ms, value));
}
