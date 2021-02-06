<template>
  <el-dialog
    :title="dialogTitle"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="problem" :rules="rules" label-position="top" class="problem-content" label-width="80px">
      <el-form-item label="题目名称" prop="title">
        <el-input v-model="problem.title" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="时间限制" prop="problemInfo.timeLimit">
        <el-input v-model.number="problem.problemInfo.timeLimit" placeholder="请输入内容，单位（ms）" />
      </el-form-item>
      <el-form-item label="空间限制" prop="problemInfo.memoryLimit">
        <el-input v-model.number="problem.problemInfo.memoryLimit" placeholder="请输入内容，单位（MB）" />
      </el-form-item>
      <el-form-item label="问题描述" prop="problemInfo.description">
        <el-tinymce v-model="problem.problemInfo.description" :height="200" />
      </el-form-item>
      <el-form-item label="输入格式" prop="problemInfo.inputFormat">
        <el-tinymce v-model="problem.problemInfo.inputFormat" :height="200" />
      </el-form-item>
      <el-form-item label="输入格式" prop="problemInfo.outputFormat">
        <el-tinymce v-model="problem.problemInfo.outputFormat" :height="200" />
      </el-form-item>
      <el-form-item label="数据范围" prop="problemInfo.dataRange">
        <el-tinymce :value="problem.problemInfo.dataRange" :height="150" />
      </el-form-item>
      <el-row>
        <el-col :xs="24" :sm="8">
          <el-form-item label="标签" prop="tagIds">
            <el-select
              v-model="problem.tagIds"
              filterable
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in tags"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-form-item label="难度" prop="levelId">
            <el-select
              v-model="problem.levelId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in levels"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-form-item label="来源OJ" prop="sourceId">
            <el-select
              v-model="problem.sourceId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sources"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="输入样例" prop="problemInfo.inputCase">
        <el-input
          v-model="problem.problemInfo.inputCase"
          type="textarea"
          autosize
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="输出样例" prop="problemInfo.outputCase">
        <el-input
          v-model="problem.problemInfo.outputCase"
          type="textarea"
          autosize
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="提示" prop="problemInfo.hint">
        <el-input
          v-model="problem.problemInfo.hint"
          type="textarea"
          autosize
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" size="mini" @click="isVisible = false">取消</el-button>
      <el-button type="primary" size="mini" :loading="buttonLoading" @click="submitForm">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import ElTinymce from '@/components/ElTinymce'
import { getAll } from '@/api/problemset/tag'
import { getSourceAll } from '@/api/problemset/source'
import { getLevelAll } from '@/api/problemset/level'
import { add, update } from '@/api/problemset/problem'
let problemTags = []

export default {
  name: 'ProblemEdit',
  components: { ElTinymce },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      screenWidth: 0,
      width: this.initWidth(),
      buttonLoading: false,
      tags: [], tagDatas: [],
      sources: [],
      levels: [],
      problem: {
        title: '',
        tagIds: [],
        sourceId: '',
        levelId: '',
        problemInfo: {
          id: '',
          description: '',
          timeLimit: '',
          memoryLimit: '',
          inputFormat: '',
          outputFormat: '',
          intputCase: '',
          outputCase: '',
          dataRange: '',
          hint: ''
        }
      },
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' }
        ],
        [`problemInfo.timeLimit`]: [
          { required: true, type: 'number', min: 1000, message: '时间不得小于1000ms', trigger: 'blur' }
        ],
        [`problemInfo.memoryLimit`]: [
          { required: true, type: 'number', min: 64, message: '空间不能小于64MB', trigger: 'blur' }
        ],
        [`problemInfo.description`]: [
          { required: true, message: '请输入问题描述', trigger: 'blur' }
        ],
        levelId: [
          { required: true, message: '请选择题目难度', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
        this.reset()
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
    this.initTags()
    this.initSources()
    this.initLevels()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    // 将数据设置到表单中
    setProblem(row) {
      this.problem = row.problem
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '90%'
      } else {
        return '800px'
      }
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      // 清空对象
      const problem = {
        title: '',
        tagIds: [],
        sourceId: '',
        levelId: '',
        problemInfo: {
          id: '',
          description: '',
          timeLimit: '',
          memoryLimit: '',
          inputFormat: '',
          outputFormat: '',
          intputCase: '',
          outputCase: '',
          dataRange: '',
          hint: ''
        }
      }
      this.problem = problem
    },
    resetEditor() {
      this.problem.description = ''
      this.problem.problemInfo.timeLimit = ''
      this.problem.problemInfo.memoryLimit = ''
      this.problem.problemInfo.inputFormat = ''
      this.problem.problemInfo.outputFormat = ''
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.buttonLoading = true
          if (!this.problem.pid) { // 新增
            add(this.problem).then(res => {
              this.buttonLoading = false
              this.isVisible = false
              this.$message({
                message: '新增题目成功',
                type: 'success'
              })
            })
          } else { // 更新
            update(this.problem).then(res => {
              this.buttonLoading = false
              this.isVisible = false
              this.$message({
                message: '修改题目成功',
                type: 'success'
              })
            })
          }
        } else {
          return false
        }
      })
    },
    initTags() {
      getAll().then(res => {
        this.tags = res
      }).catch(() => {})
    },
    initSources() {
      getSourceAll().then(res => {
        this.sources = res
      }).catch(() => {})
    },
    initLevels() {
      getLevelAll().then(res => {
        this.levels = res
      }).catch(() => {})
    },
    changeTag(value) {
      problemTags = []
      value.forEach(function(data, index) {
        const tag = { id: data }
        problemTags.push(tag)
      })
    }
  }
}
</script>
<style scoped>
  .problem-content {
    margin:0 auto;
    width: 100%;
  }
  .box-card {
    margin:10px;
  }
  .form-button {
    float: right;
    margin-top: 10px;
  }
</style>
