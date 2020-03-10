<template>
  <div class="container">
    <!--
    <div class="title is-1 is-spaced">user: {{ $store.getters.getUserName }}</div>
    <div>
      <button class="button is-primary is-rounded" @click="login">
        ログイン
      </button>
    </div>
    -->

    <table class="table is-narrow">
      <tbody>
        <tr>
          <th>title</th>
          <th>value_1</th>
          <th>value_2</th>
          <th>valuation</th>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="(card,key) in $store.getters.getCards" :key="key">
          <td>{{ card.title }}</td>
          <td>{{ card.formula.value_1 }}</td>
          <td>{{ card.formula.value_2 }}</td>
          <td>{{ card.formula.valuation }}</td>
        </tr>
      </tbody>
    </table>

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
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTitle: '',
      newValue_1: '',
      newValue_2: '',
      newValuation: '',
    }
  },
  methods: {
    login() {
      console.log('login')
      this.$store.dispatch('login')
    },
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

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>