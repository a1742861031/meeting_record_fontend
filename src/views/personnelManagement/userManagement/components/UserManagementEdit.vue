<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close" @open="getTypeList">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model.trim="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="userType">
        <el-select v-model="form.userType" placeholder="请选择">
          <el-option v-for="type in types" :key="type.typeId" :label="type.typeName" :value="type.typeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限" prop="isAdmin">
        <el-switch v-model="form.isAdmin" active-text="管理员" inactive-text="普通用户" :active-value="1" :inactive-value="0">
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editUser } from '@/api/server/user'
import { getTypes } from '@/api/server/type';
export default {
  name: 'UserManagementEdit',
  data () {
    return {
      form: {
        username: '',
        userType:0,
        isAdmin:0
      },
      types: [
      ],
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
        ],

        userType: [{ required: true, trigger: 'blur', message: '请选择类型' }],
        isAdmin: [
          { required: true, trigger: 'blur', message: '请选择权限' },
        ],
      },
      title: '',
      dialogFormVisible: false,
    }
  },
  created () {

  },
  methods: {
    showEdit (row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = Object.assign({}, row)
      }
      this.dialogFormVisible = true
    },
    close () {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.dialogFormVisible = false
    },
    save () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          console.log(this.form.isAdmin);
          this.form.authorities = null;
          await editUser(this.form)
          this.$baseMessage("修改成功",'success')
          this.$emit('fetch-data')
          this.close()
        } else {
          return false
        }
      })
    },
    async getTypeList () {
      const { data } = await getTypes();
      this.types = data

    }
  },
}
</script>
