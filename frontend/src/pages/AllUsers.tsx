import { Link } from "../router/Link";

function AllUsers() {
  return (
    <div>
      <h1>All Users</h1>
      <ul>
        <li>User 1s</li>
        <li>User 2</li>
        <li>User 3</li>
      </ul>
      <Link to={`/users/1`}>User 1</Link>
    </div>
  );
}

export default AllUsers;
