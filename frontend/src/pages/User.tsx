import { useEffect, useReducer } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PageContent from "../components/PageContent";
import { Link } from "../router/Link";
import { useRouter } from "../router/RouterContext";

export type UserType = {
  id: number;
  avatar?: string;
  first_name: string;
  last_name: string;
  email: string;
  emailVerified: boolean;
  dob: string;
  company: Company;
  skills: string[];
};

type Company = {
  name: string;
  department: string;
};

type ErrorInfo = { message: string; code?: number };

interface State<T> {
  data?: T;
  error?: ErrorInfo;
  status: "loading" | "success" | "error";
}

type Action<T> =
  | { type: "loading" }
  | { type: "dataLoaded"; data: T }
  | { type: "error"; error: ErrorInfo };

function useFetch<T>(url?: string): State<T> {
  const initialState: State<T> = {
    error: undefined,
    data: undefined,
    status: "loading",
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...initialState, status: "loading" };
      case "dataLoaded":
        return { ...initialState, data: action.data, status: "success" };
      case "error":
        return { ...initialState, error: action.error, status: "error" };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          dispatch({
            type: "error",
            error: { message: response.statusText, code: response.status },
          });
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as T;
        dispatch({ type: "dataLoaded", data });
      } catch (error) {
        let message;
        // typescript gives Error the type unknown
        // so we have to tell it we know there's a message with the error
        // https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
        if (error instanceof Error) message = error.message;
        else message = String(error);
        dispatch({ type: "error", error: { message } });
      }
    };

    void fetchData();
  }, [url]);

  return state;
}

function User() {
  // the last route segment is the id
  const { route } = useRouter();
  const routeSegments = route.path.split("/");
  const id = routeSegments[routeSegments.length - 1];

  const { data, error, status } = useFetch<UserType>(`http://localhost:5000/api/users/${id}`);

  if (status === "loading")
    return (
      <div className="loading">
        <LoadingSpinner />
      </div>
    );

  if (error) {
    return (
      <PageContent>
        <h2>{error.code}</h2>
        <AllUsersLink />
        <p>{error.message}</p>
      </PageContent>
    );
  }
  if (data) {
    const { first_name, last_name, avatar, email, emailVerified, dob, company, skills } = data;
    return (
      <PageContent>
        <h1 className="user-name">{`${first_name} ${last_name}`}</h1>
        <h3 className="user-id">ID: {id}</h3>
        <AllUsersLink />
        {avatar && <img src={avatar} alt="Avatar" className="user-avatar"></img>}
        <UserInfoItem>
          <UserInfoLabel>
            Email
            <span
              className={`email-status email-status-${emailVerified ? "verified" : "unverified"}`}
            >
              {emailVerified ? "✅ Verified" : "❌ Unverified"}
            </span>
          </UserInfoLabel>
          <UserInfoValue>{email}</UserInfoValue>
        </UserInfoItem>

        <UserInfoItem>
          <UserInfoLabel>DOB</UserInfoLabel>
          <UserInfoValue>{dob}</UserInfoValue>
        </UserInfoItem>

        <UserInfoItem>
          <UserInfoLabel>Company (Department)</UserInfoLabel>
          <UserInfoValue>{`${company.name}  (${company.department})`}</UserInfoValue>
        </UserInfoItem>

        <UserInfoItem>
          <UserInfoLabel>Skills</UserInfoLabel>
          <UserInfoValue>
            <div className="user-skills">
              {skills.map((skill) => (
                <div key={skill} className="user-skill">
                  {skill}
                </div>
              ))}
            </div>
          </UserInfoValue>
        </UserInfoItem>
      </PageContent>
    );
  }

  return null;
}

function UserInfoItem(props: { children: React.ReactNode }) {
  const { children } = props;
  return <div className="user-info-item">{children}</div>;
}

function UserInfoLabel(props: { children: React.ReactNode }) {
  const { children } = props;
  return <p className="user-info-label">{children}</p>;
}

function UserInfoValue(props: { children: React.ReactNode }) {
  const { children } = props;
  return <div className="user-info-value">{children}</div>;
}

function AllUsersLink() {
  return (
    <button className="all-users-button">
      <Link to="/users">All Users</Link>
    </button>
  );
}

export default User;
