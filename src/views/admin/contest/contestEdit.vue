<template>
  <div class="app-container">
    <el-form ref="form" :model="contest" :rules="rules" label-position="top" class="problem-content" label-width="80px">
      <el-form-item label="比赛标题" prop="title">
        <el-input ref="title" v-model="contest.title" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="比赛说明">
        <md-editor v-model="contest.description" />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :md="8" :xs="24">
          <el-form-item label="比赛开始时间" prop="startTime">
            <el-date-picker
              v-model="contest.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请输入比赛开始时间"
              default-time="00:00:00"
              :picker-options="expireTimeOption"
              @change="changeDuration"
            />
          </el-form-item>
        </el-col>
        <el-col :md="8" :xs="24">
          <el-form-item label="比赛结束时间" prop="endTime">
            <el-date-picker
              v-model="contest.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              placeholder="请输入比赛结束时间"
              :picker-options="expireTimeOption"
              @change="changeDuration"
            />
          </el-form-item>
        </el-col>
        <el-col :md="8" :xs="24">
          <el-form-item label="比赛时间" required>
            <el-input v-model="durationText" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :md="8" :xs="24">
          <el-form-item label="比赛类型" required>
            <el-radio v-model="contest.type" class="radio" :label="0" :disabled="disableRuleType">普通比赛</el-radio>
            <el-radio v-model="contest.type" class="radio" :label="1" :disabled="disableRuleType">Rating比赛</el-radio>
          </el-form-item>
        </el-col>
        <el-col v-if="contest.sealRank" :md="8" :xs="24">
          <el-form-item label="封榜">
            <el-switch
              v-model="contest.sealRank"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
        </el-col>

        <el-col v-else :md="16" :xs="24">
          <el-form-item label="封榜">
            <el-switch
              v-model="contest.sealRank"
              active-color="#13ce66"
              inactive-color=""
            />
          </el-form-item>
        </el-col>

        <el-col :md="8" :xs="24">
          <el-form-item v-show="contest.sealRank" label="封榜时间" :required="contest.sealRank">
            <el-select v-model="seal_rank_time">
              <el-option label="比赛结束前半小时" :value="0" :disabled="contest.duration<1800" />
              <el-option label="比赛结束前一小时" :value="1" :disabled="contest.duration<3600" />
              <el-option label="比赛全程时间" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="8" :xs="24">
          <el-form-item label="比赛权限" required>
            <el-select v-model="contest.auth">
              <el-option label="公开赛" :value="0" />
              <el-option label="私有赛" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="8" :xs="24">
          <el-form-item v-show="contest.auth !== 0" label="比赛密码" :required="contest.auth !== 0">
            <el-input v-model="contest.password" placeholder="请输入比赛密码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="buttonLoading" @click="submitForm">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MdEditor from '@/components/MdEditor'
import time from '@/utils/time'
import moment from 'moment'
import contestApi from '@/api/contest/contest'

export default {
  name: 'ContestEdit',
  components: { MdEditor },
  data() {
    return {
      buttonLoading: false,
      problem: {},
      contest: {
        id: null,
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        duration: 0,
        type: 0,
        password: null,
        sealRank: false,
        sealRankTime: 0, // 封榜时间
        auth: 0
      },
      durationText: '', // 提示文本
      seal_rank_time: 0,
      disableRuleType: false,
      rules: {
        title: [
          { required: true, message: '请输入比赛名称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '比赛开始时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '比赛结束时间不能为空', trigger: 'blur' }
        ]
      },
      expireTimeOption: {
        disabledDate(date) {
          // 设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      }
    }
  },
  watch: {
    $route() {
      if (this.$route.params.contestId) {
        this.disableRuleType = false
      } else {
        this.disableRuleType = true
        this.contest = {}
      }
    }
  },
  mounted() {
    // 如果有比赛ID，初始化数据
    if (this.$route.params.contestId) {
      this.getContestDetail(this.$route.params.contestId)
    }
  },
  methods: {
    // 计算比赛时间
    changeDuration() {
      const start = this.contest.startTime
      const end = this.contest.endTime
      const durationMS = time.durationMs(start, end)
      if (durationMS < 0) {
        this.durationText = '比赛起始时间不应该晚于结束时间！'
        this.contest.duration = 0
        return
      }
      if (start !== '' && end !== '') {
        this.durationText = time.duration(start, end)
        this.contest.duration = durationMS
      }
    },
    // API
    getContestDetail(id) {
      contestApi.get(id).then(res => {
        this.contest = res
        this.changeDuration()
        // 封榜时间转化
        const halfHour = moment(this.contest.endTime).subtract(1800, 'seconds').toString()
        const oneHour = moment(this.contest.endTime).subtract(3600, 'seconds').toString()
        const allHour = moment(this.contest.startTime).toString()
        const sealRankTime = moment(this.contest.sealRankTime).toString()
        switch (sealRankTime) {
          case halfHour:
            this.seal_rank_time = 0
            break
          case oneHour:
            this.seal_rank_time = 1
            break
          case allHour:
            this.seal_rank_time = 2
            break
        }
      })
    },
    // 按钮方法组
    cancel() {
      this.$router.push({ name: 'ContestList' })
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.buttonLoading = true
          if (this.contest.sealRank) {
            // 封榜时间转化
            switch (this.seal_rank_time) {
              case 0: // 结束前半小时
                this.contest.sealRankTime = moment(this.contest.endTime).subtract(1800, 'seconds')
                break
              case 1: // 结束前一小时
                this.contest.sealRankTime = moment(this.contest.endTime).subtract(3600, 'seconds')
                break
              case 2: // 全程
                this.contest.sealRankTime = moment(this.contest.startTime)
            }
          } else {
            this.contest.sealRankTime = null
          }
          if (!this.contest.id) { // 新增
            contestApi.add(this.contest).then(() => {
              this.buttonLoading = false
              this.$message.success('新增比赛成功')
              this.$router.push({ name: 'ContestList' })
            }).catch(() => {
              this.buttonLoading = false
            })
          } else { // 更新
            contestApi.edit(this.contest).then(() => {
              this.buttonLoading = false
              this.$message.success('修改比赛成功')
              this.$router.push({ name: 'ContestList' })
            }).catch(() => {
              this.buttonLoading = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
