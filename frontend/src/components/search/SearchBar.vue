<template>
    <article class="search-area">
        <h2 class="main-title">전적검색</h2>

        <form class="search" @submit.prevent="summonerSearch">
            <input type="text" class="search-name" v-model="summonerName">
            <input type="submit" class="btn-search" value="검색">
        </form>
    </article>
</template>

<script>
export default {
    name: 'SearchBar',
    props: {
        initSummonerInfo: Object
    },
    data () {
        return {
            summonerName: '',
            summonerInfo: this.initSummonerInfo
        }
    },
    methods: {
        summonerSearch () {
            this.$axios.post(`${this.$store.state.host}/api/search/id`, {
                summonerName: this.summonerName
            })
                .then(
                    res => {
                        if (res.data.id === '' || res.data.id === null || res.data.id === undefined) {
                            this.summonerInfo = [];
                            alert(res.data.message);
                        } else {
                            this.summonerInfo = res.data;
                        }
                        this.$emit('update', {
                            summonerInfo: this.summonerInfo
                        })
                    },
                    err => {
                        console.log(err);
                        alert(err);
                    }
                )
                .catch(err => {
                    alert(err);
                })
        },
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/_search-bar.scss";
</style>
