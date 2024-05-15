import PDFDocument from 'pdfkit';
import { generateGroupReport, generateFriendReport } from '../services/report.service.js';

export const downloadGroupReportPDF = async (req, res) => {
  const groupId = req.params.groupId;
  const expenses = await generateGroupReport(groupId);

  const doc = new PDFDocument();
  res.setHeader('Content-disposition', 'attachment; filename=group-report.pdf');
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  // Title
  doc.fontSize(18).text('Group Expenses Report', { align: 'center' });
  doc.moveDown(2);

  // Define table column positions and widths
  const columnPositions = {
    expenseName: 50,
    payerName: 150,
    totalAmount: 250,
    splitType: 350,
    expenseDescription: 450
  };
  const columnWidths = {
    expenseName: 100,
    payerName: 100,
    totalAmount: 100,
    splitType: 100,
    expenseDescription: 150
  };

  // Set a fixed y position for headers
  const headerYPosition = doc.y;

  // Draw table headers
  doc.fontSize(10)
    .text('Expense Name', columnPositions.expenseName, headerYPosition, { width: columnWidths.expenseName })
    .text('Payer Name', columnPositions.payerName, headerYPosition, { width: columnWidths.payerName })
    .text('Total Amount', columnPositions.totalAmount, headerYPosition, { width: columnWidths.totalAmount })
    .text('Split Type', columnPositions.splitType, headerYPosition, { width: columnWidths.splitType })
    .text('Expense Description', columnPositions.expenseDescription, headerYPosition, { width: columnWidths.expenseDescription });

  // Draw a line below headers
  doc.moveTo(50, headerYPosition + 15).lineTo(550, headerYPosition + 15).stroke();
  doc.y += 20;

  // Draw table rows
  expenses.forEach(expense => {
    const startY = doc.y;
    doc.fontSize(10)
      .text(expense.expense_name, columnPositions.expenseName, startY, { width: columnWidths.expenseName })
      .text(expense.payer_name, columnPositions.payerName, startY, { width: columnWidths.payerName })
      .text(expense.total_amount.toString(), columnPositions.totalAmount, startY, { width: columnWidths.totalAmount })
      .text(expense.split_type, columnPositions.splitType, startY, { width: columnWidths.splitType })
      .text(expense.expense_description, columnPositions.expenseDescription, startY, { width: columnWidths.expenseDescription });

    // Draw a line after each row
    doc.moveTo(50, startY + 15).lineTo(550, startY + 15).stroke();
    doc.y += 20;
  });

  doc.end();
};

export const downloadFriendReportPDF = async (req, res) => {
  const { userId, friendId } = req.params;
  const expenses = await generateFriendReport(userId, friendId);

  const doc = new PDFDocument();
  res.setHeader('Content-disposition', 'attachment; filename=friend-report.pdf');
  res.setHeader('Content-type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(18).text('Friend Expenses Report', { align: 'center' });
  doc.moveDown();
  expenses.forEach(expense => {
    doc.fontSize(12).text(`Expense Name: ${expense.expense_name}`);
    doc.text(`Payer Name: ${expense.payer_name}`);
    doc.text(`Total Amount: ${expense.total_amount}`);
    doc.text(`Split Type: ${expense.split_type}`);
    doc.text(`Expense Description: ${expense.expense_description}`);
    doc.moveDown();
  });

  doc.end();
};
