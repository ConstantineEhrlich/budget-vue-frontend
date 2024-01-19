import {createRouter, createWebHistory} from 'vue-router';
import AllBudgetsVue from './components/Budget/AllBudgets.vue';
import UserProfileVue from './components/User/UserProfile.vue';
import LoginFormVue from './components/User/LoginForm.vue';
import LogOutVue from './components/User/LogOut.vue';
import SignUpFormVue from './components/User/SignUpForm.vue';
import TransactionsVue from './components/Transaction/Transactions.vue';
import TransactionEntryVue from './components/Transaction/TransactionEntry.vue';
import CategoryListVue from './components/Category/CategoryList.vue';
import OwnersListVue from './components/Budget/OwnersList.vue';


export function generateMenu(user) {
    const menu = [];
    menu.push(allBudgets);

    if (user.budgetId != null) {
        menu.push(tranasctions);
    }

    if (user.authenticated && user.isOwner) {
        menu.push(addTransaction);
        menu.push(ownersList);
        menu.push(categoriesList);
    }

    if (user.authenticated) {
        menu.push(userProfile);
        menu.push(logout);
    } else {
        menu.push(signup);
        menu.push(login);
    }

    return menu;
}


const routes = [];

const allBudgets = {
    path: "/",
    component: AllBudgetsVue,
    meta: {
        icon: "mdi-cash-multiple",
        text: "All Budgets",
    }
};
routes.push(allBudgets);


const tranasctions = {
    path: "/transactions",
    component: TransactionsVue,
    meta: {
        icon: "mdi-format-list-bulleted-type",
        text: "Transactions",
    }
};
routes.push(tranasctions);


const addTransaction = {
    path: "/add",
    component: TransactionEntryVue,
    meta: {
        icon: "mdi-receipt-text-plus",
        text: "Add transaction",
    }
}
routes.push(addTransaction);


const categoriesList = {
    path: "/categories",
    component: CategoryListVue,
    meta: {
        icon: "mdi-shape",
        text: "Categories"
    }
}
routes.push(categoriesList);


const ownersList = {
    path: "/owners",
    component: OwnersListVue,
    meta: {
        icon: "mdi-account-group",
        text: "Owners"
    }
}
routes.push(ownersList);


const userProfile = {
    path: "/profile",
    component: UserProfileVue,
    meta: {
        icon: "mdi-account",
        text: "User Profile"
    }
}
routes.push(userProfile);


const login = {
    path: "/login",
    component: LoginFormVue,
    meta: {
        icon: "mdi-login",
        text: "Login"
    }
}
routes.push(login);


const signup = {
    path: "/signup",
    component: SignUpFormVue,
    meta: {
        icon: "mdi-account-plus",
        text: "Sign up"
    }
}
routes.push(signup);


const logout = {
    path: "/logout",
    component: LogOutVue,
    meta: {
        icon: "mdi-logout",
        text: "Logout"
    }
}
routes.push(logout);


export const router = createRouter({
    history: createWebHistory(),
    routes
});