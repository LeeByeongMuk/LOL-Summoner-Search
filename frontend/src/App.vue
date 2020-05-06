<template>
    <div id="app">
        <main-header/>

        <router-view/>

        <main-footer/>
    </div>
</template>

<script>
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default {
    name: 'App',
    components: {
        'main-header': Header,
        'main-footer': Footer
    }
}
</script>

<style lang="scss">
@import "@/assets/scss/app.scss";
</style>
