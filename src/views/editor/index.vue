<template>
  <div class="editor-container">
    <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="100px">
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
        <el-input placeholder="请输入请假原因" v-model="nonAttendancePeople.reason" class="input-with-select"
                  style="width: 500px">
          <el-select v-model="nonAttendancePeople.userName" slot="prepend" placeholder="请选择" style="width:100px">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                       :value="item.userName"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-plus" @click="addNotAttend"></el-button>
        </el-input>
      </el-form-item>
      <el-table
        :data="form.nonAttendances"
        style="width: 50%"
        max-height="250">
        <el-table-column
          prop="userName"
          label="姓名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="reason"
          label="缺席原因"
          width="300"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, form.nonAttendance)"
              type="text"
              size="small">
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
      <el-form-item>
        <el-button type="primary" @click="handleSee">预览效果</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="预览效果" :visible.sync="dialogTableVisible">
      <div style="min-height: 60vh">
        <h1 class="news-title">{{ form.title }}</h1>
        <div class="news-content" v-html="form.content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vabQuill from '@/plugins/vabQuill'
import {getAllUser} from '@/api/server/user'
import {addRecord} from '@/api/server/record'
export default {
  name: 'Editor',
  components: {vabQuill},


  data() {
    return {
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
      },
    }
  },
  async created() {
    const {data} = await getAllUser()
    this.userList = data
    this.userList2 = data;
  },
  methods: {
    addNotAttend() {
      if (!this.nonAttendancePeople.userName) {
        this.$baseMessage('请选择缺席人员', 'warning')

      } else if (!this.nonAttendancePeople.reason) {
        this.$baseMessage('请输入缺席原因', 'warning')
      } else {
        let i;
        //判断是否重复选取
        for (i = 0; i < this.form.nonAttendances.length; i++) {
          if (this.form.nonAttendances[i].userName === this.nonAttendancePeople.userName) {
            this.$baseMessage('请勿重复选取', 'warning')
            return
          }
        }
        //判断是否选取到出席人员
        for (i = 0; i < this.form.attendances.length; i++) {
          if (this.form.attendances[i] === this.nonAttendancePeople.userName) {
            this.$baseMessage('错误选取，请确认', 'warning')
            return;
          }
        }
        this.form.nonAttendances.push(this.nonAttendancePeople);
        this.nonAttendancePeople = {};
      }
    },
    deleteRow(index, item){
      this.form.nonAttendance.splice(index,1)
    },
    handleSee() {
      this.$refs['form'].validate((valid) => {
        this.$refs.form.validateField('content', (errorMsg) => {
        })
        if (valid) {
          this.dialogTableVisible = true
        } else {
          return false
        }
      })
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
          const moment = require('moment')

          this.form.date = moment(this.form.date).format('YYYY-MM-DD HH:mm:ss')
          this.form.time = moment(this.form.time).format('HH:mm')
         await addRecord(this.form);
         this.$baseMessage("新增会议成功",'success');
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
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
