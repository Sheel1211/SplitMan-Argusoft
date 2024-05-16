<template>
  <div>
    <!-- Button to trigger report download -->
    <!-- <v-btn @click="downloadReport">Download Report</v-btn> -->
    <!-- <v-icon @click="downloadReport">mdi-download</v-icon> -->
    <!-- Button to trigger report download -->
    <a :href="pdfUrl" download="expense_report.pdf">
      <v-icon @click="downloadReport">mdi-download</v-icon>
    </a>
    <div style="display: none;">
   
      <div id="content">
        <!-- <img src="../assets/SplitBill.jpeg" class="logo"> -->
        <div style="transform: rotate(180deg);" class="wave">
      
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
  <path fill="rgb(155, 105, 212)" fill-opacity="1" d="M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,74.7C672,75,768,117,864,133.3C960,149,1056,139,1152,133.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
</svg>
</div>

        <h1>Report for Expense</h1>
        <table>
          <tbody>
            <tr>
              <th>Expense Name</th>
              <td>{{ filteredExpense.expense_name }}</td>
            </tr>
            <tr>
              <th>Total Amount</th>
              <td>{{ filteredExpense.total_amount }}</td>
            </tr>
            <tr>
              <th>Split Type</th>
              <td>{{ filteredExpense.split_type }}</td>
            </tr>
            <tr>
              <th>Debt Amount</th>
              <td>{{ filteredExpense.deb_amount }}</td>
            </tr>
            <tr>
              <th>Time Created</th>
              <td>{{ formattedTimeCreated }}</td>
            </tr>
            <tr>
              <th>Date Created</th>
              <td>{{ formattedDate }}</td>
            </tr>
          </tbody>
        </table>
         
      </div>
</div>

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
      console.log("Downloading report..."); // console.log("expenses ",this.expenses) // 

      var element=document.getElementById('content');
      html2pdf().from(element).save("expenses_report.pdf");
    },
   
  },
  computed:{
    filteredExpense() {
    return this.expenses.find(expense => expense.e_id === this.expense_id) || {};
  },
  formattedDate() {
    const dateObj = new Date(this.filteredExpense.time_created);
    return `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`;
  },
  formattedTimeCreated() {
    const dateObj = new Date(this.filteredExpense.time_created);
    return dateObj.toLocaleTimeString();
  },
  }
};
</script>

<style scoped>

.logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: auto;
}

#content {
  font-family: Arial, sans-serif;
  max-width: 100%;
  padding-top: 20px;
}

h1 {
  text-align: center;
  color: rgb(155 105 212);
  padding: 20px;
  margin:0px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 15px; /* Adjust this value to control the space between cells */
}

th, td {
  padding: 10px;

  border: 1px solid #dddddd;
  text-align: left;
}

th {
  background-color: rgb(248, 242, 255);
}
.wave{
 
  margin-top: -80px; /* Adjust this value as needed */
}

</style>
