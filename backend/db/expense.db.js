import pool from "../config/db.config.js";
import fs from "fs";
export const createExpenseDb = async ({
    expense_name,
    expense_amount,
    expense_description,
    payer_id,
    group_id,
    split_type,
    image,
    recipients
}) => {
    const result = await pool.query(
        "INSERT INTO expense_creation ( expense_name, total_amount, expense_description, payer_id, group_id, split_type, bill_receipt ) VALUES ($1, $2 , $3, $4, $5, $6, $7) RETURNING *",
        [expense_name, expense_amount, expense_description, payer_id, group_id, split_type, image]
      );

    const expense_id = result.rows[0].expense_id;
    recipients.map(async (recipient) => {
        if (result.rows[0].payer_id != recipient.user_id) {
          await pool.query(
            `INSERT INTO expense_participants(
                expense_id,payer_id,debtor_id,amount)
                VALUES ($1, $2, $3, $4) RETURNING *;`,
            [
              expense_id,
              result.rows[0].payer_id,
              recipient.user_id,
              parseInt(recipient.amount),
            ]
          );
        }
      });
      
}

export const createExpenseDbFrd = async ({
  expense_name,
  total_amount,
  expense_description,
  payer_friend_id,
  split_type,
  bill_receipt_name,
  conversation_id,
  deb_amount
}) => {
  try {
    const result = await pool.query(
      "INSERT INTO expense_friends ( expense_name, total_amount, expense_description, payer_frd , conversation_id, split_type, bill_receipt , time_created,deb_amount ) VALUES ($1, $2 , $3, $4, $5, $6, $7 , $8,$9) RETURNING *",
      [expense_name, total_amount, expense_description, payer_friend_id, conversation_id, split_type, bill_receipt_name, new Date(),deb_amount]
    );
  } catch (error) {
    console.log(error);
  }
   
     
}

export const updateExpenseDb = async ({
    expense_name,
    expense_amount,
    expense_description,
    payer_id,
    group_id,
    split_type,
    image,
    recipients,
    expense_id
}) => {
    const result = await pool.query(
        "UPDATE expense_creation SET expense_name = $1, total_amount = $2, expense_description = $3, payer_id = $4, group_id = $5, split_type = $6, bill_receipt = $7 WHERE expense_id = $8 RETURNING *",
        [expense_name, expense_amount, expense_description, payer_id, group_id, split_type, image, expense_id]
      );

    recipients.map(async (recipient) => {
        if (result.rows[0].payer_id != recipient.user_id) {
          await pool.query(
            `UPDATE expense_participants SET payer_id = $1, debtor_id = $2, amount = $3 WHERE expense_id = $4 AND payer_id = $5 AND debtor_id = $6;`,
            [
              result.rows[0].payer_id,
              recipient.user_id,
              parseInt(recipient.amount),
              expense_id,
              result.rows[0].payer_id,
              recipient.user_id,
            ]
          );
        }
      });
    
}

export const fetchExpenseDb = async ({group_id}) => {
    const result = await pool.query(
        "SELECT * FROM expense_creation  WHERE group_id = $1 ",
        [group_id]
      );

      return result.rows;
}

export const fetchExpenseFrdConversationDb = async ({conversation_id}) => {
  const result = await pool.query(
      "SELECT * FROM expense_friends WHERE conversation_id = $1",
      [conversation_id]
    );

    return result.rows;
}

export const prefillExpenseDb = async ({expense_id}) => {
  const result = await pool.query(
    `SELECT e.*,ep.*,u.*, payer.username as payer_username FROM expense_creation e 
    JOIN 
      expense_participants ep ON e.expense_id = ep.expense_id 
    JOIN 
      users u ON ep.debtor_id = u.id 
    JOIN
      users payer ON ep.payer_id = payer.id
    WHERE 
      e.expense_id = $1`,[expense_id]);

    return result.rows;
}


export const settleFrdExpenseDb = async ({expense_id}) => {
  const result = await pool.query(
      "UPDATE expense_friends SET is_settled = true where e_id = $1", [expense_id]
    );
    return true
}

export const getSettlementDataDb = async ({expense_id}) => {
  const result = await pool.query(
      "SELECT ep.participants_id,ep.amount, ep.is_settled, e.expense_id, payer.name AS payer_name, debtor.name AS debtor_name FROM  expense_creation e JOIN expense_participants ep ON ep.expense_id = e.expense_id JOIN users payer ON ep.payer_id = payer.id JOIN users debtor ON ep.debtor_id = debtor.id WHERE e.expense_id = $1", [expense_id]
    );
    return result.rows
}


export const settleAllExpanseParticipantDb = async ({expense_id}) => {
const { rows: expensesData } = await pool.query(
  `
  UPDATE expense_participants SET amount = 0 , is_settled = TRUE WHERE expense_id = $1
`,
  [expense_id]
);


const { rows: expenseSettlement } = await pool.query(
  `
  UPDATE expense_creation SET is_settled = TRUE WHERE expense_id = $1
`,
  [expense_id]
);
return true;
};

export const settleOneExpanseParticipantDb = async ({participant_id}) => {
const { rows: expensesData } = await pool.query(
  `
  UPDATE expense_participants SET amount = 0 , is_settled = TRUE WHERE participants_id = $1 RETURNING expense_id
`,
  [participant_id]
);

const { rows: settlementData } = await pool.query(
  `
  select * from expense_participants where expense_id = $1 AND is_settled = FALSE
`,
  [expensesData[0].expense_id]
);

if (settlementData.length == 0) {
  const { rows: expenseSettlement } = await pool.query(
    `
    UPDATE expense_creation SET is_settled = TRUE WHERE expense_id = $1
  `,
    [expensesData[0].expense_id]
  );
}

return true;
};

