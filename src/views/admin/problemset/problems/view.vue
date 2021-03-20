<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible.sync="isVisible"
    class="user-view"
  >
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-user" /> <span>题号：</span> {{ problem.pid }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-suitcase" /> <span>题目名：</span> {{ problem.title }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-trophy" /> <span>难度：</span> {{ problem.level ? problem.level.name : 'N/A' }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-phone-outline" /> <span>来源OJ：</span> {{ problem.source ? problem.source.name : 'N/A' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-star-off" />
          <span>标签：</span>
          <span v-for="(u, i) in problem.tags" :key="i">{{ u.name }}&ensp;</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-bangzhu" /> <span>作者：</span> {{ problem.author }}
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-time" /> <span>题目描述：</span>
          <div class="item-card" v-html="problemInfo.description" />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="problemInfo.inputFormat" :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-time" /> <span>输入格式：</span>
          <div class="item-card" v-html="problemInfo.inputFormat" />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="problemInfo.outputFormat" :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-brush" /> <span>输出格式:</span>
          <div class="item-card" v-html="problemInfo.outputFormat" />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="problemInfo.inputCase" :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-time" /> <span>输入样例：</span>
          <div class="item-card" v-html="problemInfo.inputCase" />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="problemInfo.outputCase" :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-brush" /> <span>输出样例:</span>
          <div class="item-card" v-html="problemInfo.outputCase" />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="problemInfo.dataRange" :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-brush" /> <span>数据范围:</span>
          <div class="item-card" v-html="problemInfo.dataRange" />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="problemInfo.hint" :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-brush" /> <span>提示:</span>
          <div class="item-card">
            {{ problemInfo.hint }}
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-time" /> <span>时间限制：</span> {{ problemInfo.timeLimit }}&ensp;ms
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-brush" /> <span>空间限制:</span> {{ problemInfo.memoryLimit }}&ensp;MB
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-time" /> <span>创建时间：</span> {{ problem.createTime }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-brush" /> <span>修改时间：</span> {{ problem.modifyTime }}
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getProblemInfo } from '@/api/problemset/problem'

export default {
  name: 'UserView',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '题目详情',
      screenWidth: 0,
      width: this.initWidth(),
      problem: {},
      problemInfo: {}
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
      }
    },
    avatar() {
      return require('@/assets/images/avatar.png')
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    transSex(sex) {
      switch (sex) {
        case '0':
          return 'common.sex.male'
        case '1':
          return 'common.sex.female'
        default:
          return 'common.sex.secret'
      }
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 550) {
        return '95%'
      } else if (this.screenWidth < 990) {
        return '580px'
      } else if (this.screenWidth < 1400) {
        return '600px'
      } else {
        return '650px'
      }
    },
    // 初始化数据
    initData(val) {
      getProblemInfo(val.pid).then(res => {
        this.problem = res
        this.problemInfo = res.problemInfo
      })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-view {
    .img-wrapper {
      text-align: center;
      margin-top: -1.5rem;
      margin-bottom: 10px;
      img {
        width: 4rem;
        border-radius: 50%;
      }
    }
    .view-item {
      margin: 7px;
      i {
        font-size: .97rem;
      }
      span {
        margin-left: 5px;
      }
      .item-card {
        margin-top: 5px;
        margin-bottom: 10px;
      }
    }
  }

</style>
