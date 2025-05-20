<style>
.custom-sidebar {
    background-color: #f3f3f3;
    width: 270px !important;
}

.nav-custom {
    height: 60px;
}

.custom-sidebar .nav-link.active {
    background-color: #f2fed1;
    color: #000;
    font-weight: bold;
}

.logout-link:hover .me-2 {
    color: #ff0000;
}

.logout-link:hover .span {
    color: #ff0000;
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

                    <li class="nav-item dropdown">
                        <RouterLink
                            class="nav-custom nav-link text-black"
                            to="/dashboard/store"
                            active-class="active"
                        >
                            <IconClipboardList class="me-2" />
                            <span class="nav-link-title"> Quản lý bài tập </span>
                        </RouterLink>
                    </li>
                    <li class="nav-item dropdown">
                        <RouterLink
                            class="nav-custom nav-link text-black"
                            to="/dashboard/join-request"
                            active-class="active"
                        >
                            <IconClipboardList class="me-2" />
                            <span class="nav-link-title"> Quản lý yêu cầu tham gia </span>
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
