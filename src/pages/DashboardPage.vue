<style scoped>
.box {
    background-color: #fff;
    border-radius: 5px;
}
</style>
<template>
    <div class="me-4">
        <SidebarTop text="Dashboard" />
        <div class="container-xl">
            <div class="mt-3">
                <div class="d-flex justify-content-between gap-3">
                    <div class="box shadow-sm flex-fill p-3 border">
                        <div class="fs-2 fw-bold">Khoá học</div>
                        <div class="d-flex fs-1 align-items-center mt-3">
                            <div
                                class="border rounded-circle p-1 d-flex justify-content-center align-items-center me-3"
                            >
                                <IconBooks :size="30" color="blue" />
                            </div>

                            <div class="fw-bold">{{ dashboard.courses?.length || 0 }}</div>
                        </div>
                    </div>
                    <div class="box shadow-sm flex-fill p-3 border">
                        <div class="fs-2 fw-bold">Học viên</div>
                        <div class="d-flex fs-1 align-items-center mt-3">
                            <div
                                class="border rounded-circle p-1 d-flex justify-content-center align-items-center me-3"
                            >
                                <IconUsers :size="30" color="blue" />
                            </div>

                            <div class="fw-bold">{{ dashboard.students?.length || 0 }}</div>
                        </div>
                    </div>
                    <div class="box shadow-sm flex-fill p-3 border">
                        <div class="fs-2 fw-bold">Doanh thu</div>
                        <div class="d-flex fs-1 align-items-center mt-3">
                            <div
                                class="border rounded-circle p-1 d-flex justify-content-center align-items-center me-3"
                            >
                                <IconCoinFilled :size="30" color="blue" />
                            </div>

                            <div class="fw-bold">145</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-5">
                <TrafficSummaryChart />
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { IconBooks, IconUsers, IconCoinFilled } from '@tabler/icons-vue';

import SidebarTop from '@/components/SidebarTop.vue';
import TrafficSummaryChart from '@/components/TrafficSummaryChart.vue';

export default {
    components: {
        SidebarTop,
        IconBooks,
        IconUsers,
        IconCoinFilled,
        TrafficSummaryChart,
    },
    data() {
        return {
            user: null,
            dashboard: '',
        };
    },
    computed: {},
    methods: {
        async getDashboard() {
            try {
                const response = await axios.get('/api/dashboard', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                // console.log('Dashboard: ', response.data);
                this.dashboard = response.data.data;
            } catch (error) {
                console.error('Error: ', error.message);
            }
        },
    },
    mounted() {
        this.getDashboard();
    },
};
</script>
