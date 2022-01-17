<template>
  <div class="user-activity">
    <div class="post" v-for="record in records" :key="record.id">
      <div class="user-block">
        <img class="img-circle"
             :src=record.userAvatar>
        <span class="username text-muted"><a @click="gotoDetail" class="title">{{ record.title }}</a></span>
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
      </ul>
    </div>
    <el-pagination :page-size="page.limit" :total="total" layout="prev, pager, next,total"
                   @current-change="currentChange"></el-pagination>
  </div>
</template>

<script>
import {getRecordList} from '@/api/server/record'

export default {
  data() {
    return {
      page: {
        current: 1,
        limit: 3,
      },
      records: [],
      total: 0,
    }
  },
  created() {
    this.getRecords();
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
      console.log(this.records)
    },
    currentChange(val) {
      this.page.current = val

      this.getRecords()
    },
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
</style>
