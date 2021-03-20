<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <header-tool v-model="queryParams.keyword" :name="searchTitle" :selections="selections" @insert="addBtn" @update="editBtn(selections[0])" @delete="batchDeleteBtn" @search="search" />
    </div>
    <!-- 表格渲染 -->
    <el-table :key="tableKey" ref="table" v-loading="loading" :data="tableData" style="width: 100%" @selection-change="selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
      <el-table-column :show-overflow-tooltip="true" prop="nickname" label="昵称" />
      <el-table-column prop="gender" label="性别">
        <template slot-scope="scope">
          {{ transSex(scope.row.gender) }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="phone" label="电话" />
      <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" />
      <el-table-column label="状态" align="center" prop="enabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="editBtn(scope.row)" />
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="singleDeleteBtn(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog.isVisible" :title="dialog.title" width="570px" @close="editClose">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model.number="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender" style="width: 178px">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.enabled" :disabled="form.id === user.id">
            <el-radio :label="true">激活</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
          <el-select
            v-model="form.roles"
            style="width: 437px"
            multiple
            value-key="id"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
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
import crudUser from '@/api/system/user'
import crudRole from '@/api/system/role'
export default {
  name: 'Users',
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
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    transSex(sex) {
      switch (sex) {
        case '1':
          return '男'
        case '2':
          return '女'
        default:
          return '保密'
      }
    },
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
      crudUser.getUsers(params).then(res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
    // 获取所有的角色数据
    getRoleData() {
      crudRole.getAllRole().then(res => {
        this.roles = res.records
      })
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
      crudUser.del(ids).then(() => {
        this.loading = false
        this.$message({
          message: '删除用户成功',
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
    getUserStatus(val) {
      if (val) return '激活'
      else return '禁用'
    },
    // 更改用户状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.getUserStatus(val) + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudUser.edit(data).then(res => {
          this.$message.success({
            message: this.getUserStatus(val) + '成功'
          })
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.buttonLoading = true
          if (!this.form.id) { // 新增
            crudUser.add(this.form).then(res => {
              this.buttonLoading = false
              this.editClose()
              this.editSuccess()
              this.$notify.success({
                title: '新增成功',
                message: '新用户的默认密码为：123456'
              })
            })
          } else { // 更新
            crudUser.edit(this.form).then(res => {
              this.buttonLoading = false
              this.editClose()
              this.$message({
                message: '修改用户成功',
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
