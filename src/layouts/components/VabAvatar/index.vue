<template>
  <div>
    <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown">
      <!--<el-avatar class="user-avatar" :src="avatar"></el-avatar>-->
      <img class="user-avatar" :src="avatar" alt=""/>
      <div class="user-name">
        {{ username }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
    </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="person">个人中心</el-dropdown-item>
        <!--      <el-dropdown-item command="gitee" divided>码云地址</el-dropdown-item>-->
        <!--      <el-dropdown-item command="pro" divided>pro付费版地址</el-dropdown-item>-->
        <el-dropdown-item command="editPassword" divided>修改密码</el-dropdown-item>
        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {recordRoute} from '@/config'
import {editPasswordByName} from "@/api/server/user";

export default {
  name: 'VabAvatar',
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
      username: 'user/username',
    }),
  },
  data() {
    return {
      passwords: {
        userName: '',
        password1: '',
        password2: ''
      },
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'editPassword':
          this.handleEditPassword();
          break
        case 'person':
          this.$router.push("/")
          break
      }
    },
    personalCenter() {
      this.$router.push('/personalCenter/personalCenter')
    },
    handleEditPassword() {
      this.$prompt('请输入密码', '密码修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(\w){6,10}$/,
        inputErrorMessage: '密码为6-10位'
      }).then(({value}) => {
        this.passwords.password1 = value;
        this.passwords.password2 = value;
        this.passwords.userName = this.username;
        this.editPass();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    async editPass() {
      await editPasswordByName(this.passwords)
      this.$baseMessage("修改密码成功", "success");
      await this.$store.dispatch('user/logout')
      if (recordRoute) {
        const fullPath = this.$route.fullPath
        await this.$router.push(`/login?redirect=${fullPath}`)
      } else {
        await this.$router.push('/login')
      }
      // await this.$router.push('/login')
    },
    logout() {
      this.$baseConfirm('您确定要退出登陆吗' + '吗?', null, async () => {
        await this.$store.dispatch('user/logout')
        if (recordRoute) {
          const fullPath = this.$route.fullPath
          await this.$router.push(`/login?redirect=${fullPath}`)
        } else {
          await this.$router.push('/login')
        }
      })
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
    width: 40px;
    height: 40px;
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
