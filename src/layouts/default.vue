<style>
.main-content {
    margin-left: 270px;
    background-color: #f7f9ff;
}
</style>
<template>
    <div class="app-wrapper">
        <SidebarLeft />

        <div class="main-content">
            <RouterView />
        </div>
    </div>
</template>

<script>
import SidebarLeft from '@/components/SidebarLeft.vue';
import { mapState } from 'vuex';

export default {
    name: 'default-layout', // Đặt tên chính xác
    components: {
        SidebarLeft,
    },
    computed: {
        ...mapState('account', ['user']),
    },
    created() {
        this.$store.dispatch('account/loadFromStorage');
    },
};
</script>
