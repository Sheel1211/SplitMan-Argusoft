import { createExpenseDb,createExpenseDbFrd, fetchExpenseDb, updateExpenseDb, prefillExpenseDb,
  fetchExpenseFrdConversationDb,
  getSettlementDataDb,
  settleAllExpanseParticipantDb,
  settleFrdExpenseDb,
  settleOneExpanseParticipantDb,
 } from "../db/expense.db.js";


class ExpenseService {
    static createExpense = async (data) => {
      try {
        return await createExpenseDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };
    static createExpenseFrd = async (data) => {
      try {
        return await createExpenseDbFrd(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };
  

    static updateExpense = async (data) => {
      try {
        return await updateExpenseDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };

    static fetchExpense = async (data) => {
      try {
        return await fetchExpenseDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };

    static fetchExpenseFrdConversation = async (data) => {
      try {
        return await fetchExpenseFrdConversationDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };
  
    static settleFrdExpense = async (data) => {
      try {
        return await settleFrdExpenseDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };
  
    static getSettlementData = async (data) => {
      try {
        return await getSettlementDataDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };
    
    static settleAllParticipants = async (data) => {
      try {
        return await settleAllExpanseParticipantDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };
  
    static settleOneParticipants = async (data) => {
      try {
        return await settleOneExpanseParticipantDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };
    static prefillExpense = async (data) => {
      try {
        return await prefillExpenseDb(data);
      } catch (error) {
        console.log(error);
        throw new ErrorHandler("Error While Database Operation", 401);
      }
    };
}
export default ExpenseService;