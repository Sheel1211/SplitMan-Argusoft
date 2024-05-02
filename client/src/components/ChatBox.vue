<template>
  <div class="chatList" v-if="selectedChat">
    <!-- top bar in personal chat -->
    <div class="chatEntry">
      <!-- <div class="chatEntry"> -->
      <div class="contactDetails">
        <div class="frameParent">
          <!-- image and icon -->
          <div class="WalletParent">
            <img
              class="NeedAWallet"
              loading="lazy"
              alt=""
              :src="selectedChat.friend_photo"
            />
            <div class="frameWrapper">
              <!-- <h1 class="anil">Anil</h1>         -->
              <h1 class="anil">{{ selectedChat.friend_name }}</h1>
            </div>
          </div>
          <div class="moreOptions">
            <!-- <img loading="lazy" alt="" src="/Friends/bithreedotsvertical.svg" /> -->
            <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
    
    </template>
   

    <v-list>
      <v-list-item v-for="(item, i) in items" :key="i">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
          </div>
          
        </div>
        <hr />
      </div>
    </div>

    <!-- chat section -->
    <div class="chat-container">
      <!-- <div class="message-container"> 
      <div class="message sender-message"> 
        Hello there!
        </div>
        <div class="message receiver-message">
          Hi How are you doing? 
      </div>
      <div class="message sender-message">
          I am fine How are you?
      </div>
    </div> -->
    <div class="message-container">
      <div
        v-for="(content, index) in messages"
        :key="index"
        :class="[
          'message',
          content.s_id === content.c_id  ? 'sender-message' : 'receiver-message',
        ]"
      >
        {{ content.message }}
      </div>
    </div>
    </div>

    <!-- input contaienr -->
    <div class="message placeholder">
      <input type="text" placeholder="Type your message..." />
      <!-- <textarea
      class="inputTextArea"
      placeholder="Type your message here..."
    ></textarea> -->
      <button>Send</button>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatBox",
  data() {

    return {
      messages: [],
      items: [
        { title: 'View Expense' },
        { title: 'Add Expense' },
      ],
    };

  },
  props: {
    selectedChat: {
      type: Object,
      required: true,
    },
    currentUserID: {
      type: Number,
      required: true,
    }
  },
  // mounted() {
  //   console.log("selectedChat:", this.selectedChat);
  // }

  mounted() {
    this.loadMessages();
  },
  methods: {
    async loadMessages() {
      try {
        const response = await fetch("/data/data.JSON");
        // console.log("Response:", response);
        const data = await response.json();
        this.messages = data;
        // console.log("Data:", data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    },
 
  },
});
</script>
<style>
/* main container */
.chatList {
  background-color: aquamarine;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  border-radius: var(--br-6xl);
  box-shadow: 0px 4px 5px 2px rgba(121, 197, 239, 0.38);
  background-color: var(--color-white);
  box-sizing: border-box;
  /* height:auto; */
  padding: var(--padding-10xl) var(--padding-4xl) var(--padding-11xl)
    var(--padding-15xl);
  height: 744px;
}
/* profile and top  bar */
.chatEntry {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0px 0px 0px var(--padding-7xs);
  box-sizing: border-box;
  max-width: 100%;
  margin: 0%;
  /* background-color: aqua; */
}
.contactDetails {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--gap-xl-5);
  max-width: 100%;
}

.frameParent {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  max-width: 100%;
  gap: var(--gap-xl);
}
.WalletParent {
  width: 447px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  gap: var(--gap-6xl);
  max-width: 100%;
}
/* .bithreeDotsVerticalIcon {
    width: 40px;
    height: 40px;
    position: relative;
    z-index: 3;
  } */
.NeedAWallet {
  height: 59px;
  width: 59px;
  position: relative;
  border-radius: 50%;
  object-fit: cover;
  z-index: 3;
  /* border-radius: 50%; 
  width: 40px; 
  height: 40px;  */
}
.anil {
  top: -11px;
  margin: 0;
  width: 230px;
  position: relative;
  font-size: var(--font-size-1xl);
  letter-spacing: 0.05em;
  font-weight: 600;
  font-family: var(--font-roboto);
  color: var(--color-darkslategray);
  text-align: left;
  display: inline-block;
  z-index: 3;
}

.frameWrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px 0px var(--padding-9xs);
  box-sizing: border-box;
  min-width: 226px;
  max-width: 100%;
}
.moreOptions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0px 0px var(--padding-mid);
}

/* chat window */
.chat-container {
  max-width: 1890px;
  margin: 50px 1px;
  background-color: #fff;
  overflow: hidden;
  /* width: calc(100% - var(--padding-7xs) * 2); */
}

.message-container {
  display: flex;
  flex-direction: column;
}

.message {
  flex: 1;
  border-radius: var(--br-6xl);
  display: flex;
  word-wrap: break-word;
  align-items: center;
  padding: var(--padding-sm) var(--padding-9xl);
  margin: 10px;
  max-width: 70%;
}

.sender-message {
  background-color: var(--color-gainsboro);
  align-self: flex-start;
}
.receiver-message {
  background-color: var(--color-blue);
  color: #fff;
  align-self: flex-end;
}

/* input container */
.placeholder {
  max-width: 1890px;
  align-items: flex-end;
}
.message input {
  width: calc(100% - 9px);
  /* padding: 8px;  */
  margin: 3px;
  border: 1px solid #ddd;
  border-radius: var(--br-6xl);
  background-color: var(--color-aliceblue);
  padding: var(--padding-lgi) var(--padding-4xl) var(--padding-mid)
    var(--padding-3xl);
  box-sizing: border-box;
}

.message button {
  padding: 12px;
  margin: 10px;
  background-color: var(--color-blue);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
