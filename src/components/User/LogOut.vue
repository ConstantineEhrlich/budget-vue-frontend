<script setup>
    import {ref} from 'vue';
    import {useRouter} from 'vue-router';
    import { useUserStore } from './userStore';
    const user = useUserStore();
    const router = useRouter();
    user.logout().then(() => router.push('/')).catch(e => console.error(e));
</script>

<template>
</template>