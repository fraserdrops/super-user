import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import User, { UserType } from "./User";

const mockUser: UserType = {
  id: 1,
  first_name: "john",
  last_name: "dev",
  company: { name: "beatles", department: "guitar" },
  email: "john@beatles.com",
  emailVerified: true,
  dob: "1/1/2000",
  skills: ["guitar", "drums"],
};

const userDetailsEndpoint = "http://localhost:5000/api/users/1";

const server = setupServer(
  rest.get(userDetailsEndpoint, (req, res, ctx) => {
    return res(ctx.json(mockUser));
  })
);

jest.mock("../router/RouterContext", () => ({
  useRouter: () => ({ route: { path: "/users/1" } }),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads the user and displays their name", async () => {
  render(<User />);
  await screen.findByText("john dev");
});

test("handles server error", async () => {
  server.use(
    rest.get(userDetailsEndpoint, (req, res, ctx) => {
      return res(ctx.status(404, "User not found!"));
    })
  );

  render(<User />);

  await screen.findByText("User not found!");
});
