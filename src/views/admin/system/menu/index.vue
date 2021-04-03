<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <header-tool v-model="queryParams.keyword" :name="searchTitle" :selections="selections" @insert="addBtn" @update="editBtn(selections[0])" @delete="batchDeleteBtn" @search="search" />
    </div>
    <!-- 表格渲染 -->
    <el-table
      :key="tableKey"
      ref="table"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%"
      row-key="id"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" label="菜单标题" width="125px" prop="title" />
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column prop="menuSort" align="center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.menuSort }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="permission" label="权限标识" />
      <el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径" />
      <el-table-column prop="iframe" label="外链" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.iframe">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="cache" label="缓存" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.cache">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="可见" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.hidden">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="135px" />
      <el-table-column v-if="checkPer(['admin','menu:edit','menu:del'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    <!--表单渲染-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import HeaderTool from '@/components/HeaderTool'

export default {
  name: 'Menu',
  components: { Pagination, HeaderTool },
  data() {
    return {
      searchTitle: '输入名称搜索',
      tableKey: 0,
      queryParams: {},
      loading: false,
      total: 0,
      selections: [],
      tableData: [],
      user: {},
      roles: [],
      pagination: {
        size: 10,
        current: 1
      },
      dialog: {
        title: '',
        isVisible: false,
        status: false
      },
      form: {
        id: null,
        username: '',
        nickname: '',
        gender: 0,
        email: '',
        phone: '',
        enabled: false,
        userRoles: []
      },
      rules: {
      }
    }
  },
  mounted() {
    // this.fetch()
  },
  methods: {
    // 搜索
    search() {
      this.fetch({
        ...this.queryParams
      })
    },
    // 拉取表单数据
    fetch(params = {}) {
      params.size = this.pagination.size
      params.current = this.pagination.current
      this.loading = true
      // 分页查询
    },
    addBtn() {
      this.getRoleData()
      this.dialog.title = '新增用户'
      this.dialog.isVisible = true
    },
    editBtn(data) {
      // 加载数据
      this.getRoleData()
      // 表单数据初始化
      this.form = Object.assign({}, data) // 深克隆
      console.log(this.form)
      this.dialog.title = '编辑用户'
      this.dialog.isVisible = true
    },
    // 顶部批量删除按钮
    batchDeleteBtn() {
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
        const ids = this.selections.map(item => {
          return item.id
        })
        console.log('del')
        console.log(ids)
        this.delete(ids)
      }).catch(() => {
        this.clearSelections()
      })
    },
    // 表格的删除按钮
    singleDeleteBtn(data) {
      this.$refs.table.toggleRowSelection(data, true)
      this.batchDeleteBtn()
    },
    // 删除用户
    delete(ids) {
      this.loading = true
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    editClose() {
      this.dialog.isVisible = false
      this.$refs.form.resetFields()
      // 重置弹出的表单数据
      this.form = {
        id: '',
        nickname: '',
        username: '',
        email: '',
        phone: '',
        gender: 0,
        enabled: false,
        roles: []
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
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.buttonLoading = true
          if (!this.form.id) { // 新增
          } else { // 更新
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
