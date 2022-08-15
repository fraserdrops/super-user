import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PageContent from "../components/PageContent";
import { useRouter } from "../router/RouterContext";
import { UserType } from "./User";

function AllUsers() {
  const [data, setData] = useState<null | Array<UserType>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | { message: string; code?: number }>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users`);
        if (!response.ok) {
          setError({ message: response.statusText, code: response.status });
        }
        let actualData = (await response.json()) as Array<UserType>;
        setData(actualData);
        setError(null);
      } catch (err) {
        let message;
        // typescript gives Error a type unknown
        // so we have to tell it we know there's a message with the error
        // https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
        if (err instanceof Error) message = err.message;
        else message = String(err);
        setError({ message });
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading)
    return (
      <div className="loading">
        <LoadingSpinner />
      </div>
    );

  if (error) {
    return (
      <div>
        <h2>{error.code}</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (data) {
    return (
      <PageContent>
        <h1>Users</h1>
        <div className="users-table-container">
          <table className="users-table">
            <thead className="users-table-head">
              <tr>
                <td>First Name</td>
                <td>Last Name</td>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      </PageContent>
    );
  }

  return null;
}

function UserRow(props: { user: UserType }) {
  const { user } = props;
  const { first_name, last_name, id } = user;
  const { history } = useRouter();
  return (
    // html tables don't allow you to wrap a row in an anchor tag
    // so we need to fire the router manually
    <tr className="users-table-row" onClick={() => history.push(`/users/${id}`)}>
      <td>{first_name}</td>
      <td>{last_name}</td>
    </tr>
  );
}
export default AllUsers;
