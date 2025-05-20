<template>
  <div class="">
    <div class="container container-tight py-4">
      <div class="card card-md">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">Create Center Admin</h2>
          <p class="text-muted text-center mb-4">
            Enter details to create a new Center Admin account
          </p>
          <form @submit.prevent="createSystemAdmin" autocomplete="off">
            <div class="mb-3">
              <label class="form-label" for="username">Username</label>
              <input
                v-model="form.username"
                id="username"
                type="text"
                class="form-control"
                placeholder="Enter username"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label" for="password">Password</label>
              <input
                v-model="form.password"
                id="password"
                type="password"
                class="form-control"
                placeholder="Enter password"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label" for="name">Name</label>
              <input
                v-model="form.name"
                id="name"
                type="text"
                class="form-control"
                placeholder="Enter full name"
                required
              />
            </div>

            <div class="form-footer">
              <button
                @click="createSystemAdmin"
                type="submit"
                class="btn btn-primary w-100"
              >
                Create Account
              </button>
            </div>
          </form>

          <p v-if="message" :class="messageClass" class="text-center mt-3">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        name: "",
      },
      message: "",
      messageClass: "",
    };
  },
  methods: {
    async createSystemAdmin() {
      try {
        const response = await axios.post("/api/accounts/create-center-admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          ...this.form,
        });

        if (!response.data.data.error) {
          alert("Center Admin account created successfully!");
        } else {
          ("Username already exists. Please choose a different username.");
          this.messageClass = "text-danger";
        }
      } catch (error) {
        this.message =
          "Username already exists. Please choose a different username.";
        this.messageClass = "text-danger";
      }
    },
  },
};
</script>

<style scoped>
.text-success {
  color: #2ecc71;
}
.text-danger {
  color: #e74c3c;
}
</style>
