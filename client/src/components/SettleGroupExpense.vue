<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" variant="outlined" @click="prefillExpense()">
        Settle
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Settlement</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field disabled v-model="expense_name" label="Expense Name" required></v-text-field>
          <v-text-field disabled v-model="total_amount" label="Expense Amount" required></v-text-field>

          <v-select disabled v-model="payer_id" :items="final_participants" label="Payer Name" required
            @click="searchParticipants"></v-select>

          <v-col cols="12">
            <h3>Participants for Settlement</h3>
            <v-row v-for="item in this.settlementData" :key="item.participants_id">
              <v-col cols="4">
                <span>{{ item.debtor_name }}</span>
              </v-col>
              <v-col cols="4">
                <span>{{ item.amount }}</span>
              </v-col>
              <v-col cols="4">
                <v-btn v-if="!item.is_settled" v-bind="activatorProps" variant="outlined"
                  @click="settleOneExpense(item.participants_id)">Settle</v-btn>
                <v-btn v-else v-bind="activatorProps" variant="outlined" disabled>Settled</v-btn>
              </v-col>
            </v-row>
          </v-col>

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="settleAllExpense">Settle All</v-btn>
        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "../../node_modules/vue3-toastify/dist/index.css";

export default {
  name: "UpdateExpenseForm",
  props: ["windowWidth", "expense_id"],
  data() {
    return {
      dialog: false,
      selectedParticipants: [],
      participants: [],
      splitTypes: ["Equal", "Percentage"],
      participant_percentage: [],
      selectedParticipantsWithAmount: [],
      selectedParticipantsWithPercent: [],
      expense: [],
      expense_name: "",
      total_amount: "",
      payer_id: null,
      split_type: "",
      bill_receipt: null,
      expense_description: "",
      group_id: null,
      totalAmountofParticipants: null,
      settlementData: null,

    };
  },
  watch: {
    participant_percentages: {
      handler(newVal) {
      },
      deep: true,
    },
    expense(newValue, oldValue) {
      this.expense_name = newValue[0].expense_name;
      this.total_amount = newValue[0].total_amount;
      this.expense_description = newValue[0].expense_description;
      this.bill_receipt = newValue[0].bill_receipt;
      this.split_type = newValue[0].split_type;
      console.log("The expense changed from", oldValue, "to", newValue);
      this.selectedParticipants = [
        ...newValue.map((item) => item.id),
      ];
      this.payer_id = newValue[0].payer_id;
    },
    selectedParticipantsWithPercent: {
      deep: true,
      handler(newValue) {
        for (const participantId in newValue) {
          newValue[participantId] = parseInt(newValue[participantId]);
        }
      }
    }
  },
  created() {
    const id = parseInt(this.$route.params.id);
    this.group_id = id;

    window.addEventListener("resize", this.handleWindowResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {

    async settleOneExpense(participants_id) {
      await axios
        .post(`http://localhost:3000/api/expenses/settleOneParticipant/${participants_id}`)
        .then((response) => {
          this.getParticipantData();
          this.$emit('updateExpenseData')
        })
        .catch((error) => {
          console.error("Error fetching participants:", error);
        });
    },
    async settleAllExpense() {
      const id = this.expense_id;
      console.log(id);
      await axios
        .post(`http://localhost:3000/api/expenses/settleAllParticipant/${id}`)
        .then((response) => {
          this.getParticipantData();
          console.log(response.data);
          this.$emit('updateExpenseData')
        })
        .catch((error) => {
          console.error("Error fetching participants:", error);
        });
    },

    async settleExpense() {
      if (this.$refs.form.validate()) {

        console.log(
          "participant with amount ",
          this.selectedParticipantsWithAmount
        );

        const formData = new FormData();
        formData.append("expense_name", this.expense_name);
        formData.append("expense_amount", this.total_amount);
        formData.append("expense_description", this.expense_description);
        formData.append("ExpenseImage", this.bill_receipt);
        formData.append("payer_id", this.payer_id);
        formData.append("split_type", this.split_type);
        formData.append("group_id", this.group_id);
        formData.append(
          "recipients",
          JSON.stringify(this.selectedParticipantsWithAmount)
        );
        formData.append("expense_id", this.expense_id);

        const participants = [];

        await axios
          .put("http://localhost:3000/api/expenses/update", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            // Group created successfully
            this.$emit("expenseCreated", response.data);
            this.closeDialog();
            this.$emit("successToast");
            // Reset the form
            this.expense_name = "";
            this.total_amount = "";
            this.expense_description = "";
            this.bill_receipt = null;
            this.payer_id = null;
            this.selectedParticipants = [];
            this.selectedParticipantsWithAmount = [];
            this.split_type = null;
            this.group_id = null;
            this.participants = [];
            this.expense_id = null;
          })
          .catch((error) => {
            console.error("Error creating expense:", error);
          });
      }
    },

    async prefillExpense() {
      await axios
        .get(
          `http://localhost:3000/api/expenses/prefillExpenses/${this.expense_id}`
        )
        .then((response) => {
          this.expense = response.data.Expense;
          console.log("expense info ", this.expense);
        })
        .catch((error) => {
          console.log(error);
        });

      this.getParticipantData()


      await this.searchParticipants();

    },

    async getParticipantData() {
      await axios
        .get(
          `http://localhost:3000/api/expenses/getParticipantData/${this.expense_id}`
        )
        .then((response) => {
          this.settlementData = response.data.ExpenseId;

        })
        .catch((error) => {
          console.log(error);
        });
    },

    async searchParticipants() {
      {
        const id = parseInt(this.$route.params.id);
        this.group_Id = id;

        await axios
          .get(`http://localhost:3000/api/groups/groupMembers/${id}`)
          .then((response) => {
            this.participants = response.data.members;

            this.final_participants = this.participants.map((data) => ({
              title: data.username,
              value: data.id,
            }));
            this.selectedParticipants = this.expense.map(item => (item.debtor_id))



            this.totalAmountofParticipants = this.expense.reduce((total, item) => total + item.amount, 0);
            console.log("totalAmountofParticipants", this.totalAmountofParticipants)

            if (this.totalAmountofParticipants < this.total_amount) {
              this.selectedParticipants.push(this.expense[0].payer_id);
            }

          })
          .catch((error) => {
            console.error("Error fetching participants:", error);
          });
      }
    },



    closeDialog() {
      this.dialog = false;
    },
    getParticipantName(participantId) {
      const participant = this.final_participants.find(
        (participant) => participant.value === participantId
      );
      return participant ? participant.title : "Unknown";
    },
  },

  computed: {
    final_participants() {
      return this.participants.map((data) => ({
        title: data.username,
        value: data.id,
      }));
    },
    filteredParticipants() {
      return this.selectedParticipants.filter(id => id !== this.payer_id);
    }
  },

};
</script>

<style scoped>
.add-expense-btn {
  margin-right: 2px;
  /* Adjust margin as needed */
  margin-left: 10px;
}

.profile-avatar {
  margin-right: 10px;
  /* Adjust margin as needed */
  margin-left: 16px;
  border: 3px solid #673ab7;
}
</style>