<template>
    <main class="main">
        <search-bar
            :initSummonerInfo="summonerInfo"
            @update="update"></search-bar>

        <rank
            :initSummonerInfo="summonerInfo"
            @update="update"></rank>

        <match
            :initSummonerInfo="summonerInfo"
            @update="update"></match>
    </main>
</template>

<script>
import SearchBar from '@/components/search/SearchBar.vue';
import Rank from '@/components/search/Rank.vue';
import Match from '@/components/search/Match.vue';

export default {
    name: 'Search',
    components: {
        'search-bar': SearchBar,
        'rank': Rank,
        'match': Match
    },
    data () {
        return {
            summonerInfo: {}
        }
    },
    methods: {
        update (data) {
            this.summonerInfo = data.summonerInfo;
        }
    }
}
</script>

<style lang="scss">
@import "@/assets/scss/pages/search.scss";
</style>
