<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <header-tool v-model="queryParams.title" :name="searchTitle" :selections="selections" @insert="addBtn" @update="editBtn(selections[0])" @delete="batchDelete" @search="search" />
    </div>
    <!-- 表格渲染 -->
    <el-table :key="tableKey" ref="table" v-loading="loading" :data="tableData" style="width: 100%" @selection-change="selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名称" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="editBtn(scope.row)" />
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="singleDelete(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog.isVisible" :title="dialog.title" width="570px" @close="editClose">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" size="mini" @click="editClose">取消</el-button>
        <el-button :loading="dialog.status" size="mini" type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import HeaderTool from '@/components/HeaderTool'
import { getTags } from '@/api/problemset/tag'
import crudTags from '@/api/problemset/tag'

export default {
  name: 'Tags',
  components: { Pagination, HeaderTool },
  data() {
    return {
      searchTitle: '输入名称搜索',
      tableKey: 0,
      queryParams: {},
      loading: false,
      total: 10,
      selections: [],
      tableData: [],
      pagination: {
        size: 5,
        current: 1
      },
      dialog: {
        title: '编辑标签',
        isVisible: false,
        status: false
      },
      userViewVisible: false,
      searchToggle: true,
      form: {
        id: '',
        name: '',
        createTime: ''
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空' }
        ]
      }
    }
  },
  created() {
    this.search()
  },
  mounted() {
    this.fetch()
  },
  methods: {
    // 搜索
    search() {
      this.fetch({
        name: this.queryParams.title
      })
    },
    // 拉取表单数据
    fetch(params = {}) {
      params.size = this.pagination.size
      params.current = this.pagination.current
      this.loading = true
      // 分页查询
      getTags(params).then(res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      })
    },
    addBtn() {
      this.dialog.title = '新增标签'
      this.dialog.isVisible = true
    },
    editBtn(data) {
      this.form.id = data.id
      this.form.name = data.name
      this.form.createTime = data.createTime
      console.log(this.form)
      this.dialog.title = '修改标签'
      this.dialog.isVisible = true
    },
    // 顶部批量删除按钮
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
        console.log(tagIds)
        this.delete(tagIds)
      }).catch(() => {
        this.clearSelections()
      })
    },
    // 表格的删除按钮
    singleDelete(data) {
      this.$refs.table.toggleRowSelection(data, true)
      this.batchDelete()
    },
    // 删除标签
    delete(ids) {
      this.loading = true
      crudTags.del(ids).then(() => {
        this.loading = false
        this.$message({
          message: '删除标签成功',
          type: 'success'
        })
        this.search()
      })
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    editClose() {
      this.dialog.isVisible = false
      this.$refs.form.resetFields()
      this.form = {
        id: '',
        name: '',
        createTime: ''
      }
    },
    editSuccess() {
      this.search()
    },
    // 选择数据改变
    selectionChangeHandler(val) {
      this.selections = val
    },
    // 提交表单
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.buttonLoading = true
          if (!this.form.id) { // 新增
            crudTags.add(this.form).then(res => {
              this.buttonLoading = false
              this.editClose()
              this.$message({
                message: '新增标签成功',
                type: 'success'
              })
              this.editSuccess()
            })
          } else { // 更新
            crudTags.edit(this.form).then(res => {
              this.buttonLoading = false
              this.editClose()
              this.$message({
                message: '修改标签成功',
                type: 'success'
              })
              this.editSuccess()
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

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
