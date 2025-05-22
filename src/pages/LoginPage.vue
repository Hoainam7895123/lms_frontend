<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh; /* Đảm bảo wrapper chiếm toàn bộ chiều cao viewport */
    padding: 1rem;
    box-sizing: border-box; /* Đảm bảo padding không làm tăng kích thước ngoài */
}

.login-form {
    background-color: #ffffff; /* White card background */
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    padding: 2rem;
    width: 100%;
    max-width: 450px; /* Optimal width for login form */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-form:hover {
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}

.title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a; /* Dark text for contrast */
    margin-bottom: 1.5rem;
}

.input-group {
    margin-bottom: 1.5rem;
}

.input-group-text {
    background-color: #f1f3f5;
    border: 1px solid #e9ecef;
    color: #495057;
}

.form-control {
    border: 1px solid #e9ecef;
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
    border-color: #206bc4; /* Tabler's primary blue */
    box-shadow: 0 0 0 0.25rem rgba(32, 107, 196, 0.25);
    outline: none;
}

.btn-countinue {
    background-color: #206bc4; /* Tabler's primary blue */
    color: #ffffff;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 0.375rem;
    transition: background-color 0.3s ease, transform 0.2s ease;
    width: 100%;
}

.btn-countinue:hover {
    background-color: #1a5aa3; /* Darker shade on hover */
    transform: translateY(-1px);
}

.btn-countinue:active {
    transform: translateY(0);
}

.mt-3 a {
    color: #206bc4;
    text-decoration: none;
    font-weight: 500;
}

.mt-3 a:hover {
    text-decoration: underline;
    color: #1a5aa3;
}

/* Responsive adjustments */
@media (max-width: 576px) {
    .login-form {
        padding: 1.5rem;
        max-width: 90%;
    }

    .title {
        font-size: 1.25rem;
    }

    .form-control,
    .btn-countinue {
        font-size: 0.875rem;
    }
}
</style>
<template>
    <div class="wrapper">
        <div class="login-form d-flex text-center flex-column p-4">
            <h1 class="title">Learn Smart</h1>
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
                Đăng nhập
            </button>
            <div class="mt-3">Bạn đã có tài khoản chưa? <a href="">Đăng ký</a></div>
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
