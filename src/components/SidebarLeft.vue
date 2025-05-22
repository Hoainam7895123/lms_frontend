<style>
/* Sidebar chính */
.custom-sidebar {
    background-color: #ffffff; /* Màu nền trắng của Tabler */
    border-right: 1px solid #e9ecef; /* Viền nhẹ bên phải */
}

/* Logo hoặc tên thương hiệu */
.navbar-brand {
    color: #206bc4; /* Màu xanh chủ đạo của Tabler */
}

/* Liên kết trong menu */
.nav-custom.nav-link {
    color: #495057; /* Màu xám đậm mặc định của Tabler */
    background-color: transparent; /* Nền trong suốt khi không hover */
    transition: background-color 0.3s ease, color 0.3s ease, padding-left 0.3s ease;
}

/* Hiệu ứng hover */
.nav-custom.nav-link:hover {
    background-color: #f1f3f5; /* Màu xám nhạt khi hover */
    color: #206bc4; /* Chuyển sang xanh Tabler */
    padding-left: 1.75rem; /* Dịch nhẹ sang phải khi hover */
}

/* Trạng thái active */
.nav-custom.nav-link.active {
    background-color: #206bc4; /* Màu xanh chủ đạo của Tabler */
    color: #ffffff !important; /* Chữ trắng khi active để tăng độ tương phản */
}

/* Icon trong menu */
.nav-custom.nav-link .me-2 {
    color: inherit; /* Kế thừa màu từ nav-link */
}

/* Logout link */
.logout-link .nav-custom.nav-link {
    color: #495057; /* Màu xám đậm mặc định */
}

.logout-link .nav-custom.nav-link:hover {
    background-color: #f1f3f5; /* Màu xám nhạt khi hover */
    color: #206bc4; /* Chuyển sang xanh Tabler */
}

/* Responsive: Điều chỉnh màu sắc trên màn hình nhỏ */
@media (max-width: 992px) {
    .nav-custom.nav-link:hover {
        background-color: #f1f3f5; /* Giữ màu hover nhất quán */
        color: #206bc4;
    }

    .nav-custom.nav-link.active {
        background-color: #206bc4; /* Giữ màu active */
        color: #ffffff; /* Chữ trắng khi active */
    }
}
</style>
<template>
    <aside class="custom-sidebar navbar navbar-vertical navbar-expand-lg text-black">
        <div class="container-fluid">
            <h1 class="navbar-brand">Learn Smart</h1>
            <div class="collapse navbar-collapse" id="sidebar-menu">
                <ul class="navbar-nav pt-lg-3">
                    <li class="nav-item">
                        <RouterLink
                            class="nav-custom nav-link text-black"
                            to="/dashboard"
                            active-class="active"
                        >
                            <IconLayoutGrid class="me-2" />
                            <span> Dashboard </span>
                        </RouterLink>
                    </li>

                    <li class="nav-item">
                        <RouterLink
                            class="nav-custom nav-link text-black"
                            to="/dashboard/courses"
                            active-class="active"
                        >
                            <IconBook class="me-2" />
                            <span class="nav-link-title"> Quản lý khoá học</span>
                        </RouterLink>
                    </li>

                    <li v-if="user && user.role !== 'ROLE_TEACHER'" class="nav-item">
                        <RouterLink
                            class="nav-custom nav-link text-black"
                            to="/dashboard/user"
                            active-class="active"
                        >
                            <IconUsers class="me-2" />
                            <span class="nav-link-title"> Quản lý thành viên </span>
                        </RouterLink>
                    </li>

                    <li v-if="user && user.role !== 'ROLE_TEACHER'" class="nav-item dropdown">
                        <RouterLink
                            class="nav-custom nav-link text-black"
                            to="/dashboard/join-request"
                            active-class="active"
                        >
                            <IconClipboardList class="me-2" />
                            <span class="nav-link-title"> Yêu cầu tham gia </span>
                        </RouterLink>
                    </li>

                    <li v-if="user && user.role !== 'ROLE_TEACHER'" class="nav-item dropdown">
                        <RouterLink
                            class="nav-custom nav-link text-black"
                            to="/dashboard/admin"
                            active-class="active"
                        >
                            <IconClipboardList class="me-2" />
                            <span class="nav-link-title">Tạo tài khoản</span>
                        </RouterLink>
                    </li>
                    <!-- Thêm mục Logout ở dưới cùng -->
                    <li class="nav-item mt-auto logout-link">
                        <a
                            class="nav-custom nav-link text-black"
                            href="#"
                            @click.prevent="doLogout"
                        >
                            <IconLogout class="me-2" />
                            <span class="nav-link-title span">Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
</template>
<script>
import {
    IconLayoutGrid,
    IconBook,
    IconUsers,
    IconClipboardList,
    IconLogout,
} from '@tabler/icons-vue';
import { mapState } from 'vuex';

export default {
    name: 'AppSidebar',
    components: {
        IconLayoutGrid,
        IconBook,
        IconUsers,
        IconClipboardList,
        IconLogout,
    },
    computed: {
        ...mapState('account', ['user']),
    },
    methods: {
        async doLogout() {
            try {
                await this.$store.dispatch('account/logout');
                this.$router.push('/login'); // thực hiện điều hướng ở đây
            } catch (error) {
                console.log('Logout error:', error);
            }
        },
    },
    mounted() {
        console.log('User: ', this.$store.state.account.user);
    },
};
</script>
