import { useEffect, useState } from "react";
import { useRouter } from "../router/RouterContext";

function User() {
  // the last route segment is the id
  const { route } = useRouter();
  const routeSegments = route.path.split("/");
  const id = routeSegments[routeSegments.length - 1];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | { message: string; code?: number }>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          setError({ message: response.statusText, code: response.status });
        }
        let actualData = await response.json();
        setData(actualData);
        setError(null);
      } catch (err) {
        let message;
        // typescript gives Error a type unknown
        // so we have to tell it we know there's a message with the error
        if (err instanceof Error) message = err.message;
        else message = String(err);
        setError({ message });
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  if (error) {
    return (
      <div>
        <h2>{error.code}</h2>
        <p>{error.message}</p>
      </div>
    );
  }
  return (
    <div>
      <h1>User {id}</h1>
      <ul>
        <li>User 1s</li>
        <li>User 2</li>
        <li>User 3</li>
      </ul>
    </div>
  );
}

export default User;
