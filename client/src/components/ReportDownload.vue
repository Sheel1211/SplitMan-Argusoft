<template>
  <div>
    <!-- Button to trigger report download -->
    <!-- <v-btn @click="downloadReport">Download Report</v-btn> -->
    <!-- <v-icon @click="downloadReport">mdi-download</v-icon> -->
    <!-- Button to trigger report download -->
    <a :href="pdfUrl" download="expense_report.pdf">
      <v-icon @click="downloadReport">mdi-download</v-icon>
    </a>
  </div>
</template>

<script>
//   import html2pdf from "html2pdf.js";
import html2pdf from "html2pdf.js";

export default {
  name: "ReportDownload",
  props: {
    expense_id: {
      type: String, // Assuming expense_id is of type String
      required: true,
    },
    expenses: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async downloadReport() {
      console.log("Downloading report...");
      // console.log("expenses ",this.expenses)
      // console.log("expense id ",this.expense_id)
      // Create a new div element to hold the table content
      // Filter expenses based on expense_id
      const filteredExpense = this.expenses.find(
        (expense) => expense.e_id === this.expense_id
      );
      // Assuming filteredExpense.time_created is the time string from the API
      const timeCreated = new Date(filteredExpense.time_created);

     // Assuming filteredExpense.time_created is the date string in ISO format
const dateObj = new Date(filteredExpense.time_created);
const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`;


      // Create a new div element to hold the table content
      const div = document.createElement("div");
      div.className = "report-content"; // Add this line


      div.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 100%; padding-top: 20px;">
  <h1 style="text-align: center; color: #3366cc;">Report for Expense</h1>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr>
        <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f2f2f2;">Expense Name</th>
        <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${filteredExpense.expense_name}</td>
      </tr>
      <tr>
        <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f2f2f2;">Total Amount</th>
        <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${filteredExpense.total_amount}</td>
      </tr>
      <tr>
        <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f2f2f2;">Split Type</th>
        <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${filteredExpense.split_type}</td>
      </tr>
      <tr>
        <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f2f2f2;">Debt Amount</th>
        <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${filteredExpense.deb_amount}</td>
      </tr>
      <tr>
        <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f2f2f2;">Time Created</th>
        <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${timeCreated.toLocaleTimeString()}</td>
      </tr>
      <tr>
        <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f2f2f2;">Date Created</th>
        <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${formattedDate}</td>
      </tr>
    </tbody>
  </table>
</div>

      `;

      console.log("div ", div);
      // Use html2pdf to convert the HTML content to PDF
      // html2pdf().from(div).save("expense_report.pdf");
      // Use html2pdf to convert the HTML content to PDF
      html2pdf().from(div).save("expense_report.pdf");
      console.log("PDF downloaded successfully.");
    },
  },
};
</script>

<style scoped>
/* Styles if any */
.report-content {
  font-family: Arial, sans-serif;
  max-width: 100%;
}

.report-content table {
  width: 100%;
  border-collapse: collapse;
}

.report-content th,
.report-content td {
  padding: 10px;
  border: 1px solid #dddddd;
  text-align: left;
}

.report-content th {
  background-color: #f2f2f2;
}

.report-content tr:nth-child(even) {
  background-color: #f9f9f9;
}

.report-content tr:hover {
  background-color: #f2f2f2;
}
</style>
