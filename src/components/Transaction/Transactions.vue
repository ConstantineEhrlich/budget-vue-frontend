<script setup>
    import {ref} from "vue";
    import {getTransactions} from "./transactionController";
    import {isOwner} from '../Budget/budgetController';
    import { useUserState } from "../User/userState";
    import { useRouter } from "vue-router";
    import TransactionList from "./TransactionList.vue";

    const router = useRouter();
    const user = useUserState();

    let userIsOwner = ref(false);
    isOwner(user.profile.id, user.budgetId)
        .then(r => userIsOwner.value === r)
        .catch(e => console.error(e));

    // When app is launched first time, the budget is not selected
    // If the user tries to reach '/transactions', redirect to '/'
    if(user.budgetId == null){
        router.push("/");
    }

    

</script>

<template>
    <TransactionList></TransactionList>

</template>