<template>
  <router-view></router-view>
  <!-- <v-input
    v-model="userName"
    v-model:title="title"
    @handleSubmit="handleSubmit"
  /> -->
</template>

<script>
import { ref } from 'vue'
import VInput from '@/components/VInput.vue'

export default {
  name: 'app',
  components: {
    VInput
  },
  setup() {
    let userName = ref('jack')
    let title = ref('Vue3')
    const handleSubmit = (value) => {
      console.log('接受数据：', value)
      console.log('当前对象：', userName)
    }
    return {
      userName,
      title,
      handleSubmit
    }
  }
}
</script>

<style lang="scss">
@import './assets/style/reset.css';
@import './assets/style/index.scss';
</style>
