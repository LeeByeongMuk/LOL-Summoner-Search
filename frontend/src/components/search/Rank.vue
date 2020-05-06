<template>
    <article class="info-area" v-if="!isLoading">
        <h2 class="hidden">랭크 정보</h2>

        <section class="rank-wrap" v-for="data in rankData" :key="data.leagueId">
            <div class="rank-img">
                <img :src="`/images/tier/${data.tier}_${data.rank.length}.png`" :alt="data.tier + data.rank.length">
            </div>

            <div class="rank-info">
                <div class="rank-league">{{ queueType(data.queueType) }}</div>
                <div class="rank-tier">
                    <span class="tier">{{ data.tier }} {{ data.rank }}</span>
                    <span class="point">{{ data.leaguePoints }}LP</span>
                    <span class="series" v-if="data.miniSeries">
                        {{ data.miniSeries.wins }}승 {{ data.miniSeries.losses }}패
                    </span>
                </div>
                <div class="rank-game">
                    {{ data.wins }}승 {{data.losses}}패
                </div>
            </div>
        </section>
    </article>
</template>

<script>
export default {
    name: 'SearchRank',
    props: {
        initSummonerInfo: Object
    },
    data () {
        return {
            rankData: [],
            isLoading: true
        }
    },
    watch: {
        initSummonerInfo (data) {
            this.summonerRank(data.id);
        }
    },
    methods: {
        summonerRank (id) {
            // 랭크 정보 초기화
            this.isLoading = true;
            this.rankData = [];

            // 랭크 정보 데이터
            this.$axios.post(`${this.$store.state.host}/api/search/rank`, {
                id: id
            })
                .then(
                    res => {
                        this.rankData = res.data;
                        this.isLoading = false;
                    },
                    err => {
                        console.log(err);
                        alert(err);
                    }
                )
        },
        queueType (type) {
            switch (type) {
                case 'RANKED_SOLO_5x5': {
                    return '솔로랭크';
                }
                case 'RANKED_FLEX_SR': {
                    return '자유랭크';
                }
                default: {
                    return '';
                }
            }
        }
    }
}
</script>
