<template>
  <div>
    <!-- Button to trigger report download -->
    <!-- <v-btn @click="downloadReport">Download Report</v-btn> -->
    <!-- <v-icon @click="downloadReport">mdi-download</v-icon> -->
    <!-- Button to trigger report download -->
    <a :href="pdfUrl" download="expense_report.pdf">
      <v-icon @click="downloadReport">mdi-download</v-icon>
    </a>
    <div style="display: none">
      <div id="content">
        <!-- <img src="../assets/SplitBill.jpeg" class="logo"> -->
        <div style="transform: rotate(180deg)" class="wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="rgb(155, 105, 212)"
              fill-opacity="1"
              d="M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,74.7C672,75,768,117,864,133.3C960,149,1056,139,1152,133.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <h1>Report for Expense</h1>
        <div v-for="expense in expenses" :key="expense.e_id">
           <!-- Insert page break before each expense except the first one -->
          
          <table>
            <tbody>
              <!-- Row for Expense ID -->
              <tr>
                <th>Expense ID</th>
                <td>{{ expense.e_id }}</td>
              </tr>
              <!-- Row for Expense Name -->
              <tr>
                <th>Expense Name</th>
                <td>{{ expense.expense_name }}</td>
              </tr>
              <!-- Row for Total Amount -->
              <tr>
                <th>Total Amount</th>
                <td>{{ expense.total_amount }}</td>
              </tr>
              <!-- Row for Split Type -->
              <tr>
                <th>Split Type</th>
                <td>{{ expense.split_type }}</td>
              </tr>
              <!-- Row for Debt Amount -->
              <tr>
                <th>Debt Amount</th>
                <td>{{ expense.deb_amount }}</td>
              </tr>
              <!-- Row for Time Created -->
              <!-- <tr>
                <th>Time Created</th>
                <td>{{ formattedTimeCreated(expense.time_created) }}</td>
              </tr> -->
              <!-- Row for Date Created -->
              <!-- <tr>
                <th>Date Created</th>
                <td>{{ formattedDate(expense.time_created) }}</td>
              </tr> -->
              <!-- Row for Settled -->
              <tr>
                <th>Settled</th>
                <td>{{ expense.is_settled ? "Yes" : "No" }}</td>
              </tr>
              <!-- Row for Bill Receipt -->
              <tr>
                <th>Bill Receipt</th>
                <td><img src="../assets/bill.jpg" class="bill" /></td>
              </tr>
            </tbody>
          </table>
          <div class="html2pdf__page-break"></div>
        </div>
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

      var element = document.getElementById("content");
      html2pdf().from(element).save("expenses_report.pdf");
    },
  },
  computed: {
    // filteredExpense() {
    //   return (
    //     this.expenses.find((expense) => expense.e_id === this.expense_id) || {}
    //   );
    // },
    formattedDate() {
      const dateObj = new Date(this.expenses.time_created);
      return `${dateObj.getDate()} ${dateObj.toLocaleString("default", {
        month: "short",
      })} ${dateObj.getFullYear()}`;
    },
    formattedTimeCreated(timeCreated) {
      const dateObj = new Date(timeCreated);
      return dateObj.toLocaleTimeString();
    },
  },
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
  margin: -43px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 15px; /* Adjust this value to control the space between cells */
  margin-top:51px;
}

th,
td {
  padding: 10px;

  border: 1px solid #dddddd;
  text-align: left;
}

th {
  background-color: rgb(248, 242, 255);
}
.wave {
  margin-top: -80px; /* Adjust this value as needed */
}
.bill{
  width: 340px;
  height: 340px;
}
</style>
