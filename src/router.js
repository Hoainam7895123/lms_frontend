import { createRouter, createWebHashHistory } from 'vue-router';

import DashboardVue from './pages/DashboardPage.vue';
import ManageCourse from './pages/ManageCourse.vue';
import UserPage from './pages/UserPage.vue';
import StorePage from './pages/StorePage.vue';
import LoginPage from './pages/LoginPage.vue';
import ManageTopic from './pages/ManageTopic.vue';
import ManageBlock from './pages/ManageBlock.vue';
import ManageMember from './pages/ManageMember.vue';
import AdminPage from './pages/AdminPage.vue';
import ChangePassword from './pages/ChangePassword.vue';
import JoinRequestPage from './pages/JoinRequestPage.vue';
import StudentPage from './pages/StudentPage.vue';
import TeacherPage from './pages/TeacherPage.vue';
import StudentDetailPage from './pages/StudentDetailPage.vue';

const routeInfos = [
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login',
    },
    {
        path: '/dashboard',
        meta: { layout: 'default', requiresAuth: true },
        component: DashboardVue,
    },
    {
        path: '/dashboard/courses',
        meta: { layout: 'default', requiresAuth: true },

        component: ManageCourse,
    },
    {
        path: '/dashboard/admin',
        meta: { layout: 'default', requiresAuth: true },

        component: AdminPage,
    },
    {
        path: '/dashboard/courses/:courseId/topics',
        meta: { layout: 'default', requiresAuth: true },

        component: ManageTopic,
    },
    {
        path: '/dashboard/join-request',
        meta: { layout: 'default', requiresAuth: true },

        component: JoinRequestPage,
    },

    {
        path: '/dashboard/blocks/:blockId',
        meta: { layout: 'default', requiresAuth: true },

        component: ManageBlock,
    },
    {
        path: '/dashboard/members',
        meta: { layout: 'default', requiresAuth: true },

        component: ManageMember,
    },
    {
        path: '/dashboard/user',
        meta: { layout: 'default', requiresAuth: true },

        component: UserPage,
    },
    {
        path: '/dashboard/store/:homeworkId',
        meta: { layout: 'default', requiresAuth: true },

        component: StorePage,
    },
    {
        path: '/dashboard/students/:courseId',
        meta: { layout: 'default', requiresAuth: true },

        component: StudentPage,
    },
    {
        path: '/dashboard/teachers/:courseId',
        meta: { layout: 'default', requiresAuth: true },

        component: TeacherPage,
    },
    {
        path: '/dashboard/student-detail/:studentId',
        meta: { layout: 'default', requiresAuth: true },

        component: StudentDetailPage,
    },
    {
        path: '/login',
        meta: { layout: 'login' },
        component: LoginPage,
    },
    {
        path: '/change-password',
        meta: { layout: 'login' },
        component: ChangePassword,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routeInfos,
});

router.beforeEach((to, from, next) => {
    let accessToken = localStorage.getItem('jwt');

    if (to.query.token && to.query.refreshToken) {
        localStorage.setItem('jwt', to.query.token);
        localStorage.setItem('jwt_refresh', to.query.refreshToken);
        next({ path: to.path, query: {}, replace: true });
        return;
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!accessToken) {
            next('/login');
        } else {
            next();
        }
    } else if (to.path === '/login' && accessToken) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
