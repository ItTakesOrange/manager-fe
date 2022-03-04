<template>
  <div class="base-table">
    <div class="action">
      <slot name="action"></slot>
    </div>
    <el-table v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          v-if="item.type === 'selection'"
          type="selection"
          width="55"
        />
        <el-table-column v-else-if="!item.type" v-bind="item"></el-table-column>
        <el-table-column v-else-if="item.type === 'action'" v-bind="item">
          <template #default="scope">
            <el-button
              v-for="(btn, index) in item.list"
              :key="btn.text"
              :type="btn.type || 'text'"
              size="mini"
              @click="handleAction(index, scope.row)"
            >
              {{ btn.text }}
            </el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="pager.total"
      :page-size="pager.pageSize"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
  props: ['columns'],
  setup(props, { emit }) {
    const handleAction = (index, row) => {
      emit('handleAction', { index, row: { ...row } })
    }
    return {
      handleAction
    }
  }
}
</script>
