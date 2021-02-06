<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <header-tool v-model="queryParams.title" :name="searchTitle" :selections="selections" @insert="add" @update="edit(selections[0])" @delete="batchDelete" @search="search" />
    </div>
    <!-- 表格渲染 -->
    <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%" @selection-change="selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="pid" label="#" width="100" />
      <el-table-column prop="source.name" label="OJ" width="150" show-overflow-tooltip />
      <el-table-column prop="title" label="题目" show-overflow-tooltip />
      <el-table-column prop="level.name" label="难度" />
      <el-table-column prop="updatetime" label="更新时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.modifyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" type="info" @click="view(scope.row)" />
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)" />
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="singleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    <problem-view
      ref="view"
      :dialog-visible="userViewVisible"
      @close="viewClose"
    />
    <problem-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :dialog-title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import HeaderTool from '@/components/HeaderTool'
import ProblemView from './view'
import ProblemEdit from './edit'
import { isvalidPhone } from '@/utils/validate'
import { getProblems, getProblem, del } from '@/api/problemset/problem'

export default {
  name: 'Problems',
  components: { Pagination, HeaderTool, ProblemView, ProblemEdit },
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      searchTitle: '输入编号或名称搜索',
      queryParams: {},
      loading: false,
      total: 10,
      selections: [],
      pagination: {
        size: 5,
        current: 1
      },
      dialog: {
        isVisible: false,
        title: ''
      },
      userViewVisible: false,
      searchToggle: true,
      tableData: [],
      height: document.documentElement.clientHeight - 180 + 'px;',
      jobs: [],
      level: 3,
      roles: [],
      jobDatas: [],
      roleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [{ required: true, trigger: 'blur', validator: validPhone }]
      }
    }
  },
  created() {
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
      getProblems(params).then(res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    add() {
      this.dialog.title = '新增题目'
      this.dialog.isVisible = true
    },
    edit(data) {
      getProblem(data.pid).then(res => {
        data.problem = res
        this.$refs.edit.setProblem(data)
        this.dialog.title = '修改题目'
        this.dialog.isVisible = true
      })
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
    viewClose() {
      this.userViewVisible = false
    },
    view(row) {
      this.$refs.view.initData(row)
      this.userViewVisible = true
    },
    editClose() {
      this.dialog.isVisible = false
    },
    editSuccess() {
      this.search()
    },
    // 选择数据改变
    selectionChangeHandler(val) {
      this.selections = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
