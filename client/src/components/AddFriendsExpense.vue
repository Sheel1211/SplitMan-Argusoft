<template>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card prepend-icon="mdi-wallet" title="Add Expense">
        
        <v-card-text>
            <v-text-field
            label="Expense Name*"
            v-model="expense.expense_name"
            required
          ></v-text-field>
          <v-text-field
            label="Total Amount*"
            type="number"
            v-model="expense.total_amount"
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
            required
          ></v-file-input>
          <v-select
            label="Split Type"
            v-model="expense.split_type"
            :items="['Equal', 'By Percentage']"
            required
            @change="handleSplitTypeChange"
          ></v-select>

          <div v-if="expense.split_type === 'By Percentage'">
            <v-text-field
              label="Your Percentage"
              v-model="splitData.yourPercentage"
              type="number"
              suffix="%"
              min="0"
              max="100"
              step="0.01"
            ></v-text-field>
            <v-text-field
              label="Friend's Percentage"
              v-model="splitData.friendPercentage"
              type="number"
              suffix="%"
              step="0.1"
              min="0"
              max="100"
            ></v-text-field>
          </div>
      
          <small class="text-caption text-medium-emphasis">
            *indicates required field
        </small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error"  @click="close">Discard</v-btn>
          <v-btn color="primary"  @click="submit">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name:"AddFriendsExpense",
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
        expense_name: '',
        total_amount: null,
        expense_description: '',
        payer_friend_id: null,
        split_type: '',
        bill_receipt: null,
        conversation_id: ''
      };
    },
    defaultSplitData() {
      return {
        yourPercentage: null,
        friendPercentage: null,
        yourShares: null,
        friendShares: null,
        yourAmount: null,
        friendAmount: null
      };
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.expense = this.defaultExpense();  // Reset expense data
      this.splitData = this.defaultSplitData();  // Reset split data
    },
    submit() {
      console.log(this.expense, this.splitData);
      this.close();
    },
    handleSplitTypeChange() {
      this.splitData = this.defaultSplitData();  // Reset split data on change
    }
  }
  }
  </script>  