import "./App.css";
import AllUsers from "./pages/AllUsers";
import User from "./pages/User";
import { RouterProvider } from "./router/RouterContext";
import Routes from "./router/Routes";

function App() {
  return (
    <RouterProvider>
      <Routes routeMap={{ "/users": <AllUsers />, "/users/:id": <User /> }} fallback="/users" />
    </RouterProvider>
  );
}

export default App;
