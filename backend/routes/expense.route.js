import express from "express";

import {
  createExpense,
  fetchExpense,
  updateExpense,
  viewExpense,
  prefillExpense,
  createExpenseFrd,
  fetchExpenseFrdConversation,
  getParticipantData,
  settleAllParticipant,
  settleFrdExpense,
  settleOneParticipant,
  upload
} from "../controllers/expense.controller.js";

const expenseRouter = express.Router();
expenseRouter.post("/create", upload.single("ExpenseImage"), createExpense);
expenseRouter.put("/update", upload.single("ExpenseImage"), updateExpense);
expenseRouter.post("/createFriendExpense", upload.single("ExpenseImage"), createExpenseFrd);
expenseRouter.get("/fetchExpenses/:group_id", fetchExpense);
expenseRouter.get("/viewExpenses/:group_id", viewExpense);
expenseRouter.get("/prefillExpenses/:expense_id", prefillExpense);
expenseRouter.get("/fetchExpenseFrdConversation/:conversation_id", fetchExpenseFrdConversation);
expenseRouter.post("/settleFrdExpense/:expense_id", settleFrdExpense);
expenseRouter.post("/settleAllParticipant/:expense_id", settleAllParticipant);
expenseRouter.post("/settleOneParticipant/:participant_id", settleOneParticipant);
expenseRouter.get("/getParticipantData/:expense_id", getParticipantData);
export default expenseRouter;
