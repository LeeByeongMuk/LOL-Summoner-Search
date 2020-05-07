<template>
    <article class="match-area">
        <h2 class="hidden">전적</h2>

        <div class="match-list" v-if="!isLoading">
            <section class="match-wrap"
                :class="data.user.stats.win ? 'win' : 'lose'"
                v-for="data in matchData"
                :key="data.leagueId">
                <div class="match-stats">
                    <span class="match-type">{{ matchType(data.queue) }}</span>
                    <span class="match-ago">{{ matchAgo(data.detail.gameCreation) }}</span>
                    <span class="match-result" v-if="data.user.stats">{{ data.user.stats.win ? '승리' : '패배' }}</span>
                    <span class="match-time">{{ matchTime(data.detail.gameDuration) }}</span>
                </div>

                <div class="setting-info">
                    <div class="champion-img">
                        <div class="image">
                            <img :src="`/images/champion/${data.champion}.jpg`" alt="">
                        </div>
                    </div>

                    <div class="spell">
                        <div class="image">
                            <img :src="`/images/spell/${data.user.spell1Id}.png`" alt="">
                        </div>
                        <div class="image">
                            <img :src="`/images/spell/${data.user.spell2Id}.png`" alt="">
                        </div>
                    </div>

                    <div class="runes">
                        <div class="image">
                            <img :src="`/images/rune/${data.user.stats.perk0}.png`" alt="">
                        </div>
                        <div class="image">
                            <img :src="`/images/rune/${data.user.stats.perkSubStyle}.png`" alt="">
                        </div>
                    </div>

                    <div class="champion-name">
                        <span></span>
                    </div>
                </div>

                <div class="kda-info">
                    <div class="kda">
                        <span class="kill">{{ data.user.stats.kills }}</span> /
                        <span class="death">{{ data.user.stats.deaths }}</span> /
                        <span class="assist">{{ data.user.stats.assists }}</span>
                    </div>
                    <div class="kda-ratio">
                        <span>{{ kdaRatio(data.user.stats.kills, data.user.stats.deaths, data.user.stats.assists) }}</span>
                        평점
                    </div>
                </div>

                <div class="stat-info">
                    <div class="level">
                        레벨 {{ data.user.stats.champLevel }}
                    </div>
                    <div class="cs">
                        <span>{{ data.user.stats.totalMinionsKilled }}</span> CS
                    </div>
                </div>

                <div class="item-info">
                    <ul class="item-list">
                        <li class="item">
                            <img :src="`/images/item/${data.user.stats.item0}.png`" alt="">
                        </li>
                        <li class="item">
                            <img :src="`/images/item/${data.user.stats.item1}.png`" alt="">
                        </li>
                        <li class="item">
                            <img :src="`/images/item/${data.user.stats.item2}.png`" alt="">
                        </li>
                        <li class="item">
                            <img :src="`/images/item/${data.user.stats.item6}.png`" alt="">
                        </li>
                        <li class="item">
                            <img :src="`/images/item/${data.user.stats.item3}.png`" alt="">
                        </li>
                        <li class="item">
                            <img :src="`/images/item/${data.user.stats.item4}.png`" alt="">
                        </li>
                        <li class="item">
                            <img :src="`/images/item/${data.user.stats.item5}.png`" alt="">
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </article>
</template>

<script>
export default {
    name: 'SearchMatch',
    props: {
        initSummonerInfo: Object
    },
    data () {
        return {
            matchData: [],
            isLoading: true
        }
    },
    watch: {
        initSummonerInfo (data) {
            this.summonerMatch(data.accountId);
        }
    },
    methods: {
        summonerMatch (id) {
            // 초기화
            this.matchData = [];
            this.isLoading = true;

            // 데이터
            this.$axios.post(`${this.$store.state.host}/api/search/match`, {
                id: id
            })
                .then(
                    res => {
                        let count = 0;
                        this.matchData = res.data.matches;

                        for (const data in this.matchData) {
                            this.summonerMatchDetail(res.data.matches[data]).then(
                                res => {
                                    this.matchData[data].detail = res.data;
                                    this.matchData[data].user = this.getUserData(this.matchData[data].detail.participants, this.matchData[data].champion);

                                    return ++count;
                                }
                            ).then(
                                res2 => {
                                    if (this.matchData.length === res2) {
                                        this.isLoading = false;
                                    }
                                }
                            )
                        }
                    },
                    err => {
                        console.log(err);
                        alert(err);
                    }
                )
        },
        summonerMatchDetail (match) {
            return this.$axios.post(`${this.$store.state.host}/api/search/match/detail`, {
                gameId: match.gameId,
                queue: match.queue
            })
                .then(
                    res => {
                        return res;
                    },
                    err => {
                        console.log(err);
                        alert(err);
                    }
                )
        },
        getUserData (data, value) {
            let result = '';

            data.some(function (element) {
                if (element.championId === value) {
                    result = element;
                }

                return (element.championId === value);
            })

            return result;
        },
        matchType (queue) {
            switch (queue) {
                case 420: {
                    return '랭크';
                }
                case 430: {
                    return '일반';
                }
                case 440: {
                    return '자유 랭크';
                }
                case 450 : {
                    return '무작위 총력전';
                }
                default: {
                    return '';
                }
            }
        },
        matchAgo (date) {
            const today = new Date();
            date = new Date(date);

            const matchTimeAgo = Math.floor((today.getTime() - date.getTime()) / 1000 / 60);
            if (matchTimeAgo < 1) {
                return '방금전';
            } else if (matchTimeAgo < 60) {
                return `${matchTimeAgo}분전`;
            }

            const matchHourAgo = Math.floor(matchTimeAgo / 60);
            if (matchHourAgo < 24) {
                return `${matchHourAgo}시간전`;
            }

            const matchDayAgo = Math.floor(matchTimeAgo / 60 / 24);
            if (matchDayAgo < 365) {
                return `${matchDayAgo}일전`;
            }
        },
        matchTime (time) {
            const minute = Math.floor(time / 60);
            const second = time % 60;

            return `${minute}분 ${second}초`;
        },
        kdaRatio (kill = 0, death = 0, assist = 0) {
            if (death === 0) {
                return 'Perfect';
            } else {
                const kda = (kill + assist) / death;

                return `${kda.toFixed(2)} : 1`;
            }
        }
    }
}
</script>
