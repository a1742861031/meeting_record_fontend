<template>
  <div class="user-activity">
    <div class="post" v-for="record in records" :key="record.id">
      <div class="user-block">
        <img class="img-circle"
             :src=record.userAvatar>
        <span class="username text-muted"><a @click="getRecordById(record.id)" class="title">{{
            record.title
          }}</a></span>
        <span class="description">{{ record.recorder + "记录的" + record.date + "  " + record.time + "的会议" }}</span>
      </div>
      <p>
        {{ record.content }}
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <vab-icon :icon="['fas', 'eye']"></vab-icon>
            {{ "    " + record.readNum + " 浏览" }}
          </span>
        </li>
        <li @click="getToEdit(record.id)" v-if="isAdmin==1||username==record.recorder">
          <span class="link-black text-sm">
            <vab-icon :icon="['fas', 'edit']"></vab-icon>
            编辑
          </span>
        </li>
      </ul>
    </div>
    <el-pagination :page-size="page.limit" :total="total" layout="prev, pager, next,total"
                   @current-change="currentChange"></el-pagination>
    <!--会议详情dialog-->
    <el-dialog title="会议详情" :visible.sync="dialogTableVisible">
      <div class="main" style="min-height: 50vh" id="detailRecord">
        <h1 class="news-title">{{ detailRecord.title }}</h1>
        <span class="time-title">{{ detailRecord.date }}</span>
        <span class="time-title" v-if="detailRecord.attend">
          出席人员：{{ detailRecord.attend }}
        </span>
        <span class="time-title" v-if="detailRecord.noAttend">
          缺席人员：{{ detailRecord.noAttend }}
        </span>
        <div class="news-content" v-html="detailRecord.content"></div>
        <div v-for="file in detailRecord.files" :key="file.url">
          <a :href="file.url">{{file.filename }}</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="downLoadPdf(detailRecord.title)" type="primary">下载为PDF</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRecordList, getRecordById} from '@/api/server/record'
import moment from "_moment@2.29.1@moment";
import htmlToPdf from '@/utils/htmlToPdf';
import {mapGetters} from "vuex";

export default {

  data() {
    return {
      page: {
        current: 1,
        limit: 3,
      },
      records: [],
      total: 0,
      detailRecord: {},//会议详情
      dialogTableVisible: false
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      isAdmin: 'user/isAdmin'
    }),
  },
  created() {
    this.getRecords();
    console.log("管理员:", this.isAdmin)
  },
  methods: {
    async getRecords() {
      const {data} = await getRecordList(this.page.current, this.page.limit);
      this.total = data.total;
      this.records = data.records;
      this.records.forEach(item => {
        if (item.content.length > 30) {
          item.content = item.content.substr(0, 50) + '...'
        }
        item.date = item.date.substr(0, item.date.indexOf("T"));
      })
    },
    currentChange(val) {
      this.page.current = val
      this.getRecords()
    },
    getToEdit(id) {
      this.$router.push({path: '/edit', query: {id: id}})
    },
    async getRecordById(id) {
      const {data} = await getRecordById(id);
      const moment = require('moment')
      if (data.date) {
        this.detailRecord.date =
          moment(data.date).format('YYYY-MM-DD') + " " + data.time
      }
      this.detailRecord.nonAttend = []
      for (let i = 0; i < data.nonAttend.length; i++) {
        let str = data.nonAttend[i].userName + "（" + data.nonAttend[i].reason + "）"
        this.detailRecord.nonAttend.push(str)
      }
      this.detailRecord.noAttend = this.detailRecord.nonAttend.join(",")
      //处理参与人员
      this.detailRecord.attend = data.attend.join(",")
      this.detailRecord.content = data.content
      this.detailRecord.title = data.title
      this.dialogTableVisible = true;
      this.detailRecord.files = data.files
    },
    downLoadPdf(fileName) {
      htmlToPdf.downloadPDF(document.querySelector('#detailRecord'), fileName);
    }
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .title {
      margin-top: 30px;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }

}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.news {
  &-title {
    text-align: center;
  }
}

.time-title {
  display: block;
  text-align: center;
}
</style>
