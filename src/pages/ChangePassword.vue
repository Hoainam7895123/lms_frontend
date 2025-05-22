<style scoped>
.wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0fae5;
}

.login-form {
    width: 500px;
}

.title {
    font-size: 30px;
}

.input-group .form-control {
    border-radius: 15px;
    border-color: #000000;
}

.input-group .input-group-text {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    border-color: #000000;
}

.btn-countinue {
    background-color: #8f8f8f;
}

.logo-img {
    width: 25px;
}

.hr-line {
    width: 40%;
    border: none;
    height: 1px;
    background-color: #000000;
}
</style>
<template>
    <div class="wrapper">
        <div class="login-form d-flex text-center flex-column p-4 bg-f3f3f3 border-all">
            <h1 class="title">Change Password</h1>
            <div class="input-group mt-3">
                <span class="input-group-text">
                    <IconPassword />
                </span>
                <input
                    v-model="oldPass"
                    type="password"
                    class="form-control"
                    placeholder="Password"
                />
            </div>
            <div class="input-group mt-3">
                <span class="input-group-text">
                    <IconPassword />
                </span>
                <input
                    v-model="newPass"
                    type="password"
                    class="form-control"
                    placeholder="Password"
                />
            </div>
            <div class="input-group mt-3">
                <span class="input-group-text">
                    <IconPassword />
                </span>
                <input
                    v-model="newPass2"
                    type="password"
                    class="form-control"
                    placeholder="Password"
                />
            </div>
            <button @click="changePassword" class="mt-3 p-2 rounded-4 btn-countinue fw-bold">
                CHANGE PASSWORD
            </button>
        </div>
    </div>
</template>

<script>
import { IconPassword } from '@tabler/icons-vue';
import axios from 'axios';

export default {
    components: {
        IconPassword,
    },

    data() {
        return {
            web3Modal: null,
            oldPass: '',
            newPass: '',
            newPass2: '',
        };
    },

    methods: {
        async changePassword() {
            try {
                if (!this.newPass || !this.newPass === this.newPass2) {
                    alert('Please enter password');
                    return;
                }
                const response = await axios.post(
                    '/api/accounts/change-password',
                    {
                        oldPass: this.oldPass,
                        newPass: this.newPass,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.data.error) {
                    this.$router.push('/dashboard');
                } else {
                    console.error('Login failed:', response.data);
                    alert('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred during login. Please try again.');
            }
        },
    },
    mounted() {},
};
</script>
