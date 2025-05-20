<style scoped>
.footer {
    margin-left: 270px;

}
</style>
<template>
    <div class="footer bg-f3f3f3 d-flex align-items-center p-3">
        <ul class="d-flex list-unstyled align-items-center gap-3 m-0">
            <li class="">
                <a class="text-000000A3 fs-5" href="">
                    <IconCopyright class="w-3" /> Grass Foundation, 2025. All rights reserved.
                </a>
            </li>
            <li><a href="" class="text-000000A3 fs-5 text-decoration-underline">Privacy Policy</a></li>
            <li><a href="" class="text-000000A3 fs-5 text-decoration-underline">Terms & Conditions</a></li>
            <li><a href="" class="text-000000A3 fs-5 text-decoration-underline">Cookie Policy</a></li>
            <li><a href="" class="text-000000A3 fs-5 text-decoration-underline">Cookie Settings</a></li>
        </ul>
    </div>
</template>
<script>
import { IconCopyright } from "@tabler/icons-vue";
export default {
    name: 'MyFooter',
    components: {
        IconCopyright
    },
};
</script>