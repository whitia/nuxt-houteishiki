<template>
  <div>
    <Header />

    <div class="container">
      <div class="row">
        <div class="col-4" v-for="(card,key) in $store.getters.getCards" v-bind:key="key">
          <b-card
            :title="card.title"
            img-alt="Image"
            img-top
            tag="card"
            class="mb-5 rounded-0 border-0 text-center"
          >
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

    <!--
    <div class="title is-1 is-spaced">user: {{ $store.getters.getUserName }}</div>
    <div>
      <button class="button is-primary is-rounded" @click="login">
        ログイン
      </button>
    </div>
    -->
    <!--
    <div class="field is-grouped">
      <p class="control is-expanded">
        <input v-model="newTitle" class="input" type="text" placeholder="title">
        <input v-model="newValue_1" class="input" type="text" placeholder="value_1">
        <input v-model="newValue_2" class="input" type="text" placeholder="value_2">
        <input v-model="newValuation" class="input" type="text" placeholder="valuation">
      </p>
      <p class="control">
        <a class="button is-primary" @click="addCard">
          add
        </a>
      </p>
    </div>
    -->

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

<!--
<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
-->