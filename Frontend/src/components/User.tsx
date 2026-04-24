import React from "react";

type user = {
  name: string;
  email: string;
};

const User = ({ name, email }: user) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{email}</h2>
    </div>
  );
};

export default User;
