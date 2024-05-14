<template>
  <v-app class="appbar">
    <AppBar
      :search="search"
      :isMenuHidden="isMenuHidden"
      :username="username"
      :windowWidth="windowWidth"
      :drawer="drawer"
      @toggleDrawer="toggleDrawer()"
      @groupCreated="fetchGroups()"
      @successToast="successToast()"
      @errorToast="errorToast()"
    />
    <NavBar :drawer="drawer" />
    <v-main>
      <v-container>
        <h1>Update Profile</h1>
        <!-- Card for updating image -->
        <v-card elevation="5" class="mb-4">
          <v-card-title>Profile Image</v-card-title>
          <!-- <v-card-text>
            <v-row align="center">
              <v-col cols="12" sm="6">
                <v-file-input label="Profile Image" v-model="profileImage"></v-file-input>
              </v-col>
              <v-col cols="12" sm="6">
                <v-img :src="profileImage" max-width="100" max-height="100"></v-img>
              </v-col>
            </v-row>
          </v-card-text> -->
          <v-container class="d-flex align-center justify-center" fluid>
                <v-file-input
                  v-model="ProfileImage"
                  label="Profile Image"
                  accept="image/*"
                  required
                  class="mr-2 pr-2"
                  @change="updateImageURL"
                ></v-file-input>

                <v-img
                  :width="100"
                  :height="100"
                  aspect-ratio="1/1"
                  :src="imageURL"
                ></v-img>
              <!-- </v-container> -->
          <v-card-actions>
            <v-btn color="primary" elevation="3" @click="update('image')">Update Image</v-btn>
          </v-card-actions>
        </v-container>
        </v-card>

        <!-- Card for updating information -->
        <v-card elevation="5" class="mb-4">
          <v-card-title>Personal Information</v-card-title>
          <v-container class="d-flex align-center justify-center" fluid>
          <v-card-text>
            <v-text-field v-model="name" label="Name" outlined></v-text-field>
            <v-text-field v-model="username" label="Username" outlined></v-text-field>
            <v-text-field v-model="email" label="Email" outlined></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" elevation="3" @click="update('information')">Update Information</v-btn>
          </v-card-actions>
          </v-container>
        </v-card>

        <!-- Card for updating password -->
        <v-card elevation="5">
          <v-card-title>Password</v-card-title>
          <v-container class="d-flex align-center justify-center" fluid>
          <v-card-text>
            <v-text-field v-model="oldPassword" label="Old Password" type="password" outlined></v-text-field>
            <v-text-field v-model="newPassword" label="New Password" type="password" outlined></v-text-field>
            <v-text-field v-model="confirmPassword" label="Confirm Password" type="password" outlined></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" elevation="3" @click="update('password')">Update Password</v-btn>
          </v-card-actions>
        </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import { toast } from "vue3-toastify";
import "../../node_modules/vue3-toastify/dist/index.css";
import NavBar from "./NavBar.vue";
import AppBar from "./AppBar.vue";

export default {
  name: "UpdateProfile",
  components: {
    NavBar,
    AppBar,
  },
  data() {
    return {
      ProfileImage: null,
      name: '',
      username: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      userDetails: JSON.parse(localStorage.getItem("user-info")),
      imageURL: null,
      drawer: false,
      search: "",
      windowWidth: window.innerWidth,
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
  destroyed() {
    // Remove window resize event listener to prevent memory leaks
    window.removeEventListener("resize", this.handleWindowResize);
  },
  
  mounted() {
    this.fetchProfileData();
  },
  // watch: {
    
  //   userDetails: {
  //   handler(newValue) {
  //     this.name = newValue.name;
  //     this.username = newValue.username;
  //     this.email = newValue.email;
  //     this.profileImage = newValue.image;
  //     console.log("new details", newValue);
  //     console.log("The expense changed from", oldValue, "to", newValue);
  //   },
  //   }
  //   },
  methods: {
    fetchProfileData() {
      console.log("user details :",this.userDetails);
      this.name = this.userDetails.name;
      this.username = this.userDetails.username;
      this.email = this.userDetails.email;
      this.ProfileImage = this.userDetails.image;
      this.imageURL = this.userDetails.image;
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

    toggleDrawer() {
      this.drawer = !this.drawer;
      console.log("Drawer state:", this.drawer);
    },

    handleWindowResize() {
      // Update window width on resize
      this.windowWidth = window.innerWidth;
    },
    
    async update(data){
      if (data == "image"){
          const formData = new FormData();
          formData.append("UserImage", this.ProfileImage);

          await axios
            .put(
              `http://localhost:3000/api/user/updateImage/${this.userDetails.id}`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data"},
              }
            )
            .then((response) => {
              this.successToast("Profile Image Updated Successfully !");
              this.$emit("Image Updated", response.data);
              console.log('image:',this.ProfileImage)
              this.ProfileImage = null;
            })
            .catch((error) => {
              console.error("Error updating image:", error);
            });
        } 
      else if (data == "information"){

        await axios.put(`http://localhost:3000/api/user/updateInformation/${this.userDetails.id}`, {
          name: this.name,
          username: this.username,
          email: this.email,
        })
        .then(response => {
          this.successToast("Information Updated Successfully !");
          console.log('Information updated successfully:', response.data);
        })
        // .catch(error => {
        //   console.error('Error updating personal information:', error);
        // });
        .catch(error => {
          if (error.response) {
            // console.error('Error response status:', error.response.status);
            // console.error('Error response data:', error.response.data);
            if (error.response.data.message === "Username Already exists"){
            this.errorToast(error.response.data.message)
            } else{
              console.error('Error updating personal information:', error)
            }
          } else{
            console.error('Error updating personal information:', error);
          }
        }) 
      }
      else if (data == "password"){
        if (this.oldPassword == this.userDetails.password && this.newPassword == this.confirmPassword ){
        await axios.put(`http://localhost:3000/api/user/updatePassword/${this.userDetails.id}`, {
          newPassword: this.newPassword
        })
        .then(response => {
          this.successToast("Password Updated Successfully !");
          console.log('Password updated successfully:', response.data);
          this.userDetails.password = this.newPassword 
        })
        .catch(error => {
          console.error('Error updating password:', error);
        });
        }
        else if(this.oldPassword != this.userDetails.password){
          this.errorToast("Old password is wrong !");
          console.log("old password is wrong")
        }
        else if(this.newPassword != this.confirmPassword){
          this.errorToast("password not matched !");
          console.log("password not matchded")
        }
      } 
    },
    
    updateImageURL(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageURL = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  }
};
</script>

<style scoped>
  .mb-4 {
    margin-bottom: 1.5rem;
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
