<template>
  <div class="app-container">
    <el-form ref="form" :model="problem" :rules="rules" label-position="top" class="problem-content" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input ref="title" v-model="problem.title" placeholder="请输入内容" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :md="6" :xs="24">
          <el-form-item label="时间限制（ms）" prop="timeLimit">
            <el-input-number v-model.number="problem.timeLimit" :step="500" controls-position="right" :min="1" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :md="6" :xs="24">
          <el-form-item label="空间限制（MB）" prop="memoryLimit">
            <el-input-number v-model.number="problem.memoryLimit" :step="64" controls-position="right" :min="1" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :md="6" :xs="24">
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
        <el-col :md="6" :xs="24">
          <el-form-item label="难度" prop="difficulty">
            <el-select
              v-model="problem.difficulty"
              placeholder="请选择"
            >
              <el-option label="简单" :value="1" />
              <el-option label="一般" :value="2" />
              <el-option label="困难" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :md="6" :xs="24">
          <el-form-item label="题目权限" prop="auth">
            <el-select v-model="problem.auth" placeholder="请选择">
              <el-option label="公开" :value="1" />
              <el-option label="私有" :value="2" />
              <el-option label="比赛题目" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="18" :xs="24">
          <el-form-item label="标签">
            <el-select
              v-model="problemTags"
              value-key="id"
              allow-create
              filterable
              multiple
              placeholder="请选择"
              @change="changeTag"
            >
              <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="题目描述" prop="description">
        <md-editor v-model="problem.description" />
      </el-form-item>
      <el-form-item label="输入描述">
        <md-editor v-model="problem.input" />
      </el-form-item>
      <el-form-item label="输出描述">
        <md-editor v-model="problem.output" />
      </el-form-item>
      <el-form-item label="提示">
        <md-editor v-model="problem.hint" />
      </el-form-item>
      <div class="form-item-title">
        题目样例
        <el-popover placement="right" trigger="hover">
          <p>题目样例：请最好不要超过2个题目样例，题面样例不纳入评测数据。</p>
          <i slot="reference" class="el-icon-question" />
        </el-popover>
      </div>
      <el-form-item
        v-for="(example, index) in problem.examples"
        :key="'example'+index"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item :label="`输入样例${index+1}`" required>
              <el-input
                v-model="example.input"
                :rows="5"
                type="textarea"
                style="white-space: pre-line"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item :label="`输出样例${index+1}`" required>
              <el-input
                v-model="example.output"
                :rows="5"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          style="margin-top: 10px;"
          @click="deleteExample(index)"
        >删除样例</el-button>
      </el-form-item>
      <el-form-item class="add-example-btn">
        <el-button
          class="add-examples"
          icon="el-icon-plus"
          type="small"
          @click="addExample()"
        >新增题目样例
        </el-button>
      </el-form-item>
      <div class="form-item-title">
        评测样例
        <el-popover placement="right" trigger="hover">
          <p>评测数据：判题机对该题目的相关提交进行评测的数据来源。</p>
          <i slot="reference" class="el-icon-question" />
        </el-popover>
      </div>
      <el-form-item v-for="(problemCase, index) in problemCases" :key="'case'+index">
        <div>
          <el-row :gutter="20">
            <el-col :xs="24" :md="12">
              <el-form-item :label="`输入样例${index+1}`" required>
                <el-input
                  v-model="problemCase.inputCase"
                  :rows="5"
                  type="textarea"
                  style="white-space: pre-line"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12">
              <el-form-item :label="`输出样例${index+1}`" required>
                <el-input
                  v-model="problemCase.outputCase"
                  :rows="5"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px;">
            <el-col :xs="24" :md="12">
              <el-form-item>
                <span
                  style="margin-right: 10px; font-weight: bold;"
                >分数</span>
                <el-input-number
                  v-model="
                    problemCase.score"
                  controls-position="right"
                  size="mini"
                  :min="0"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12" style="mini-height=1px">
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="deleteCase(index)"
              >删除样例</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item class="add-example-btn">
        <el-button
          class="add-examples"
          icon="el-icon-plus"
          type="small"
          @click="addCase()"
        >新增评测样例
        </el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-row>
          <el-col :span="24">
            <el-checkbox
              v-model="spj"
            >使用特判代码</el-checkbox>
          </el-col>
        </el-row>
      </el-form-item> -->
      <el-form-item v-if="spj">
        <aceEditor
          id="ace-editor"
          class="code-editor"
          :value="code"
          @input="getCode"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="buttonLoading" @click="submitForm">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import MdEditor from '@/components/MdEditor'
import AceEditor from '@/components/AceEditor'
import { getProblemInfo } from '@/api/problemset/problem'
import { getAll } from '@/api/problemset/tag'
import { getAllSource } from '@/api/problemset/source'
import { add, update, getProblemCase } from '@/api/problemset/problem'
import { stringToExamples, examplesToString } from '@/utils/string'

export default {
  name: 'ContestProblemEdit',
  components: { MdEditor, AceEditor },
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
      buttonLoading: false,
      tagDatas: [],
      // 所有的题目来源信息
      sources: [],
      // 所有的题目标签
      tags: [],
      // 题目的标签信息
      problemTags: [],
      // 题目来源
      problemSource: {
        id: null,
        name: ''
      },
      // 评测机样例
      problemCases: [],
      // 是否使用特判代码
      spj: false,
      code: '',
      // 题目信息
      problem: {
        pid: null,
        sourceId: null,
        title: '',
        author: '',
        difficulty: 1,
        auth: 1,
        timeLimit: 1000,
        memoryLimit: 256,
        description: '',
        input: '',
        output: '',
        examples: [], // 传到后端要把数组转化为字符串
        hint: '',
        specialCode: '',
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
        timeLimit: [
          { required: true, type: 'number', min: 1, message: '时间不得小于1ms', trigger: 'blur' }
        ],
        memoryLimit: [
          { required: true, type: 'number', min: 1, message: '空间不能小于1MB', trigger: 'blur' }
        ],
        sourceId: [
          { required: true, message: '请选择题目来源', trigger: 'blur' }
        ],
        difficulty: [
          { required: true, message: '请选择题目难度', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入问题描述', trigger: 'blur' }
        ],
        auth: [
          { required: true, message: '请选择题目权限', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    $route() {
      this.$refs.form.resetFields()
      if (this.$route.params.pid) {
        this.init(this.$route.params.pid)
      }
    }
  },
  mounted() {
    this.$refs.title.focus()
    if (this.$route.params.pid) {
      this.init(this.$route.params.pid)
    }
    this.getAllTags()
    this.getAllSources()
  },
  methods: {
    // 如果是编辑，初始化表单数据
    init(pid) {
      // 获取题目详情
      getProblemInfo(pid).then(res => {
        this.problem = res.problem
        this.problemTags = res.tags
        this.problemSource = res.source
        // 如果存在特判代码，则显示代码编辑器
        if (this.problem.specialCode) {
          this.spj = true
        }
        // 转化题目样例 字符串-->数组
        this.problem.examples = stringToExamples(res.problem.examples)
      })
      // 获取评测样例
      getProblemCase(pid).then(res => {
        this.problemCases = res
      })
    },
    // 将数据设置到表单中
    setProblem(row) {
      this.problem = row.problem
    },
    changeTag() {
      const tagList = this.problemTags
      if (tagList.length > 0) {
        if (typeof (tagList[tagList.length - 1]) === 'string') {
          tagList.push({ name: tagList.pop() })
        }
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.buttonLoading = true
          // 转化样例
          const problemDto = {}
          problemDto['problem'] = Object.assign({}, this.problem) // 深克隆
          problemDto.problem.examples = examplesToString(this.problem.examples)
          problemDto['problemCases'] = this.problemCases
          problemDto['tags'] = this.problemTags
          if (!this.problem.pid) { // 新增
            add(problemDto).then(res => {
              this.buttonLoading = false
              this.$message({
                message: '新增题目成功',
                type: 'success'
              })
              this.$router.push({ name: 'Problems' })
            }).catch(() => {
              this.buttonLoading = false
            })
          } else { // 更新
            update(problemDto).then(res => {
              this.buttonLoading = false
              this.$message({
                message: '修改题目成功',
                type: 'success'
              })
              this.$router.push({ name: 'Problems' })
            }).catch(() => {
              this.buttonLoading = false
            })
          }
        } else {
          this.$message({
            message: '请检查表单是否填写正确',
            type: 'error'
          })
          return false
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'Problems' })
    },
    getAllTags() {
      getAll().then(res => {
        this.tags = res
      }).catch(() => {})
    },
    getAllSources() {
      getAllSource().then(res => {
        this.sources = res
      }).catch(() => {})
    },
    // 添加题目样例
    addExample() {
      this.problem.examples.push({ input: '', output: '' })
    },
    // 删除题目样例
    deleteExample(index) {
      this.problem.examples.splice(index, 1)
    },
    // 添加评测样例
    addCase() {
      this.problemCases.push({
        pid: this.problem.pid,
        inputCase: '',
        outputCase: '',
        score: 0
      })
    },
    // 删除评测样例
    deleteCase(index) {
      this.problemCases.splice(index, 1)
    },
    // 获取编辑器的代码
    getCode(code) {
      this.problem.specialCode = code
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
.form-item-title {
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px;
  color: #409eff;
}
.add-examples {
  width: 100%;
  background-color: #fff;
  border: 1px dashed #2d8cf0;
  outline: none;
  cursor: pointer;
  color: #2d8cf0;
  height: 35px;
  font-size: 14px;
}
.add-examples i {
  margin-right: 10px;
}
.add-examples:hover {
  border: 0px;
  background-color: #2d8cf0 !important;
  color: #fff;
}
.add-example-btn {
  margin-bottom: 10px;
}
.add-samples {
  width: 100%;
  background-color: #fff;
  border: 1px dashed #19be6b;
  outline: none;
  cursor: pointer;
  color: #19be6b;
  height: 35px;
  font-size: 14px;
}
.add-samples i {
  margin-right: 10px;
}
.add-samples:hover {
  border: 0px;
  background-color: #19be6b !important;
  color: #fff;
}
.add-sample-btn {
  margin-bottom: 10px;
}
.code-editor {
  width: 100%;
  border: #b7b7b7 1px solid;
}
</style>
