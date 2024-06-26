<template>
  <v-app class="appbar">
    <AppBar
      :search="search"
      :isCreateGroupButtonHidden="isCreateGroupButtonHidden"
      :isMenuHidden="isMenuHidden"
      :username="username"
      :windowWidth="windowWidth"
      :drawer="drawer"
      @toggleDrawer="toggleDrawer"
      @successToast="successToast()"
      @errorToast="errorToast()"
    />
    <NavBar :drawer="drawer" :key="drawer" />
    <v-main>
      <v-container fluid>
        <v-row justify="justified">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card
              class="chat-box mx-auto my-8"
              elevation="16"
              max-width="1000"
            >
              <!-- Group name and menu bar -->

              <v-toolbar color="blue" class="d-flex justify-space-between">
                <v-avatar class="profile-avatar">
                  <img :src="groupDetails.group_icon" alt="Profile Image" />
                </v-avatar>

                <v-toolbar-title class="text-h6">{{
                  groupDetails.group_name
                }}</v-toolbar-title>

                <!-- <v-btn variant="outlined" class="menu-buttons"  @click="addExpense">Add Expense</v-btn> -->
                <!-- <v-btn variant="outlined" class="menu-buttons" @click="openAddExpenseDialog">Add Expense</v-btn> -->
                <AddExpenseForm
                  :group_id="group_id"
                  @successToast="successToast(`Expense Created Successfully!`)"
                />

                <!-- <template  v-slot:append>
                          <v-btn icon="mdi-dots-vertical"></v-btn>    
                      </template> -->

                <v-menu transition="scale-transition">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-dots-vertical"> </v-btn>
                  </template>

                  <v-list>
                    <!-- <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :value="i"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item> -->
                    <v-list-item v-if="loggedUserData.role <= 2">
                      <EditGroup
                        :group_id="group_id"
                        @successToast="
                          successToast(`Group Updated Successfully!!`)
                        "
                      />
                    </v-list-item>
                    <v-list-item>
                      <ViewExpense :group_id="group_id"/>
                    </v-list-item>
                    <v-list-item>
                      <GroupDetails :group_id="group_id" />
                    </v-list-item>
                    <v-list-item>
                      <GroupBalanceDetails :group_id="group_id" />
                    </v-list-item>
                    <v-list-item v-if="loggedUserData.role <= 2">
                      <AddMembers :group_id="group_id" />
                    </v-list-item>
                    <v-list-item class="cursor-pointer d-flex align-center justify-center font-weight-medium">
                      <v-list-item-content @click="exitGroup()"
                        >Exit Group</v-list-item-content
                      >
                    </v-list-item>
                    <v-list-item
                    class="cursor-pointer d-flex align-center justify-center font-weight-medium"
                      v-if="groupDetails.creator_id == userDetails.id"
                      @click="deleteGroup()"
                    >
                      <v-list-item-content>Delete Group</v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-toolbar>

              <!-- Chat messages -->
              <v-card-text class="messages d-flex flex-column">
                <div v-for="(message, index) in messages" :key="index">
                  <div class="message d-flex align-center">
                    <div class="username text-subtitle-1 font-weight-bold">
                      {{ message.sender }}
                    </div>
                    <v-chip
                      class="message text-body-1"
                      :class="{
                        'sender-chip': message.sender === 'me',
                        'recipient-chip': message.sender !== 'me',
                      }"
                    >
                      {{ message.text }}
                    </v-chip>
                  </div>
                </div>
              </v-card-text>

              <!-- Input field and send button -->
              <v-card-actions class="pa-2">
                <v-text-field
                  class="message-area"
                  v-model="newMessage"
                  label="Type your message"
                  outlined
                ></v-text-field>
                <v-btn class="message-area" @click="sendMessage" color="primary"
                  >Send</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./NavBar.vue";
import AppBar from "./AppBar.vue";
import AddMembers from "./AddMembers.vue";
import GroupBalanceDetails from "./GroupBalanceDetails.vue";
import EditGroup from "./EditGroup.vue";
import GroupDetails from "./GroupDetails.vue";
import ViewExpense from "./ViewExpense.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import AddExpenseForm from "./AddExpenseForm.vue";
import { toast } from "vue3-toastify";
import "../../node_modules/vue3-toastify/dist/index.css";

export default {
  name: "GroupChat",
  components: {
    NavBar,
    AppBar,
    AddMembers,
    GroupBalanceDetails,
    AddExpenseForm,
    EditGroup,
    GroupDetails,
    ViewExpense,
  },
  data() {
    return {
      groupName: "GroupName",
      group_id: "",
      groupDetails: "",
      router: useRouter(),
      messages: [],
      newMessage: "",
      drawer: false,
      search: "",
      username: "",
      participants: [],
      groups: [],
      windowWidth: window.innerWidth,
      userDetails: JSON.parse(localStorage.getItem("user-info")),
      loggedUserData: "",
    };
  },
  computed: {
    isCreateGroupButtonHidden() {
      return this.windowWidth <= 800; // Adjust breakpoint as needed
    },
    isTextVerticalAlign() {
      return this.windowWidth <= 800; // Adjust breakpoint as needed
    },
    isMenuHidden() {
      return this.windowWidth <= 426; // Adjust breakpoint as needed
    },
  },
  async created() {
    // Fetch group information from backend API
    //   this.fetchGroups();
    //   this.fetchParticipants();

    this.username = this.userDetails.name;

    // Keep nav bar open on mounting for larger screens
    if (this.windowWidth > 960) {
      this.drawer = true;
    }

    const id = parseInt(this.$route.params.id);

    this.group_id = id;

    console.log(id);

    const response = await axios.get(
      `http://localhost:3000/api/groups/groupMembersAndDetails/${id}`
    );

    this.groupDetails = response.data.groupDetails[0];

    this.loggedUserData = response.data.groupDetails.find((item) => {
      return item.user_id == this.userDetails.id;
    });
    // Listen for window resize event
    window.addEventListener("resize", this.handleWindowResize);
  },
  destroyed() {
    // Remove window resize event listener to prevent memory leaks
    window.removeEventListener("resize", this.handleWindowResize);
  },
  methods: {
    async exitGroup() {
      await axios
        .post(`http://localhost:3000/api/groups/removeMemberGroup`, {
          user_id: this.userDetails.id,
          group_id: this.group_id,
        })
        .then((response) => {
          console.log(response);
          this.$router.push("/group-list");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async deleteGroup() {
      await axios
        .delete(`http://localhost:3000/api/groups/delete/${this.group_id}`)
        .then((response) => {
          console.log(response);
          this.successToast("Group Deleted Successfully !");

          this.$router.push("/group-list");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({ text: this.newMessage, sender: "me" });
        // Simulate a reply from the other user (optional)
        setTimeout(() => {
          this.messages.push({
            text: "Hello, how can I help you?",
            sender: "Other User",
          });
        }, 1000);
        console.log(this.newMessage);
        await axios.post(`http://localhost:3000/api/groups/addMessageGroup`, {
          group_id: this.group_id,
          sender_id: this.userDetails.id,
          message: this.newMessage,
        });
        this.newMessage = "";
      }
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
      console.log("Drawer state:", this.drawer);
    },
    handleWindowResize() {
      // Update window width on resize
      this.windowWidth = window.innerWidth;
    },
    addExpense() {
      // Implement the functionality to add expenses here
      console.log("Expense added!");
      this.$refs.expenseFormDialog.open();
      // You can also trigger a dialog or perform any other action here
    },
    successToast(message) {
      toast.success(message, {
        autoClose: 2000,
      });
    },

    errorToast(message) {
      toast.error(message, {
        autoClose: 2000,
      });
    },
    // openAddExpenseDialog() {
    //   // Emit an event to open the dialog for adding expenses
    //   this.$refs.addExpenseForm.dialog = true;
    // },
  },
};
</script>

<style scoped>
.chat-box {
  overflow-y: auto; /* Enable vertical scrolling */
  /* Width of chat box */
  /* width: 100%; */

  @media (max-width: 896) {
    width: 200%;
  }
}

.messages {
  margin-top: 120%; /* Add space between group name and messages */
}

/* .message-field {
    bottom: ;
} */

/* .message {
    margin-bottom: 1px;
} */

.sender-chip {
  background-color: #d2f1b9; /* Light green for sender messages */
  text-align: right;
  /* margin-right: 100px; */
}

.recipient-chip {
  background-color: #e3cece; /* Light gray for recipient messages */
  text-align: left;
}

.username {
  font-size: 12px; /* Small size for the username */
  font-weight: bold; /* Bold font for the username */
}

.profile-avatar {
  margin-right: 2px; /* Adjust margin as needed */
  margin-left: 10px;
  /* border: 3px solid rgb(29, 7, 109); */
}

.menu-buttons {
  margin-right: 2px; /* Adjust margin as needed */
  margin-left: 10px;
}
</style>
