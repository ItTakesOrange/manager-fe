<template>
  <div class="user-manager">
    <div class="query-form">
      <query-form v-model="user" :form="form" @handleQuery="handleQuery" />
    </div>
    <div class="base-table">
      <div class="action">
        <el-button v-has="'user-create'" type="primary" @click="handleCreate">新增</el-button>
        <el-button v-has="'user-patch-delete'" type="danger" @click="handleBatchDel">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button v-has="'user-edit'" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-has="'user-delete'" type="danger" size="mini" @click="handleDel(scope.row)">删除</el-button>
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
    <el-dialog v-model="showModal" title="用户新增">
      <el-form ref="dialogForm" :model="userForm" label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="action === 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action === 'edit'"
            placeholder="请输入用户邮箱"
          >
            <template #append>@qq.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位"/>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%;"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, getCurrentInstance, toRaw } from 'vue'
import utils from '../utils/utils'

export default {
  name: 'User',
  setup() {
    const { proxy } = getCurrentInstance()
    const form = [
      {
        type: 'input',
        label: '用户ID',
        model: 'userId',
        placeholder: '请输入用户ID'
      },
      {
        type: 'input',
        label: '用户名称',
        model: 'userName',
        placeholder: '请输入用户名称'
      },
      {
        type: 'select',
        label: '状态',
        model: 'state',
        placeholder: '请选择状态',
        options: [
          {
            value: 0,
            label: '所有'
          },
          {
            value: 1,
            label: '在职'
          },
          {
            value: 2,
            label: '离职'
          },
          {
            value: 3,
            label: '试用期'
          }
        ]
      }
    ]
    const user = ref({
      state: 1
    })
    const userList = ref([])
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0
    })
    const checkUsersIds = ref([])
    const showModal = ref(false)
    // 新增用户Form对象
    const userForm = reactive({
      state: 3,
      mobile: ''
    })
    const roleList = ref([])
    const deptList = ref([])
    const action = ref('add')
    // 表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: '请输入用户名称',
          trigger: 'blur'
        }
      ],
      userEmail: [
        {
          required: true,
          message: '请输入用户邮箱',
          trigger: 'blur'
        }
      ],
      mobile: [
        {
          pattern: /^1[3-9]\d{9}$/,
          message: '请输入正确的手机号格式',
          trigger: 'blur'
        }
      ],
      deptId: [
        {
          required: true,
          message: '请输入用户邮箱',
          trigger: 'blur'
        }
      ]
    })
    const columns = reactive([
      {
        label: '用户ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'userName'
      },
      {
        label: '用户邮箱',
        prop: 'userEmail'
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter(row, column, value) {
          return {
            0: '管理员',
            1: '普通用户'
          }[value]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter(row, column, value) {
          return {
            1: '在职',
            2: '离职',
            3: '试用期'
          }[value]
        }
      },
      {
        label: '注册时间',
        prop: 'createTime',
        width: 180,
        formatter(row, column, value) {
          return utils.formatDate(new Date(value))
        }
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        width: 180,
        formatter(row, column, value) {
          return utils.formatDate(new Date(value))
        }
      }
    ])
    // 初始化接口调用
    onMounted(() => {
      getUserList()
      getRoleAllList()
      getDeptList()
    })
    // 获取用户列表
    const getUserList = async () => {
      try {
        const params = { ...user.value, ...pager }
        const { list, page } = await proxy.$api.getUserList(params)
        userList.value = list
        pager.total = page.total
      } catch(error) {
        console.error('getUserList error:', error)
      }
    }
    // 查询事件，获取用户列表
    const handleQuery = () => {
      getUserList()
    }
    // 重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    // 分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }
    // 单个删除
    const handleDel = async (row) => {
      await proxy.$api.userDel({
        userIds: [row.userId]
      })
      proxy.$message.success('删除成功')
      getUserList()
    }
    // 批量删除
    const handleBatchDel = async () => {
      if (checkUsersIds.value.length === 0) {
        proxy.$message.error('请选择要删除的用户')
        return
      }
      const res = await proxy.$api.userDel({
        userIds: checkUsersIds.value
      })
      if (res.nModified > 0) {
        proxy.$message.success('删除成功')
        getUserList()
      } else {
        proxy.$message.success('修改失败')
      }
    }
    // 表格多选
    const handleSelectionChange = (list) => {
      checkUsersIds.value = list.map(item => {
        return item.userId
      })
    }
    // 用户新增
    const handleCreate = () => {
      action.value = 'add'
      showModal.value = true
    }
    // 角色列表
    const getRoleAllList = async () => {
      const list = await proxy.$api.getRoleAllList()
      roleList.value = list
    }
    // 部门列表
    const getDeptList = async () => {
      const list = await proxy.$api.getDeptList()
      deptList.value = list
    }
    // 用户弹窗关闭
    const handleClose = () => {
      showModal.value = false
      handleReset('dialogForm')
    }
    // 用户提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm)
          params.userEmail += '@qq.com'
          params.action = action.value
          await proxy.$api.userSubmit(params)
          showModal.value = false
          proxy.$message.success('用户创建成功')
          handleReset('dialogForm')
          getUserList()
        }
      })
    }
    const handleEdit = (row) => {
      action.value = 'edit'
      showModal.value = true
      proxy.$nextTick(() => {
        Object.assign(userForm, row)
      })
    }
    return {
      form,
      user,
      userList,
      pager,
      columns,
      showModal,
      userForm,
      rules,
      roleList,
      deptList,
      action,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDel,
      handleBatchDel,
      handleSelectionChange,
      handleCreate,
      getRoleAllList,
      getDeptList,
      handleClose,
      handleSubmit,
      handleEdit
    }
  }
}
</script>

<style lang="scss">

</style>
