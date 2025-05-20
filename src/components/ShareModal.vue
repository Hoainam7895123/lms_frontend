<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  border: 2px solid #171717;
}

.modal-content.dark {
  background: #1a1a1a;
  color: #ffffff;
}

.close-button {
  float: right;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
<template>
  <div
    v-if="show"
    class="modal-overlay"
    @click.self="$emit('update:show', false)"
  >
    <div :class="['modal-content']">
      <div class="d-flex justify-content-between align-items-center">
        <div></div>
        <h3>Share with Friends</h3>
        <button class="close-button" @click="$emit('update:show', false)">
          ×
        </button>
      </div>
      <div class="mt-3">
        <p>Share your referral link with friends and earn rewards!</p>
        <div class="d-flex align-items-center">
          <input type="text" class="form-control" v-model="shareUrl" readonly />
          <button class="btn btn-primary ms-2" @click="copyLink">
            Copy Link
          </button>
        </div>
      </div>
      <div class="mt-3">
        <div class="d-flex justify-content-between">
          <div v-for="network in networks" :key="network.name">
            <ShareNetwork
              :network="network.name"
              :url="localShareUrl"
              v-slot="{ share }"
            >
              <button
                class="btn w-100 rounded-circle border-0 mb-2"
                @click="share"
              >
                <img :src="network.icon" :alt="network.name" />
              </button>
            </ShareNetwork>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ShareNetwork } from "vue3-social-sharing";

export default {
  name: "ShareModal",
  data() {
    return {
      shareUrl: "",
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Share with Friends",
    },
    message: {
      type: String,
      default: "Share your referral link with friends and earn rewards!",
    },
    networks: {
      type: Array,
      default: () => [
        { name: "facebook", icon: require("../assets/img/facebook-logo.png") },
        { name: "telegram", icon: require("../assets/img/telegram-logo.png") },
        {
          name: "messenger",
          icon: require("../assets/img/messenger-logo.png"),
        },
        { name: "twitter", icon: require("../assets/img/twitter-logo.png") },
        { name: "linkedin", icon: require("../assets/img/linkedin-logo.png") },
        { name: "skype", icon: require("../assets/img/skype-logo.png") },
      ],
    },
  },
  components: {
    ShareNetwork,
  },
  // computed: {
  //   localShareUrl: {
  //     get() {
  //       return this.shareUrl;
  //     },
  //     set(value) {
  //       this.$emit("update:shareUrl", value);
  //     },
  //   },
  // },
  methods: {
    async copyLink() {
      try {
        await navigator.clipboard.writeText(this.shareUrl);
        alert("Copy link successfully!");
      } catch (err) {
        console.error("Error:", err);
        alert("Please try again!");
      }
    },
    async linkToShare() {
      try {
        const response = await axios.get(
          "http://localhost:9811/api/users/me/referral-code",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        if (response.data.data.referral_code) {
          const referralCode = response.data.data.referral_code;
          this.shareUrl = `http://localhost:8181/#/login?referralCode=${referralCode}`;
        }
      } catch (error) {
        console.log("Lỗi khi lấy referral code:", error);
      }
    },
  },
  mounted: function () {
    this.linkToShare();
  },
};
</script>
