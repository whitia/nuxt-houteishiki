<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-12 mb-5">
          <a href="#" @click.prevent="listFile">ファイル取得</a>
        </div>
      </div>
      <div class="row">
        <div class="col-4 small mb-5" v-for="(item,key) in $store.getters.getItems" v-bind:key="key">
          <img :src="item.url" class="img-fluid" />
          <a href="#" @click.prevent="deleteFile(item)">{{ item.name }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    listFile() {
      this.$store.dispatch('listFile')
    },
    deleteFile(item) {
      this.$store.dispatch('deleteFile', { name: item.name })
      .then(() => {
        this.$store.commit('deleteItem', { name: item.name })
      })
    }
  }
}
</script>