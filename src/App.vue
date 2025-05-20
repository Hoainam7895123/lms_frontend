<template>
    <component :is="layout">
        <RouterView />
    </component>
</template>

<script>
import "@/assets/css/tabler.css";
import DefaultLayout from "@/layouts/default.vue";
import LoginLayout from "@/layouts/auth.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
    components: {
        "default-layout": DefaultLayout,
        "login-layout": LoginLayout,
    },
    setup() {
        const route = useRoute();
        const layout = computed(() => {
            return (route.meta.layout || "default") + "-layout";
        });
        return { layout };
    },
};
</script>
<style>
.container,
.container-sm,
.container-md,
.container-lg,
.container-xl,
.container-xxl {
    max-width: 100% !important;
}
</style>