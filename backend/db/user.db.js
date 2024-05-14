import pool from "../config/db.config.js";

export const getUserFromUsernameDb = async ({ username }) => {
  const user = await pool.query(
    "SELECT username FROM users WHERE username LIKE $1",
    [`%${username}%`]
  );
  return user;
};

export const getUserNameFromRegexDb = async (regex) => {
  const user = await pool.query(
    "SELECT username FROM users WHERE username LIKE $1",
    [`%${regex}%`]
  );
  return user.rows;
};

export const checkUsernameDb = async ({username}) => {
  const isUsernameExists = await pool.query(
    "SELECT COUNT(*) AS username_count FROM users WHERE username = $1",
    [username]
  );
  if (isUsernameExists.rows[0].username_count > 0) {
    // console.log('Username already exists. Please choose another username.');
    return (true)
  }
  return false;
};

export const updateInformationDb = async ({
  name, username, email, user_id
}) => {
  // const isUsernameExists = await pool.query(
  //   "SELECT COUNT(*) AS username_count FROM users WHERE username = $1",
  //   [username]
  // ); 
  // if (isUsernameExists.rows[0].username_count > 0) {
  //   console.log('Username already exists. Please choose another username.');
  //   return ('Username already exists. Please choose another username.')
  // }
  
  const result = await pool.query(
      "UPDATE users SET name = $1, username = $2, email = $3 WHERE id = $4 RETURNING *",
      [name, username, email, user_id]
    );  
}

export const updatePasswordDb = async ({
  newPassword,user_id
}) => {
  const result = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
      [newPassword, user_id]
    );  
}

export const updateImageDb = async ({
  image, user_id}
) => {
  const result = await pool.query(
    "UPDATE users SET image = $2 WHERE id = $1",
    [user_id, image]
  );

  return result.rows;
};