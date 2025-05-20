// store/index.js
import { createStore } from 'vuex';
import account from './modules/account';

const store = createStore({
    modules: {
        account, // tên này là namespace: 'account'
    },
});

export default store;
