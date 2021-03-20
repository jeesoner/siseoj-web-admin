<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <header-tool
        v-model="queryParams.keyword"
        :name="searchTitle"
        :selections="selections"
        @insert="add"
        @update="edit(selections[0])"
        @delete="batchDelete"
        @search="search"
      >
        <el-input v-model="tagName" clearable size="small" placeholder="输入题目标签" style="width: 200px; margin-left: 5px;" class="filter-item" />
      </header-tool>
    </div>
    <!-- 表格渲染 -->
    <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%" @selection-change="selectionChangeHandler">
      <el-table-column type="selection" width="55" />
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
            <el-option
              label="比赛题目"
              :value="3"
              disabled
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="edit(scope.row)" />
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="singleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import HeaderTool from '@/components/HeaderTool'
import { getProblems, updateAuth, del } from '@/api/problemset/problem'

export default {
  name: 'Problems',
  components: { Pagination, HeaderTool },
  data() {
    return {
      tagName: '',
      searchTitle: '输入编号或名称搜索',
      queryParams: {},
      loading: false,
      total: 0,
      selections: [],
      pagination: {
        size: 10,
        current: 1
      },
      dialog: {
        isVisible: false,
        title: ''
      },
      searchToggle: true,
      tableData: [],
      height: document.documentElement.clientHeight - 180 + 'px;',
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      }
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
      getProblems(params).then(res => {
        console.log(res.records)
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    add() {
      this.$router.push({ name: 'ProblemEdit' })
    },
    // 编辑题目
    edit(data) {
      this.$router.push({ name: 'ProblemEdit', params: { pid: data.pid }})
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
