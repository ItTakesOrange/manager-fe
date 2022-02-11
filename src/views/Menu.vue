<template>
  <div class="menu-manager">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table
        :data="menuList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleAdd(scope.row)">新增</el-button>
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import utils from '../utils/utils'

export default {
  name: 'Menu',
  data() {
    return {
      queryForm: {
        menuState: 1
      },
      menuList: [],
      columns: [
        {
          label: '菜单名称',
          prop: 'menuName',
          width: 150
        },
        {
          label: '图标',
          prop: 'icon'
        },
        {
          label: '菜单类型',
          prop: 'menuType',
          formatter(row, column, value) {
            return {
              1: '菜单',
              2: '按钮',
            }[value]
          }
        },
        {
          label: '权限标识',
          prop: 'menuCode'
        },
        {
          label: '路由地址',
          prop: 'path'
        },
        {
          label: '组件路径',
          prop: 'component'
        },
        {
          label: '菜单状态',
          prop: 'menuState',
          width: 90,
          formatter(row, column, value) {
            return {
              1: '正常',
              2: '停用'
            }[value]
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter(row, column, value) {
            return utils.formatDate(new Date(value))
          }
        }
      ]
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList()
        this.menuList = list
      } catch (e) {
        throw new Error(e)
      }
    },
    handleQuery() {
    },
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    handleAdd() {
    },
    handleEdit() {
    },
    handleDel() {
    }
  }
}
</script>

<style lang="scss">

</style>
