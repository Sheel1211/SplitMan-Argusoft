<template>
  <v-dialog v-model="dialog" max-width="800px" transition="dialog-bottom-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" class="details-btn" variant="text" @click="viewExpense">
        View Expense
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2">Expenses</v-card-title>
      <v-card-text>
        <v-simple-table fixed-header max-width="700px">
          <thead>
            <tr>
              <th>Expense Name</th>
              <th>Total Amount</th>
              <th>Split Type</th>
              <th>Debt Amount</th>
              <th>Actions</th>
              <th>Settlement</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenses" :key="expense.expense_id">
              <td>{{ expense.expense_name }}</td>
              <td>{{ expense.total_amount }}</td>
              <td>{{ expense.split_type }}</td>
              <td>{{ expense.deb_amount }}</td>
              <td>
                <UpdateExpenseForm :expense_id="expense.e_id" />
              </td>
              <td> <v-btn v-if="!expense.is_settled" v-bind="activatorProps" variant="outlined"
                  @click="settleOneExpense(expense.e_id)">Settle</v-btn>
                <v-btn v-else v-bind="activatorProps" variant="outlined" disabled>Settled</v-btn>
              </td>

            </tr>
          </tbody>
        </v-simple-table>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import UpdateExpenseForm from './UpdateExpenseForm.vue';
export default {
  components: {
    UpdateExpenseForm,
    // SettleGroupExpense,
  },
  name: "ViewExpense",
  props: ["conversation_id"],
  data() {
    return {
      dialog: false,
      expenses: []
    };
  },
  methods: {
    async viewExpense() {
      // console.log("Conversation ID:", this.conversation_id);
      await axios
        .get(`http://localhost:3000/api/expenses/fetchExpenseFrdConversation/${this.conversation_id}`)
        .then((response) => {
          this.expenses = response.data.ExpenseId;
          // console.log("expense : ",this.expenses)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async settleOneExpense(id) {
      console.log("expense ID:", id);
      await axios
        .post(`http://localhost:3000/api/expenses/settleFrdExpense/${id}`)
        .then((response) => {
          const data = response.data;
          console.log(data)
          this.viewExpense()
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
}
</script>

<style scoped>
thead tr {
  background-color: #1976d2;
  color: white;
  font-size: 1.1rem;
}

tbody tr {
  background-color: #e3f2fd;
  color: #212121;
  font-size: 1rem;
  border-bottom: 1px solid #b0bec5;
}

th {
  padding: 8px 16px;
}

td {
  padding: 8px 16px;
  text-align: center;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
}

.v-card-title {
  font-weight: bold;
  color: #1976d2;
  padding-bottom: 0;
}

.v-btn {
  min-width: 0;
}

@media (max-width: 600px) {
  .v-simple-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  thead tr th,
  tbody tr td {
    white-space: nowrap;
  }

  tbody tr td {
    min-width: 100px;
  }
}

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-bottom-transition-enter,
.dialog-bottom-transition-leave-to {
  opacity: 0;
}

.v-dialog,
.v-btn {
  outline: none;
}

.details-btn {
  text-transform: none;
}

.details-btn::first-letter {
  text-transform: capitalize;
}
</style>