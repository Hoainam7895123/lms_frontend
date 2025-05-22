<style>
.login-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
<template>
    <div class="login-wrapper">
        <RouterView />
    </div>
</template>
<script>
export default {
    name: 'login-layout', // Đặt tên chính xác
};
</script>
