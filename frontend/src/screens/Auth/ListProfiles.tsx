import { Link, Outlet } from "react-router-dom";

export default function UserProfiles() {
  const profiles = [1, 2, 3, 4];

  return (
    <div>
      <h1>List Profiles</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile}>
            <Link to={`/profiles/${profile}`}>Profile {profile}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}