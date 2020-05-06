<template>
    <header id="header" class="header">
        <div class="header-wrap">
            <h1 class="header-logo">
                <router-link to="/" tag="a">ManSo</router-link>
            </h1>
        </div>
    </header>
</template>

<script>
export default {
    name: 'MainHeader'
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/layouts/_header.scss';
</style>
