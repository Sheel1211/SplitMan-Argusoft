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
      div.innerHTML = `
        <table>
          
          
            <tbody>
              <tr>
        <th style="padding-right: 20px;">Expense Name</th>
        <td>${filteredExpense.expense_name}</td>
      </tr>
      <tr>
        <th style="padding-right: 20px;">Total Amount</th>
        <td>${filteredExpense.total_amount}</td>
      </tr>
      <tr>
        <th style="padding-right: 20px;">Split Type</th>
        <td>${filteredExpense.split_type}</td>
      </tr>
      <tr>
        <th style="padding-right: 20px;">Debt Amount</th>
        <td>${filteredExpense.deb_amount}</td>
      </tr>
      <tr>
        <th style="padding-right: 20px;">Time Created</th>
        <td> ${timeCreated.toLocaleTimeString()}</td>
      </tr>
      <tr>
        <th style="padding-right: 20px;">Date Created</th>
        <td>${formattedDate}</td>
      </tr>
          </tbody>
        </table>
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
</style>
