// store/modules/account.js
// import axios from "axios";

export default {
    namespaced: true, // 💡 Bắt buộc để phân biệt module
    state: {
        accessToken: null,
        refreshToken: null,
        status: { loggedIn: false },
        user: null,
    },

    getters: {},

    mutations: {
        loginSuccess(state, { user, accessToken, refreshToken }) {
            state.status = { loggedIn: true };
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
        },
        logout(state) {
            state.user = null;
            state.accessToken = '';
            state.refreshToken = '';
        },
    },

    actions: {
        assign({ commit }, { user, access_token, refresh_token }) {
            // Lưu thông tin vào localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('jwt', access_token);
            localStorage.setItem('jwt_refresh', refresh_token);

            // Cập nhật lại state trong Vuex
            commit('loginSuccess', {
                user: user,
                accessToken: access_token,
                refreshToken: refresh_token,
            });
        },

        loadFromStorage({ commit }) {
            const user = JSON.parse(localStorage.getItem('user'));
            const accessToken = localStorage.getItem('jwt');
            const refreshToken = localStorage.getItem('jwt_refresh');

            if (user && accessToken && refreshToken) {
                commit('loginSuccess', {
                    user,
                    accessToken,
                    refreshToken,
                });
            }
        },

        logout({ commit }) {
            localStorage.removeItem('user');
            localStorage.removeItem('jwt');
            localStorage.removeItem('jwt_refresh');
            commit('logout');
        },
    },
};
