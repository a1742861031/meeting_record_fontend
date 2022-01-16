<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <el-upload
          class="avatar-uploader"
          action="这里填入后台的接口地址"
          :show-file-list="false"
          :http-request='uploadFileMethod'>
          <img v-if="user.avatar" :src="user.avatar" class="avatar" alt="点击更换头像" title="点击更换头像">
          <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
        </el-upload>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education"/>
          <span>个人信息</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            邮箱：{{ user.email ? user.email : "未设置" }}
          </div>
          <div class="text-muted">
            电话号码：{{ user.mobile ? user.mobile : "未设置" }}
          </div>
        </div>
      </div>

    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import {uploadFile} from "@/api/server/file";
import {updateAvatar} from '@/api/server/user'
import {mapActions} from 'vuex'
export default {
  components: {PanThumb},
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          role: '',
          mobile: ''
        }
      }
    }
  },
  created() {
  },
  methods: {
    ...mapActions({
      changeAvatar: 'user/setAvatar',
    }),
    async uploadFileMethod(param) {
      let fileObject = param.file;
      let formData = new FormData();
      formData.append("file", fileObject);
      const {data} = await uploadFile(formData);
      await updateAvatar({"userAvatar": data, "userName": this.user.name})
      this.$baseMessage("更改头像成功", "success")
      this.changeAvatar(data)
      this.user.avatar = data
    },

  }
}
</script>

<style lang="scss" scoped>
avatar-uploader {
  width: 120PX;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-size: 100% 100%;
}


.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  display: block;
}


.el-upload-action:hover {
  font-size: 20px;
  background-color: #000;
  background-color: rgba(0, 0, 0, .3)
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
  margin-top: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  cursor: pointer;
  border-radius: 50%;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
