<template>
  <div class="role-manager">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="菜单名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleOpenPermission(scope.row)">设置权限</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="showModal" title="角色新增">
      <el-form
        ref="dialogForm"
        :model="roleForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="roleForm.remark" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="showPermission" title="权限设置">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handlePremissionSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../utils/utils'

export default {
  name: 'Role',
  data() {
    return {
      queryForm: {
        roleName: ''
      },
      roleList: [],
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          label: '角色名称',
          prop: 'roleName'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '权限列表',
          prop: 'menuType'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter(row, column, value) {
            return utils.formatDate(new Date(value))
          }
        }
      ],
      showModal: false,
      action: '',
      roleForm: {},
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ]
      },
      showPermission: false,
      curRoleId: '',
      curRoleName: '',
      menuList: []
    }
  },
  mounted() {
    this.getRoleList()
    this.getMenuList()
  },
  methods: {
    async getRoleList() {
      try {
        const { list, page } = await this.$api.getRoleList(this.queryForm)
        this.roleList = list
        this.pager.total = page.total
      } catch (e) {
        throw new Error(e)
      }
    },
    async getMenuList() {
      try {
        this.menuList = await this.$api.getMenuList()
      } catch (e) {
        throw new Error(e)
      }
    },
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    handleAdd() {
      this.action = 'add'
      this.showModal = true
    },
    handleEdit(row) {
      this.action = 'edit'
      this.showModal = true
      this.$nextTick(() => {
        Object.assign(this.roleForm, row)
      })
    },
    async handleDel(row) {
      await this.$api.roleOperate({ _id: row._id, action: 'delete' })
      this.$message.success('删除成功')
      this.getRoleList()
    },
    handleClose() {
      this.showModal = false
      this.handleReset('dialogForm')
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const { roleForm, action } = this
          const params = { ...roleForm, action }
          const res = await this.$api.roleOperate(params)
          if (res) {
            this.showModal = false
            this.$message.success('操作成功')
            this.handleReset('dialogForm')
            this.getRoleList()
          }
        }
      })
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current
      this.getRoleList()
    },
    handleOpenPermission(row) {
      this.curRoleId = row._id
      this.curRoleName = row.roleName
      this.showPermission = true
      let { checkedKeys } = row.permissionList
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(checkedKeys)
      })
    },
    async handlePremissionSubmit() {
      const nodes = this.$refs.tree.getCheckedNodes()
      const halfKeys = this.$refs.tree.getHalfCheckedKeys()
      let checkedKeys = []
      let parentKeys = []
      nodes.forEach(node => {
        if (!node.children) {
          checkedKeys.push(node._id)
        } else {
          parentKeys.push(node._id)
        }
      })
      const params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          parentKeys: parentKeys.concat(halfKeys)
        }
      }
      await this.$api.updatePermission(params)
      this.showPermission = false
      this.$message.success('设置成功')
      this.getRoleList()
    }
  }
}
</script>

<style lang="scss">

</style>
