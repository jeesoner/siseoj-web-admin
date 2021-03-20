<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <header-tool
        v-model="queryParams.keyword"
        :name="searchTitle"
        :selections="selections"
        :crud-button="false"
        @search="search"
      >
      </header-tool>
      <el-button size="mini" type="primary" @click="add(contestId)">比赛题目列表</el-button>
    </div>
    <!-- 表格渲染 -->
    <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%" @selection-change="selectionChangeHandler">
      <el-table-column prop="pid" label="ID" min-width="100" />
      <el-table-column prop="title" label="题目" min-width="150" show-overflow-tooltip />
      <el-table-column prop="author" label="作者" min-width="150" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" min-width="150">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.modifyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="auth" label="权限" min-width="130">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.auth"
            size="small"
            :disabled="scope.row.auth == 3"
            @change="changeProblemAuth(scope.row)"
          >
            <el-option label="公开" :value="1" />
            <el-option label="私有" :value="2" />
            <el-option label="比赛题目" :value="3" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="edit(contestId, scope.row.pid)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="dialog.isVisible"
      :title="dialog.title"
      width="820px"
      @close="editClose"
    >
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-position="top">
        <el-row style="margin-bottom: 10px">
          <el-col :span="1"><div style="font-weight: bold; text-align: center">Num</div></el-col>
          <el-col :span="6"><div style="font-weight: bold; text-align: center">题目ID</div></el-col>
          <el-col :span="6"><div style="font-weight: bold; text-align: center">标题</div></el-col>
          <el-col :span="6"><div style="font-weight: bold; text-align: center">别名</div></el-col>
          <el-col :span="3"><div style="font-weight: bold; text-align: center">分数</div></el-col>
          <el-col :span="2"><div style="font-weight: bold; text-align: center">操作</div></el-col>
        </el-row>
        <el-row v-for="(contestProblem, index) in form.contestProblems" :key="contestProblem.pid">
          <el-col :span="1" style="text-align: center">
            <el-form-item>
              {{ String.fromCharCode(index + 65) }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="pid">
              <el-select
                v-model="contestProblem.pid"
                clearable
                filterable
                remote
                placeholder="请输入题目号或名称"
                :remote-method="remoteMethod"
                :loading="selectLoading"
                @change="selectChange($event, index)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.pid"
                  :label="item.label"
                  :value="item.pid"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="title">
              <el-input v-model="contestProblem.title" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="displayTitle">
              <el-input v-model="contestProblem.displayTitle" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="score">
              <el-input v-model.number="contestProblem.score" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button size="mini" icon="el-icon-delete" type="danger" @click="delItem(index)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-col :span="2">
            <el-button size="mini" icon="el-icon-plus" type="primary" @click="addItem" />
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" size="mini" @click="editClose">取消</el-button>
        <el-button :loading="dialog.status" size="mini" type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import HeaderTool from '@/components/HeaderTool'
import { getProblems, updateAuth, del } from '@/api/problemset/problem'
import contestApi from '@/api/contest/contest'

export default {
  name: 'ContestProblems',
  components: { Pagination, HeaderTool },
  data() {
    return {
      tagName: '',
      searchTitle: '输入编号或名称搜索',
      queryParams: {},
      loading: false,
      selectLoading: false,
      total: 0,
      selections: [],
      pagination: {
        size: 10,
        current: 1
      },
      searchToggle: true,
      tableData: [],
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      contestId: this.$route.params.contestId,
      // 对话框数据
      dialog: {
        title: '',
        isVisible: false,
        status: false
      },
      options: [],
      form: {
        contestProblems: []
      },
      rules: {},
      list: [
        { pid: 1, title: 'A+B' },
        { pid: 2, title: 'C' },
        { pid: 3, title: 'D' },
        { pid: 4, title: 'SDFd' }
      ]
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    toggleSearch() {
      this.searchToggle = !this.searchToggle
    },
    search() {
      this.fetch({
        ...this.queryParams
      })
    },
    fetch(params = {}) {
      params.size = this.pagination.size
      params.current = this.pagination.current
      this.loading = true
      // 分页查询
      contestApi.getProblems(this.contestId, params).then(res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增比赛题目
    add(contestId) {
      this.dialog.title = '比赛题目列表'
      contestApi.getContestProblem(contestId).then(res => {
        this.form.contestProblems = res
      })
      this.dialog.isVisible = true
    },
    // 编辑题目
    edit(contestId, pid) {
      this.$router.push({ name: 'ContestProblemEdit', params: { contestId, pid }})
    },
    batchDelete() {
      if (!this.selections.length) {
        this.$message({
          message: '请先选择需要操作的数据',
          type: 'warning'
        })
        return
      }
      this.$confirm('选中数据将被永久删除, 是否继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('del')
        const tagIds = this.selections.map(item => {
          return item.id
        })
        this.delete(tagIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    singleDelete(data) {
      this.$refs.table.toggleRowSelection(data, true)
      this.batchDelete()
    },
    delete(ids) {
      this.loading = true
      del(ids).then(() => {
        this.loading = false
        this.$message({
          message: '删除题目成功',
          type: 'success'
        })
        this.search()
      })
    },
    editClose() {
      this.dialog.isVisible = false
      this.dialog.status = false
      this.form = {
        contestProblems: []
      }
    },
    editSuccess() {
      this.search()
    },
    // 选择数据改变
    selectionChangeHandler(val) {
      this.selections = val
    },
    changeProblemAuth(row) {
      const problem = {
        pid: row.pid,
        auth: row.auth
      }
      updateAuth(problem).then(res => {
        this.$message({
          type: 'success',
          message: '修改题目权限成功'
        })
      })
    },
    submitForm() {
      this.dialog.status = true
      const dto = {
        contestProblems: this.form.contestProblems,
        cid: this.$route.params.contestId
      }
      contestApi.updateContestProblem(dto).then(() => {
        this.editClose()
        this.$message.success('修改比赛题目列表成功')
        this.editSuccess()
      })
    },
    // 处理对话框的增加项目
    addItem() {
      this.form.contestProblems.push({
        pid: null,
        cid: this.$route.params.contestId,
        title: '',
        displayTitle: '',
        score: 0
      })
    },
    // 处理对话框的删除项目
    delItem(index) {
      this.form.contestProblems.splice(index, 1)
    },
    remoteMethod(query) {
      if (query !== '') {
        this.selectLoading = true
        const params = {
          size: 9999,
          current: 1,
          keyword: query
        }
        getProblems(params).then(res => {
          this.selectLoading = false
          if (res.records) {
            this.options = res.records.map(item => {
              return { pid: item.pid, label: `${item.pid}: ${item.title}`, title: item.title }
            })
          }
        }).catch(() => {
          // 查询错误
        })
      }
    },
    selectChange(event, index) {
      this.options.forEach((val) => {
        if (val.pid === event) {
          this.form.contestProblems[index].title = val.title
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
