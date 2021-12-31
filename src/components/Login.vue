<template>
  <h1>欢迎来到登录界面</h1>
  <Welcome msg="jack"></Welcome>
  <el-button @click="goHome">回首页</el-button>
</template>

<script>
import Welcome from './Welcome.vue'
export default {
  name: 'login',
  components: {
    Welcome
  },
  methods: {
    goHome() {
      this.$router.push('/welcome')
    }
  }
}
</script>
