import multer from "multer";
import pool from "../config/db.config.js";
import path from "path";
import fs from "fs";

import { ErrorHandler } from "../middlewares/error.js";
import ExpenseService from "../services/expense.service.js";
export const createExpense = async (req, res, next) => {
    try {
        const { expense_name, expense_amount, expense_description, payer_id, group_id, split_type } = req.body;

        const recipients = JSON.parse(req.body.recipients);
        
        const image = `${process.env.URL}/ExpenseImage/${req.file.filename}`;
        if (!expense_name?.trim()) {
            next(new ErrorHandler("Please provide Expense name", 400));
        } else if (!expense_amount?.trim()) {
            next(new ErrorHandler("Please provide Expense Amount", 400));
        } else if (!expense_description?.trim()) {
            next(new ErrorHandler("Please provide Expense Description", 400));
        } else if (!payer_id?.trim()) {
            next(new ErrorHandler("Please provide Payee Id", 400));
        } else if (!group_id?.trim()) {
            next(new ErrorHandler("Please provide Group Id", 400));
        } else if (!split_type?.trim()) {
            next(new ErrorHandler("Please provide Split Type", 400));
        }

        const createExpense = await ExpenseService.createExpense({
            expense_name,
            expense_amount,
            expense_description,
            payer_id,
            group_id,
            split_type,
            image,
            recipients,
          });
          res.status(201).json({
            success: true,
            message: `Expense Created successfully!`,
            ExpenseId: createExpense,
          });

    } catch (error) {
        next(error);
    }
}

export const updateExpense = async (req, res, next) => {
    try {
        const { expense_name, expense_amount, expense_description, payer_id, group_id, split_type, expense_id } = req.body;

        const recipients = JSON.parse(req.body.recipients);
        
        const image = `${process.env.URL}/ExpenseImage/${req.file.filename}`;
        if (!expense_name?.trim()) {
            next(new ErrorHandler("Please provide Expense name", 400));
        } else if (!expense_amount?.trim()) {
            next(new ErrorHandler("Please provide Expense Amount", 400));
        } else if (!expense_description?.trim()) {
            next(new ErrorHandler("Please provide Expense Description", 400));
        } else if (!payer_id?.trim()) {
            next(new ErrorHandler("Please provide Payee Id", 400));
        } else if (!group_id?.trim()) {
            next(new ErrorHandler("Please provide Group Id", 400));
        } else if (!split_type?.trim()) {
            next(new ErrorHandler("Please provide Split Type", 400));
        }

        const updateExpense = await ExpenseService.updateExpense({
            expense_name,
            expense_amount,
            expense_description,
            payer_id,
            group_id,
            split_type,
            image,
            recipients,
            expense_id
          });
          res.status(201).json({
            success: true,
            message: `Expense Updated successfully!`,
            ExpenseId: updateExpense,
          });

    } catch (error) {
        next(error);
    }
}

export const fetchExpense = async (req, res, next) => {
  try {
      const group_id = req.params.group_id;
 
      const fetchExpense = await ExpenseService.fetchExpense({
          group_id,
        });
        res.status(201).json({
          success: true,
          message: `Expense Fetched successfully!`,
          ExpenseId: fetchExpense,
        });

  } catch (error) {
      next(error);
  }
}

export const viewExpense = async (req, res, next) => {
    try {
        const group_id = req.params.group_id;
        const viewExpense = await ExpenseService.fetchExpense({
          group_id,
        });

        const expense_rows = []

        viewExpense.forEach(row => {
            expense_rows.push(row);
          });
          console.log(expense_rows)
        res.status(201).json({
          success: true,
          message: `view expense successful`,
          expenseRows: expense_rows,
        });
  
    } catch (error) {
        next(error);
    }
  };

  export const createExpenseFrd = async (req, res, next) => {
    try {
      const {
        expense_name,
        total_amount,
        expense_description,
        payer_friend_id,
        split_type,
        conversation_id,
      } = req.body;
  
      var deb_amount = 0
  
      
      const bill_receipt_name = `${process.env.URL}/ExpenseImage/${req.file.filename}`;
      if (!expense_name?.trim()) {
          next(new ErrorHandler("Please provide Expense name", 400));
      } else if (!total_amount?.trim()) {
          next(new ErrorHandler("Please provide Expense Amount", 400));
      } else if (!expense_description?.trim()) {
          next(new ErrorHandler("Please provide Expense Description", 400));
      } else if (!payer_friend_id?.trim()) {
          next(new ErrorHandler("Please provide Payee Id", 400));
      } else if (!conversation_id?.trim()) {
          next(new ErrorHandler("Please provide Conversation Id", 400));
      } else if (!split_type?.trim()) {
          next(new ErrorHandler("Please provide Split Type", 400));
      }
      
      if(split_type == "Equal"){
          deb_amount = total_amount/2
      }else{
          const split_data = JSON.parse(req.body.split_data);
          const payerPercentage = split_data[payer_friend_id] / 100;
          const payerAmount = total_amount * payerPercentage;
          deb_amount = total_amount - payerAmount;
      }
  
      const createExpense = await ExpenseService.createExpenseFrd({
          expense_name,
          total_amount,
          expense_description,
          payer_friend_id,
          split_type,
          bill_receipt_name,
          conversation_id,
          deb_amount
      });
      res.status(201).json({
        success: true,
        message: `Expense Created successfully!`,
        ExpenseId: createExpense,
      });
    } catch (error) {
      next(error);
    }
  };

export const prefillExpense = async (req, res, next) => {
  try {
      const expense_id = req.params.expense_id; 
  
      const prefillExpense = await ExpenseService.prefillExpense({
          expense_id,
        });
        res.status(201).json({
          success: true,
          message: `expense prefilled successfully!`,
          Expense: prefillExpense,
        });

    } catch (error) {
        next(error);
    }
  }

  
export const getParticipantData = async (req, res, next) => {
  try {
    const expense_id = req.params.expense_id;

    const settlement_data = await ExpenseService.getSettlementData({
      expense_id,
    });
    res.status(201).json({
      success: true,
      message: `Expense Fetched successfully!`,
      ExpenseId: settlement_data,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchExpenseFrdConversation = async (req, res, next) => {
  try {
    const conversation_id = req.params.conversation_id;

    const fetchExpense = await ExpenseService.fetchExpenseFrdConversation({
      conversation_id,
    });
    res.status(201).json({
      success: true,
      message: `Expense Fetched successfully!`,
      ExpenseId: fetchExpense,
    });
  } catch (error) {
    next(error);
  }
};


export const settleFrdExpense = async (req, res, next) => {
  try {
    const expense_id = req.params.expense_id;

    const is_settle = await ExpenseService.settleFrdExpense({
      expense_id,
    });
    res.status(201).json({
      success: true,
      message: `Expense Settled successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

export const settleAllParticipant = async (req, res, next) => {
  try {
    const expense_id = req.params.expense_id;

    const is_settle = await ExpenseService.settleAllParticipants({
      expense_id,
    });
    res.status(201).json({
      success: true,
      message: `Expense Settled successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

export const settleOneParticipant = async (req, res, next) => {
  try {
    const participant_id = req.params.participant_id;

    const is_settle = await ExpenseService.settleOneParticipants({
      participant_id,
    });
    res.status(201).json({
      success: true,
      message: `Expense Settled successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

const storage = multer.diskStorage({
    destination: "./upload/ExpenseImage",
    filename: (req, file, cb) => {
      return cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });

  
  export const upload = multer({
    storage: storage,
  });