import Link from "next/link";
import React from "react";
import { Auth } from "aws-amplify";
import { useState } from "react";

const Navbar = () => {
  const [userName, setUserName] = useState();
  Auth.currentUserInfo().then((userInfo) => {
    setUserName(userInfo.username);
  });

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href="/">
          WiFinder
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/flight-path">Flight Path</Link>
          </li>
          <li>
            <Link href="/heat-map">Heat Map</Link>
          </li>
          <li>
            <Link href="/flight-data">Flight Data</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Navbar;
