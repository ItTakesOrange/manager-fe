<template>
  <div class="approve-manager">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action"></div>
      <el-table :data="applyList">
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
            <el-button
              v-if="scope.row.curAuditUserName === userInfo.userName && [1, 2].includes(scope.row.applyState)"
              size="mini"
              @click="handleDetail(scope.row)"
            >审批</el-button>
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
    <el-dialog
      v-model="showDetailModal"
      title="审批详情"
      destroy-on-close
    >
      <el-form
        ref="dialogForm"
        :model="auditForm"
        :rules="rules"
        label-width="120px"
        label-suffix=":"
      >
        <el-form-item label="申请人">
          {{ detail.applyUser.userName }}
        </el-form-item>
        <el-form-item label="休假类型">
          {{ detail.applyTypeName }}
        </el-form-item>
        <el-form-item label="休假时间">
          {{ detail.time }}
        </el-form-item>
        <el-form-item label="休假时长">
          {{ detail.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因">
          {{ detail.reasons }}
        </el-form-item>
        <el-form-item label="审批状态">
          {{ detail.applyStateName }}
        </el-form-item>
        <el-form-item label="审批人">
          {{ detail.curAuditUserName }}
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="auditForm.remark"
            type="textarea"
            row="3"
            placeholder="请输入审核备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('pass')">审核通过</el-button>
          <el-button type="primary" @click="handleApprove('refuse')">驳回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import utils from '../utils/utils'

export default {
  name: 'Approve',
  setup() {
    const { proxy } = getCurrentInstance()
    const queryForm = reactive({
      applyState: 1
    })
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0
    })
    const columns = reactive([
      {
        label: '单号',
        prop: 'orderNo'
      },
      {
        label: '申请人',
        formatter(row) {
          return row.applyUser.userName
        }
      },
      {
        label: '休假时间',
        prop: '',
        formatter(row) {
          return (
            utils.formatDate(new Date(row.startTime), 'yyyy-MM-dd') +
            '到' +
            utils.formatDate(new Date(row.endTime), 'yyyy-MM-dd')
          )
        }
      },
      {
        label: '休假时长',
        prop: 'leaveTime'
      },
      {
        label: '休假类型',
        prop: 'applyType',
        formatter(row, column, value) {
          return {
            1: '事假',
            2: '调休',
            3: '年假'
          }[value]
        }
      },
      {
        label: '休假原因',
        prop: 'reasons'
      },
      {
        label: '申请时间',
        prop: 'createTime',
        width: 180,
        formatter(row, column, value) {
          return utils.formatDate(new Date(value))
        }
      },
      {
        label: '审批人',
        prop: 'auditUsers'
      },
      {
        label: '当前审批人',
        prop: 'curAuditUserName'
      },
      {
        label: '审批状态',
        prop: 'applyState',
        formatter(row, column, value) {
          return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4: '审批通过',
            5: '作废'
          }[value]
        }
      }
    ])
    const applyList = ref([])
    const leaveForm = reactive({
      applyType: 1,
      startTime: '',
      endTime: '',
      leaveTime: '0天',
      reasons: ''
    })
    const showDetailModal = ref(false)
    const detail = ref({})
    const userInfo = proxy.$store.state.userInfo
    const rules = {
      remark: [
        {
          required: true,
          message: '请输入备注',
          trigger: 'blur'
        }
      ]
    }
    const auditForm = reactive({
      remark: ''
    })
    // 初始化接口调用
    onMounted(() => {
      getApplyList()
    })
    // 获取申请列表
    const getApplyList = async () => {
      try {
        const params = { ...queryForm, ...pager, type: 'approve' }
        const { list, page } = await proxy.$api.getApplyList(params)
        applyList.value = list
        pager.total = page.total
      } catch(error) {
        console.error('getApplyList error:', error)
      }
    }
    // 重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    // 分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getApplyList()
    }
    // 弹框关闭
    const handleClose = () => {
      showDetailModal.value = false
      handleReset('dialogForm')
    }
    const handleDetail = (row) => {
      let data = {
        ...row
      }
      data.applyTypeName = {
        1: '事假',
        2: '调休',
        3: '年假'
      }[row.applyType]
      data.time = (
        utils.formatDate(new Date(row.startTime), 'yyyy-MM-dd') +
        '到' +
        utils.formatDate(new Date(row.endTime), 'yyyy-MM-dd')
      )
      data.applyStateName = {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废'
      }[row.applyState]
      detail.value = data
      showDetailModal.value = true
    }
    const handleApprove = (action) => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          try {
            let params = {
              _id: detail.value._id,
              remark: auditForm.remark,
              action
            }
            await proxy.$api.leaveApprove(params)
            handleClose()
            proxy.$message.success('处理成功')
            proxy.$store.commit('saveNoticeCount', proxy.$store.state.noticeCount - 1)
            getApplyList()
          } catch (error) {
            console.error('handleApprove error:', error)
          }
        }
      })
    }
    return {
      queryForm,
      pager,
      columns,
      applyList,
      leaveForm,
      rules,
      showDetailModal,
      detail,
      userInfo,
      auditForm,
      getApplyList,
      handleReset,
      handleCurrentChange,
      handleDetail,
      handleApprove
    }
  }
}
</script>

<style lang="scss">
</style>
