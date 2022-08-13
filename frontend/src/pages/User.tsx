import { useEffect, useState } from "react";
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

function User() {
  // the last route segment is the id
  const { route } = useRouter();
  const routeSegments = route.path.split("/");
  const id = routeSegments[routeSegments.length - 1];

  const [data, setData] = useState<null | UserType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | { message: string; code?: number }>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          setError({ message: response.statusText, code: response.status });
        }
        let actualData = (await response.json()) as UserType;
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
  }, [id]);

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
    const { first_name, last_name, avatar, email, emailVerified, dob, company, skills } = data;
    return (
      <PageContent>
        <h1 className="user-name">{`${first_name} ${last_name}`}</h1>
        <BackButton />
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
          <UserInfoLabel>Company</UserInfoLabel>
          <UserInfoValue>{company.name + ", " + company.department}</UserInfoValue>
        </UserInfoItem>

        <UserInfoItem>
          <UserInfoLabel>Skills</UserInfoLabel>
          <UserInfoValue>
            <div className="user-skills">
              {skills.map((skill) => (
                <div className="user-skill">{skill}</div>
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

function BackButton() {
  return (
    <button className="user-back-button">
      <Link to="/users">Back</Link>
    </button>
  );
}

export default User;
