<template>
    <el-form ref="queryForm" :model="queryModel" :inline="true">
      <FormItem
        v-for="(item, index) in form"
        :key="index"
        v-model="queryModel[item.model]"
        :item="item"
        v-bind="item"
      ></FormItem>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset('form')">重置</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
import { getCurrentInstance, reactive } from 'vue'
import FormItem from './FormItem.vue'

export default {
  name: 'QueryForm',
  props: ['modelValue', 'form'],
  emits: ['update:modelValue', 'handleQuery'],
  components: { FormItem },
  setup(props, context) {
    const { proxy } = getCurrentInstance()
    const queryModel = reactive({
      ...props.modelValue
    })
    const handleReset = () => {
      proxy.$refs.queryForm.resetFields()
    }
    const handleQuery = () => {
      context.emit('update:modelValue', { ...queryModel })
      context.emit('handleQuery', { ...queryModel })
    }
    return {
      queryModel,
      handleQuery,
      handleReset
    }
  }
}
</script>
