<template>
  <div>
    <Header />

    <div class="container" style="position:relative;">
      <div class="loading"></div>
      <div class="row justify-content-center" id="content">
        <div class="col-12 col-sm-9">
          <b-card
            :img-src="$store.getters.getCardDetail.image"
            img-top
            tag="card"
            class="text-center"
          >
            <div class="position-relative">
              <div class="position-top-left">
                <img src="https://img.icons8.com/officel/20/000000/hearts.png" class="like"
                     @click.prevent="likeCard()" v-bind:class="{ grayscale: !$store.getters.getCardDetail.like }" />
                <br />
                <span class="small" v-if="$store.getters.getCardDetail.like">
                  {{ $store.getters.getCardDetail.like }}
                </span>
              </div>
              <div class="position-top-right" v-if="$store.getters.getIsOwner">
                <nuxt-link :to="{ name: 'cards-edit-id', params: { id: $store.getters.getCardDetail.id } }">
                  編集
                </nuxt-link> /
                <a href="#" @click.prevent="deleteCard()">削除</a>
              </div>
            </div>
            <b-card-title>{{ $store.getters.getCardDetail.title }}</b-card-title>
            <b-card-text>
              {{ $store.getters.getCardDetail.formula.value_1 }} ×
              {{ $store.getters.getCardDetail.formula.value_2 }} ＝
              {{ $store.getters.getCardDetail.formula.valuation }}
            </b-card-text>
          </b-card>
          <div class="row my-5">
            <div class="col-12 mb-3">
              <h4>{{ $store.getters.getCardDetail.user.name }} の他の方程式</h4>
            </div>
            <div class="col-12 col-sm-4" v-for="(card,key) in $store.getters.getUserCards" v-bind:key="key">
              <nuxt-link :to="{ name: 'cards-id', params: { id: card.id } }">
                <b-card
                  :img-src="card.image"
                  img-top
                  img-height="130"
                  tag="card"
                  class="mb-4 text-center small"
                >
                  <b-card-title>{{ card.title }}</b-card-title>
                  <b-card-text>
                    {{ card.formula.value_1 }} ×
                    {{ card.formula.value_2 }} ＝
                    {{ card.formula.valuation }}
                  </b-card-text>
                </b-card>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Header: Header,
    Footer: Footer
  },
  created() {
    const id = this.$route.params.id
    const user = this.$store.getters.getUser

    this.$store.dispatch('fetchCardDetail', { id })
    .then(() => {
      document.querySelector('#content').classList.add('visible')

      if (user.uid === this.$store.getters.getCardDetail.user.uid) {
        this.$store.commit('setIsOwner', true)
      }

      const card = this.$store.getters.getCardDetail
      this.$store.dispatch('fetchUserCards', { user: card.user, limit: 4 })
      .then(() => {
        this.$store.commit('updateUserCards', { card, max: 3 })
      })
    })
  },
  methods: {
    deleteCard() {
      if (!confirm('本当に削除しますか？')) return

      document.querySelector('.loading').style.display = 'block';

      const card = this.$store.getters.getCardDetail

      this.$store.dispatch('deleteFile', { name: card.id })

      this.$store.dispatch('deleteCard', { card })
      .then(() => {
        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
      })
    },
    likeCard() {
      const card = this.$store.getters.getCardDetail
      this.$store.commit('updateCardLike')
      this.$store.dispatch('likeCard', { card })
    }
  }
}
</script>
