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
        <el-button type="primary" @click="handleCreate">新增</el-button>
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
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="showModal" :title="this.action === 'create' ? '创建部门' : '编辑部门'">
      <el-form
        ref="dialogForm"
        :model="deptForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="deptForm.parentId"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            placeholder="请选择上级部门"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select
            v-model="deptForm.user"
            placeholder="请选择负责人"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input v-model="deptForm.userEmail" placeholder="请输入负责人邮箱" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../utils/utils'

export default {
  name: 'Dept',
  data() {
    return {
      queryForm: {
        deptName: ''
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
      ],
      action: '',
      showModal: false,
      deptForm: {},
      userList: [],
      rules: {
        parentId: [
          {
            required: true,
            message: '请选择上级部门',
            trigger: 'blur'
          }
        ],
        deptName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          }
        ],
        user: [
          {
            required: true,
            message: '请选择负责人',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.getDeptList()
    this.getAllUserList()
  },
  methods: {
    async getDeptList() {
      const list = await this.$api.getDeptList({
        ...this.queryForm,
        ...this.pager
      })
      this.deptList = list
    },
    async getAllUserList() {
      this.userList = await this.$api.getAllUserList()
    },
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    handleUser(val) {
      const [userId, userName, userEmail] = val.split('/')
      Object.assign(this.deptForm, { userId, userName, userEmail })
    },
    handleCreate() {
      this.action = 'create'
      this.showModal = true
    },
    handleEdit(row) {
      this.action = 'edit'
      this.showModal = true
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, {
          user: `${row.userId}/${row.userName}/${row.userEmail}`
        })
      })
    },
    async handleDel(_id) {
      this.action = 'delete'
      await this.$api.deptOperate({ _id, action: this.action })
      this.$message.success('删除成功')
      this.getDeptList()
    },
    handleClose() {
      this.showModal = false
      this.handleReset('dialogForm')
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const params = { ...this.deptForm, action: this.action }
          delete params.user
          const res = await this.$api.deptOperate(params)
          if (res) {
            this.$message.success('操作成功')
            this.handleClose()
            this.getDeptList()
          }
        }
      })
    }
  }
}
</script>
