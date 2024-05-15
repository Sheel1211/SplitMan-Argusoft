import pool from "../config/db.config.js";

export const getGroupExpenses = async (groupId) => {
  const result = await pool.query(
    `SELECT ec.expense_name, u.username as payer_name, ec.total_amount, ec.split_type, ec.expense_description 
     FROM expense_creation ec 
     JOIN users u ON ec.payer_id = u.id 
     WHERE ec.group_id = $1`, 
    [groupId]
  );
  return result.rows;
};

export const getFriendExpenses = async (userId, friendId) => {
  const result = await pool.query(
    `SELECT ec.expense_name, u.username as payer_name, ec.total_amount, ec.split_type, ec.expense_description 
     FROM expense_creation ec 
     JOIN users u ON ec.payer_id = u.id 
     WHERE ec.payer_id = $1 AND ec.debtor_id = $2`, 
    [userId, friendId]
  );
  return result.rows;
};
