<template xmlns="http://www.w3.org/1999/html">
  <div class="userManagement-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="12">
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">
          批量删除
        </el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel :span="12">
        <el-form :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model.trim="queryForm.username" placeholder="请输入用户名" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryData">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText"
              @selection-change="setSelectRows">
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column label="头像">
        <template #default="{ row }">
          <el-avatar :size="50" :src="row.userAvatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="username" label="姓名" width="150px"></el-table-column>
      <el-table-column label="是否启用" width="160px">
        <template #default="{ row }">
          <el-switch
            v-model="row.isLocked"
            :active-value=0
            :inactive-value=1
            @change="changeStatus(row.userId)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="是否是管理员" width="120px">
        <template #default="{ row }">
          <el-tag v-if="row.isAdmin == 1">是</el-tag>
          <el-tag v-else type="warning">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="类型" prop="typeName" width="100px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="userMobile" label="电话" width="150px"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleEditPassword(row.userId)">修改密码</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :current-page="queryForm.pageNo" :page-size="queryForm.pageSize" :layout="layout"
                   :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    <edit ref="edit" @fetch-data="fetchData"></edit>

    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="eidtdPasswordVisible" width="25%">
      <el-form label-width="80px" ref="passwordform" :model="passwords" :rules="rules">
        <el-form-item label="密码" prop="password1">
          <el-input v-model.trim="passwords.password1" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input v-model.trim="passwords.password2" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtdPasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="summitPasswordEdit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getList, deleteById, getUserById, editPassword,changeStatus} from '@/api/server/user'
import Edit from './components/UserManagementEdit'

export default {
  name: 'UserManagement',
  components: {Edit},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.passwords.password1 !== '') {
          this.$refs.passwordform.validateField('password2');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwords.password1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      list: null,
      listLoading: true,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      selectRows: '',
      elementLoadingText: '正在加载...',
      queryForm: {
        pageNo: 1,
        pageSize: 10,
        username: '',
      },
      eidtdPasswordVisible: false,
      passwords: {
        userId: '',
        password1: '',
        password2: ''
      },
      rules: {
        password1: [
          {validator: validatePass, trigger: 'blur'}
        ],
        password2: [
          {validator: validatePass2, trigger: 'blur'}
        ],

      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async changeStatus(val) {
      await changeStatus(val)
      this.$baseMessage("账号状态修改成功","success")
    },
    setSelectRows(val) {
      this.selectRows = val
    },
    handleEdit(row) {
      if (row.userId) {
        this.$refs['edit'].showEdit(row)
      } else {
        this.$refs['edit'].showEdit()
      }
    },
    handleDelete(row) {
      if (row.userId) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          const {msg} = await deleteById(row.userId)
          this.$baseMessage(msg, 'success')
          this.fetchData()
        })
      } else {
        if (this.selectRows.length > 0) {
          const ids = this.selectRows.map((item) => item.userId).join()
          this.$baseConfirm('你确定要删除选中项吗', null, async () => {
            const {msg} = await deleteById(ids)
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          this.$baseMessage('未选中任何行', 'error')
          return false
        }
      }
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    handleEditPassword(id) {
      this.passwords.userId = id
      this.eidtdPasswordVisible = true
    },
    queryData() {
      this.queryForm.pageNo = 1
      this.fetchData()
    },
    summitPasswordEdit() {
      this.$refs["passwordform"].validate(async (valid) => {
        if (valid) {
          await editPassword(this.passwords);
          this.$baseMessage('修改密码成功', 'success');
          this.eidtdPasswordVisible = false;
          this.$refs["passwordform"].resetFields();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async fetchData() {
      this.listLoading = true
      const {data} = await getList(
        this.queryForm.pageNo,
        this.queryForm.pageSize,
        this.queryForm.username
      )
      this.list = data.records
      this.total = data.total
      setTimeout(() => {
        this.listLoading = false
      }, 300)
    },
  },
}
</script>
<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  height: 50px;
  padding: 0;

  .user-avatar {
    width: 20px;
    height: 20px;
    cursor: pointer;
    border-radius: 50%;
  }

  .user-name {
    position: relative;
    margin-left: 5px;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
