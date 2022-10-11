<template>
  <div class="editor-container">
    <el-form
      ref="form"
      :model="form"
      :inline="true"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="会议日期" required>
        <el-col :span="11">
          <el-form-item prop="date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.date"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="time">
            <el-time-picker
              placeholder="选择时间"
              v-model="form.time"
              style="width: 100%"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="会议地点" prop="place">
        <el-input v-model="form.place"></el-input>
      </el-form-item>
      <el-form-item label="会议记录人" prop="recorder">
        <el-select v-model="form.recorder" filterable placeholder="请选择">
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出席人员" prop="attendances">
        <el-checkbox-group v-model="form.attendances">
          <el-checkbox
            v-for="item in userList2"
            :key="item.userId"
            :label="item.userName"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <br/>
      <el-form-item label="缺席人员">
        <el-input
          placeholder="请输入请假原因"
          v-model="nonAttendancePeople.reason"
          class="input-with-select"
          style="width: 500px"
        >
          <el-select
            v-model="nonAttendancePeople.userName"
            slot="prepend"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userName"
            ></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-plus"
            @click="addNotAttend"
          ></el-button>
        </el-input>
      </el-form-item>
      <el-table :data="form.nonAttendances" style="width: 50%" max-height="250">
        <el-table-column
          prop="userName"
          label="姓名"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="reason"
          label="缺席原因"
          width="300"
        ></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="
                deleteRow(scope.$index, form.nonAttendance)
              "
              type="text"
              size="small"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-form-item label="会议内容" prop="content" class="vab-quill-content">
        <vab-quill
          v-model="form.content"
          :min-height="400"
          :options="options"
        ></vab-quill>
      </el-form-item>
      <br/>
      <el-form-item>
        <el-upload
          class="upload"
          ref="upload"
          action=""
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :http-request="uploadFileMethod"
        >
          <el-button slot="trigger" size="small" type="warning">
            选取文件
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item style="float: right; margin-right: 50px">
        <el-button type="success" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" @closed="handleClose">
      <div class="main" style="min-height: 50vh">
        <h1 class="news-title">{{ preview.title }}</h1>
        <span class="time-title">{{ preview.date }}</span>
        <span class="time-title" v-if="preview.attend">
          出席人员：{{ preview.attend }}
        </span>
        <span class="time-title" v-if="preview.noAttend">
          缺席人员：{{ preview.noAttend }}
        </span>
        <div class="news-content" v-html="preview.content"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">继 续 修 改</el-button>
        <el-button type="primary" @click="handleFinalSummit">
          提  交
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vabQuill from '@/plugins/vabQuill'
import {getAllUser} from '@/api/server/user'
import {addRecord, getEditRecord, editRecord} from '@/api/server/record'
import {uploadFile} from '@/api/server/file'

export default {
  name: 'Editor',
  components: {vabQuill},

  data() {
    return {
      fileList: [],
      summitForm: {},
      preview: {
        date: '',
        title: '',
        attend: '',
        noAttend: '',
        content: '',
      },
      id: 0,
      title: '预览添加',
      options: {
        theme: 'snow',
        bounds: document.body,
        debug: 'warn',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{header: [1, 2, 3, 4, 5, 6, false]}],
            [{size: ['small', false, 'large', 'huge']}],
            [{color: []}, {background: []}],
            ['blockquote', 'code-block'],
            [{list: 'ordered'}, {list: 'bullet'}],
            [{script: 'sub'}, {script: 'super'}],
            [{indent: '-1'}, {indent: '+1'}],
            [{align: []}],
            [{direction: 'rtl'}],
            [{font: []}],
            ['clean'],
            ['link', 'image'],
          ],
        },
        placeholder: '内容...',
        readOnly: false,
      },
      borderColor: '#dcdfe6',
      dialogTableVisible: false,
      form: {
        title: '', //会议主题
        content: '', //会议内容
        date: '', //会议时间
        place: '', //会议地点
        recorder: '', //会议记录人
        time: '', //详细时间
        attendances: [], //出席人员
        nonAttendances: [], //请假人员
        files: [],
      },
      nonAttendancePeople: {},
      userList: [],
      userList2: [],
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur',
          },
        ],
        date: [
          {
            required: true,
            message: '请选择年月日',
            trigger: 'change',
          },
        ],
        time: [
          {
            required: true,
            message: '请选择具体时间',
            trigger: 'blur',
          },
        ],
        place: [
          {
            required: true,
            message: '请选择会议地点',
            trigger: 'blur',
          },
        ],
        recorder: [
          {
            required: true,
            message: '请选择记录人',
            trigger: 'blur',
          },
        ],
        attendances: [
          {
            required: true,
            message: '请选择出席人员',
            trigger: 'blur',
          },
        ],
        content: [
          {
            required: true,
            message: '请输入文章内容',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  async created() {
    if (this.$route.query && this.$route.query.id) {
      const {data} = await getEditRecord(this.$route.query.id);
      //处理时间
      let time = "2020-1-10 " + data.time + ":00"
      this.form = data
      this.form.time = new Date(time)
      this.fileList = data.files
      this.title = "预览修改"
    }
    const {data} = await getAllUser()
    this.userList = data
    this.userList2 = data

  },
  methods: {
    async uploadFileMethod(param) {
      let fileObject = param.file
      let formData = new FormData()
      formData.append('file', fileObject)
      const {data} = await uploadFile(formData)
      this.fileList.push({name: param.file.name, url: data})
    },

    handleRemove(file, fileList) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].url === file.url) {
          this.fileList.splice(i, 1)
          return
        }
      }
    },
    handlePreview(file) {
      window.open(file.url, '_blank').location
    },
    handleClose() {
      this.preview.noAttend = '';
      this.preview.attend = '';
      this.preview.date = "";
      this.preview.title = "";
      this.preview.content = "";
    },
    addNotAttend() {
      if (!this.nonAttendancePeople.userName) {
        this.$baseMessage('请选择缺席人员', 'warning')
      } else if (!this.nonAttendancePeople.reason) {
        this.$baseMessage('请输入缺席原因', 'warning')
      } else {
        let i
        //判断是否重复选取
        for (i = 0; i < this.form.nonAttendances.length; i++) {
          if (
            this.form.nonAttendances[i].userName ===
            this.nonAttendancePeople.userName
          ) {
            this.$baseMessage('请勿重复选取', 'warning')
            return
          }
        }
        //判断是否选取到出席人员
        for (i = 0; i < this.form.attendances.length; i++) {
          if (
            this.form.attendances[i] === this.nonAttendancePeople.userName
          ) {
            this.$baseMessage('错误选取，请确认', 'warning')
            return
          }
        }
        this.form.nonAttendances.push(this.nonAttendancePeople)
        this.nonAttendancePeople = {}
      }
    },
    deleteRow(index, item) {
      this.form.nonAttendances.splice(index, 1)
    },
    handleSee() {
      const moment = require('moment')
      if (this.form.date) {
        this.preview.date =
          moment(this.form.date).format('YYYY-MM-DD') + " " + moment(this.form.time).format('HH:mm')
      }
      //处理参与人员
      this.preview.attend = this.form.attendances.join(",")
      //处理未出席人员人员
      let arr = [];
      for (let i = 0; i < this.form.nonAttendances.length; i++) {
        arr.push(this.form.nonAttendances[i].userName)
      }
      this.preview.noAttend = arr.join(",")
      this.preview.content = this.form.content
      this.preview.title = this.form.title
    },
    async summitToBack() {
      const Loading = this.$baseColorfullLoading(1,"提交中，请勿刷新");
      this.form.files = this.fileList;
      Object.assign(this.summitForm, this.form)
      const moment = require('moment')
      this.summitForm.date = moment(this.form.date).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.summitForm.time = moment(this.form.time).format('HH:mm')
      await addRecord(this.summitForm)
      setTimeout(() => {
        Loading.close()
        this.$baseMessage('新增会议成功', 'success');
        this.$router.push("/")
      }, 1000)
    },

    async editToBack() {
      const Loading = this.$baseColorfullLoading(1,"提交中，请勿刷新");
      this.form.files = this.fileList;
      Object.assign(this.summitForm, this.form)
      const moment = require('moment')
      this.summitForm.date = moment(this.form.date).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.summitForm.time = moment(this.form.time).format('HH:mm')
      await editRecord(this.summitForm)
      setTimeout(() => {
        Loading.close()
        this.$baseMessage('修改会议成功', 'success');
        this.$router.push("/")
      }, 1000)
    },
    handleFinalSummit() {
      if (this.$route.query && this.$route.query.id) {
        this.editToBack();
      } else {
        this.summitToBack();
      }
    },
    handleSave() {
      this.$refs['form'].validate(async (valid) => {
        this.$refs.form.validateField('content', (errorMsg) => {
          this.borderColor = '#dcdfe6'
          if (errorMsg) {
            this.borderColor = '#F56C6C'
          }
        })
        if (valid) {
          this.handleSee();
          this.dialogTableVisible = true
        } else {
          this.$baseMessage('请检查输入', 'warning')
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.time-title {
  display: block;
  text-align: center;
}

.time-title {
  display: block;
  text-align: center;
}

.editor-container {
  .news {
    &-title {
      text-align: center;
    }

    &-content {
      ::v-deep {
        p {
          line-height: 30px;

          img {
            display: block;
            margin-right: auto;
            margin-left: auto;
          }
        }
      }
    }
  }

  .vab-quill-content {
    ::v-deep {
      .el-form-item__content {
        line-height: normal;
      }
    }
  }
}
</style>
