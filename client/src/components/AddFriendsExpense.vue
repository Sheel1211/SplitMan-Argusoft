<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        class="details-btn"
        variant="text"
        @click="open"
      >
        Add Expense
      </v-btn>
    </template>

    <v-card prepend-icon="mdi-wallet" title="Add Expense">
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Expense Name*"
            v-model="expense.expense_name"
            :rules="[(v) => !!v || 'Name is required']"
            required
          ></v-text-field>
          <v-text-field
            label="Expense Amount*"
            type="number"
            v-model="expense.total_amount"
            :rules="[(v) => !!v || 'Amount is required']"
            required
          ></v-text-field>
          <v-textarea
            label="Expense Description"
            v-model="expense.expense_description"
            rows="2"
          ></v-textarea>
          <v-file-input
            label="Bill Receipt*"
            v-model="expense.bill_receipt"
            prepend-icon="mdi-paperclip"
            accept="image/*"
            :rules="[(v) => !!v || 'Receipt is required']"
            required
          ></v-file-input>
          <v-select
            label="Split Type"
            v-model="expense.split_type"
            :items="['Equal', 'Percentage']"
            :rules="[(v) => !!v || 'Split type is required']"
            required
          ></v-select>

          <div v-if="expense.split_type === 'Percentage'">
            <v-text-field
              label="Your Percentage"
              v-model="splitData.percentages[payer_friend_id]"
              type="number"
              suffix="%"
              min="0"
              max="100"
              step="0.1"
              :rules="[
                (v) =>
                  (v >= 0 && v <= 100) ||
                  'Percentage must be between 0 and 100',
              ]"
            ></v-text-field>
            <v-text-field
              label="Friend's Percentage"
              v-model="splitData.percentages[conversation_id]"
              type="number"
              suffix="%"
              step="0.1"
              min="0"
              max="100"
              :rules="[
                (v) =>
                  (v >= 0 && v <= 100) ||
                  'Percentage must be between 0 and 100',
              ]"
            ></v-text-field>
          </div>

          <small class="text-caption text-medium-emphasis">
            *indicates required field
          </small>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addExpense">Add</v-btn>
        <v-btn color="error" @click="close">Discard</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
  <script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "../../node_modules/vue3-toastify/dist/index.css";
export default {
  name: "AddFriendsExpense",
  props: {
    conversation_id: {
      type: String,
      required: true,
    },
    payer_friend_id: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      dialog: false,
      expense: this.defaultExpense(),
      splitData: this.defaultSplitData(),
    };
  },
  methods: {
    defaultExpense() {
      return {
        expense_name: "",
        total_amount: null,
        expense_description: "",
        payer_friend_id: this.payer_friend_id,
        split_type: "",
        bill_receipt: null,
        conversation_id: this.conversation_id,
      };
    },
    defaultSplitData() {
      return {
        percentages: {},
        shares: {},
      };
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.expense = this.defaultExpense(); // Reset the form data
      this.splitData = this.defaultSplitData(); // Reset split part data
    },
    async addExpense() {
      if (!this.$refs.form.validate()) {
        toast.error("Please check your inputs and try again.");
        return;
      }

      // Calculate splits based on the split type
      if (this.expense.split_type === "Percentage") {
      const payerPercentage = parseFloat(this.splitData.percentages[this.payer_friend_id]);
      const friendPercentage = parseFloat(this.splitData.percentages[this.conversation_id]);
      const totalPercentage = payerPercentage + friendPercentage;
      
      console.log('Payer Percentage:', payerPercentage);
      console.log('Friend Percentage:', friendPercentage);
      console.log('Total Percentage:', totalPercentage);

      if (totalPercentage !== 100) {
        toast.error("Total percentages must equal 100%");
        return;
      }

      
    }  else if (this.expense.split_type === "Equal") {
        const equalShare = this.expense.total_amount / 2; 
        
        this.splitData.shares = {
          [this.payer_friend_id]: equalShare,
          [this.conversation_id]: equalShare,
        };
      }

      const formData = new FormData();
      formData.append("expense_name", this.expense.expense_name);
      formData.append("total_amount", this.expense.total_amount);
      formData.append("expense_description", this.expense.expense_description);
      formData.append("payer_friend_id", this.expense.payer_friend_id);
      formData.append("split_type", this.expense.split_type);
      formData.append("ExpenseImage", this.expense.bill_receipt);
      formData.append("conversation_id", this.expense.conversation_id);
      if (this.expense.split_type === "Equal"){formData.append("deb_amount", this.splitData.shares[this.expense.conversation_id]);}

      if (this.expense.split_type === "Percentage") {
        formData.append("split_data", JSON.stringify({
          [this.payer_friend_id]: this.splitData.percentages[this.payer_friend_id],
          [this.conversation_id]: this.splitData.percentages[this.conversation_id]
        }));
      }

    //   formData.forEach((value, key) => {
    //   console.log(key, value);
    // });


      try {
        const response = await axios.post(
          "http://localhost:3000/api/expenses/createFriendExpense",
          formData
        );

        toast.success("Expense added successfully!");
        this.$emit("expense-added", response.data);
        this.close();
      } catch (error) {
        toast.error("Failed to add expense: " + error.message);
        console.error("Failed to add expense:", error);
      }
    },
  },
};
</script>  
  <style scoped>
.details-btn {
  text-transform: none;
}

.details-btn::first-letter {
  text-transform: capitalize;
}
</style>
