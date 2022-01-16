<template>
  <el-form ref="accountForm"
           :model="user"
           :rules="userRoles">
    <el-form-item label="姓名" prop="name">
      <el-input disabled v-model.trim="user.name"/>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model.trim="user.email"/>
    </el-form-item>
    <el-form-item label="电话号码" prop="mobile">
      <el-input v-model.trim="user.mobile"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">更改个人信息</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {isEmail, isPhone} from '@/utils/validate'
import {updateProfile} from "@/api/server/user"

export default {

  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          mobile: '',
        }
      }
    },

  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!isPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    return {
      editProfile: {
        userName: '',
        userEmail: '',
        userMobile: ''
      },
      userRoles: {
        email: [
          {
            message: "邮箱格式错误",
            trigger: 'blur',
            validator: validateEmail,
          },
        ],
        mobile: [
          {
            message: "电话号码格式错误",
            trigger: 'blur',
            validator: validatePhone,
          },
        ],
      }
    }
  },
  methods: {
    save() {
      this.$refs['accountForm'].validate(async (valid) => {
        if (valid) {
          this.editProfile.userEmail = this.user.email;
          this.editProfile.userName = this.user.name;
          this.editProfile.userMobile = this.user.mobile;
          await updateProfile(this.editProfile);
          this.$baseMessage("修改个人信息成功", "success");
        } else {
          return
        }
      })
    }
  }
}
</script>
