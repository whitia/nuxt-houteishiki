<template>
  <div>
    <Header />

    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-4" v-for="(card,key) in $store.getters.getCards" v-bind:key="key">
          <b-card
            :img-src="card.url"
            img-top
            img-height="200"
            tag="card"
            class="mb-5 border-0 text-center"
          >
            <b-card-title>{{ card.title }}</b-card-title>
            <b-card-text>
              {{ card.formula.value_1 }} ×
              {{ card.formula.value_2 }} ＝
              {{ card.formula.valuation }}
            </b-card-text>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'

export default {
  data() {
    return {
      newTitle: '',
      newValue_1: '',
      newValue_2: '',
      newValuation: '',
    }
  },
  components: {
    Header: Header,
  },
  methods: {
    addCard() {
      const title = this.newTitle
      const formula = {
        value_1: this.newValue_1,
        value_2: this.newValue_2,
        valuation: this.newValuation
      }

      this.$store.dispatch('addCard', { title, formula })
      this.newTitle = ''
      this.newValue_1 = ''
      this.newValue_2 = ''
      this.newValuation = ''
    }
  },
  created() {
    this.$store.dispatch('fetchCards')
  }
}
</script>
