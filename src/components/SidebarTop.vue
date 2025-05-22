<style scoped>
.referrals {
    border-radius: 20px;
    border: 2px solid #171717;
}

.nav-link {
    display: flex;
    align-items: center;
    color: #000000;
    font-size: 18px;
    text-decoration: none;
    padding: 8px 12px;
}

.icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
}

.nav-link-title {
    margin: 0;
}

.dark .custom-sidebar {
    background-color: #1a1a1a;
}

.dark .form-check-label {
    color: #ffffff;
}

.dark .nav-link {
    color: #ffffff;
}
</style>
<template>
    <div>
        <div class="mb-3">
            <header class="navbar navbar-expand-md d-print-none">
                <div class="container-xl">
                    <div class="navbar-nav flex-row order-md-last">
                        <div class="fs-2 text-black fw-bold">
                            <span> Hello, {{ user?.email || 'Guest' }}! </span>
                            <img
                                class="rounded-circle w-5 border border-2 border-black"
                                src="../assets/img/avatar.png"
                            />
                        </div>
                    </div>
                    <div class="collapse navbar-collapse" id="navbar-menu">
                        <ul class="navbar-nav">
                            <li class="nav-item active">
                                <a class="nav-link ps-0" href="./#">
                                    <span class="nav-link-title fs-1 fw-bold"> {{ text }} </span>
                                </a>
                            </li>
                            <li class="nav-item active" v-show="referrals">
                                <div class="d-flex referrals align-items-center p-2 bg-f3f3f3">
                                    <span class="me-5"> <IconUsers /> Referrals: 0 </span>
                                    <button
                                        class="text-black px-2 py-1 rounded-pill bg-abf600 border-2 border-black"
                                        @click="showModal = true"
                                    >
                                        <span class="nav-link-title fw-bold"
                                            >SHARE WITH FRIENDS</span
                                        >
                                    </button>
                                </div>
                                <span>Pending Referrals: 0</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            <!-- <ShareModal v-model:show="showModal" /> -->
        </div>
    </div>
</template>
<script>
import { IconUsers } from '@tabler/icons-vue';
import { mapState } from 'vuex';

export default {
    name: 'SidebarTop',
    props: {
        text: null,
        referrals: Boolean,
    },
    computed: {
        ...mapState('account', ['user']),
    },
    data() {
        return {
            isDark: false,
            showModal: false,
        };
    },
    components: {
        IconUsers,
    },
};
</script>
