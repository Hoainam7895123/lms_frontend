<style>
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
            <h1 class="title">Sign in</h1>
            <div class="input-group mt-3">
                <span class="input-group-text">
                    <IconUser />
                </span>
                <input v-model="username" type="text" class="form-control" placeholder="Username" />
            </div>
            <div class="input-group mt-3">
                <span class="input-group-text">
                    <IconPassword />
                </span>
                <input
                    v-model="password"
                    type="password"
                    class="form-control"
                    placeholder="Password"
                />
            </div>
            <button @click="login" class="mt-3 p-2 rounded-4 btn-countinue fw-bold">
                CONTINUE ->
            </button>
            <div class="mt-3">Don't have an account? <a href="">Sign Up</a></div>
            <div class="mt-3 d-flex align-items-center justify-content-center">
                <hr class="hr-line" />
                <span class="mx-3"> OR </span>
                <hr class="hr-line" />
            </div>
            <button @click="loginWithGoogle" class="mt-3 p-2 rounded-4 fw-bold">
                <img class="logo-img me-2" src="../assets/img/google-logo.png" alt="" />
                GOOGLE
            </button>
        </div>
    </div>
</template>

<script>
import { IconUser, IconPassword } from '@tabler/icons-vue';
import axios from 'axios';

export default {
    components: {
        IconUser,
        IconPassword,
    },

    data() {
        return {
            web3Modal: null,
            username: '',
            password: '',
        };
    },

    methods: {
        async loginWithGoogle() {
            try {
                window.location.href = 'http://localhost:9811/google/login';
            } catch (error) {
                console.error('Error login with google:', error);
            }
        },
        async login() {
            try {
                if (!this.username || !this.password) {
                    alert('Please enter username and password');
                    return;
                }

                const response = await axios.post(
                    '/api/user/signin',
                    {
                        username: this.username,
                        password: this.password,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.data.error) {
                    const { token, refresh_token, user } = response.data.data;

                    // Gọi Vuex action để lưu thông tin vào Vuex và đồng thời lưu vào localStorage
                    this.$store.dispatch('account/assign', {
                        user,
                        access_token: token,
                        refresh_token: refresh_token,
                    });

                    // Kiểm tra login_count để quyết định chuyển hướng
                    if (user.login_count === 0) {
                        alert('Bạn cần đổi mật khẩu, với lần đăng nhập đầu tiên!');
                        this.$router.push('/change-password');
                        return;
                    }

                    // Chuyển hướng đến trang dashboard
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
