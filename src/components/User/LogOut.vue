<script setup>
    import {ref} from 'vue';
    import { useRouter } from 'vue-router';
    import { useUserState } from './userState';
    const user = useUserState();
    const router = useRouter();
    user.logout().then(() => router.push('/')).catch(e => console.error(e));
</script>

<template>
</template>