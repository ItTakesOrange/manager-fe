<template>
  <div class="dept-manager">
    <div class="query-form">
      <el-form ref="queryForm" :model="queryForm" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
      </div>
      <el-table
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          v-bind="item"
        ></el-table-column>
        <el-table-column label="操作" width="220">
          <template #default>
            <el-button type="primary" size="mini">新增</el-button>
            <el-button size="mini">编辑</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import utils from '../utils/utils'

export default {
  name: 'Dept',
  data() {
    return {
      queryForm: {
        menuState: 1
      },
      deptList: [],
      pager: {
        pageNum: 1,
        pageSize: 10
      },
      columns: [
        {
          label: '部门名称',
          prop: 'deptName'
        },
        {
          label: '负责人',
          prop: 'userName'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter(row, column, value) {
            return utils.formatDate(new Date(value))
          }
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          formatter(row, column, value) {
            return utils.formatDate(new Date(value))
          }
        }
      ]
    }
  },
  mounted() {
    this.getDeptList()
  },
  methods: {
    async getDeptList() {
      try {
        const list = await this.$api.getDeptList({
          ...this.queryForm,
          ...this.pager
        })
        this.deptList = list
      } catch (e) {
        throw new Error(e)
      }
    },
    handleReset(form) {
      this.$refs[form].resetFields()
    }
  }
}
</script>
