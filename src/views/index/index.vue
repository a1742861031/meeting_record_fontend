<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="10" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="14" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="最近" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="账户设置" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline,Account },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
      username: 'user/username',
      email:'user/email',
      mobile:'user/mobile'
    }),
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.user = {
        name: this.username,
        email: this.email,
        avatar: this.avatar,
        mobile:this.mobile
      }
    }
  }
}
</script>
