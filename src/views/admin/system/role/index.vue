<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <header-tool v-model="queryParams.keyword" :name="searchTitle" :selections="selections" @insert="addBtn" @update="editBtn(selections[0])" @delete="batchDeleteBtn" @search="search" />
    </div>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <!-- 表格渲染 -->
          <el-table :key="tableKey" ref="table" v-loading="loading" :data="tableData" style="width: 100%" @selection-change="selectionChangeHandler">
            <el-table-column type="selection" width="55" />
            <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />
            <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
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
          <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog.isVisible" :title="dialog.title" width="520px" @close="editClose">
            <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" style="width: 380px;" />
              </el-form-item>
              <el-form-item label="描述信息" prop="description">
                <el-input v-model="form.description" style="width: 380px;" rows="5" type="textarea" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="text" size="mini" @click="editClose">取消</el-button>
              <el-button :loading="dialog.status" size="mini" type="primary" @click="submitForm">确认</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              v-permission="['admin','roles:edit']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
            >保存</el-button>
          </div>
          <el-tree
            ref="menu"
            lazy
            :data="menus"
            :default-checked-keys="menuIds"
            :load="getMenuDatas"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
            @check="menuChange"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import HeaderTool from '@/components/HeaderTool'
import crudRole from '@/api/system/role'
import { getMenusTree, getChild } from '@/api/system/menu'
export default {
  name: 'Roles',
  components: { Pagination, HeaderTool },
  data() {
    return {
      defaultProps: { children: 'children', label: 'label', isLeaf: 'leaf' },
      searchTitle: '输入名称搜索',
      tableKey: 0,
      queryParams: {},
      loading: false,
      total: 0,
      selections: [],
      tableData: [],
      menus: [],
      menusId: [],
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
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.fetch()
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
      crudRole.getRoles(params).then(res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addBtn() {
      this.dialog.title = '新增角色'
      this.dialog.isVisible = true
    },
    editBtn(data) {
      // 表单数据初始化
      this.form = Object.assign({}, data) // 深克隆
      console.log(this.form)
      this.dialog.title = '编辑角色'
      this.dialog.isVisible = true
    },
    editClose() {
      this.dialog.isVisible = false
      this.$refs.form.resetFields()
      this.form = {
        id: null,
        name: '',
        description: ''
      }
    },
    editSuccess() {
      this.search()
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
    // 删除角色
    delete(ids) {
      this.loading = true
      crudRole.del(ids).then(() => {
        this.loading = false
        this.$message({
          message: '删除角色成功',
          type: 'success'
        })
        this.search()
      })
    },
    // 清除选中
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    // 选择数据改变
    selectionChangeHandler(val) {
      this.selections = val
    },
    getMenuDatas(node, resolve) {
      setTimeout(() => {
        getMenusTree(node.data.id ? node.data.id : 0).then(res => {
          resolve(res)
        })
      }, 100)
    },
    menuChange(menu) {
      // 获取该节点的所有子节点，id 包含自身
      getChild(menu.id).then(childIds => {
        // 判断是否在 menuIds 中，如果存在则删除，否则添加
        if (this.menuIds.indexOf(menu.id) !== -1) {
          for (let i = 0; i < childIds.length; i++) {
            const index = this.menuIds.indexOf(childIds[i])
            if (index !== -1) {
              this.menuIds.splice(index, 1)
            }
          }
        } else {
          for (let i = 0; i < childIds.length; i++) {
            const index = this.menuIds.indexOf(childIds[i])
            if (index === -1) {
              this.menuIds.push(childIds[i])
            }
          }
        }
        this.$refs.menu.setCheckedKeys(this.menuIds)
      })
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.buttonLoading = true
          if (!this.form.id) { // 新增
            crudRole.add(this.form).then(res => {
              this.buttonLoading = false
              this.editClose()
              this.editSuccess()
              this.$message.success({
                message: '新增角色成功'
              })
            })
          } else { // 更新
            crudRole.edit(this.form).then(res => {
              this.buttonLoading = false
              this.editClose()
              this.$message({
                message: '修改角色成功',
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

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
 ::v-deep .vue-treeselect__multi-value{
    margin-bottom: 0;
  }
 ::v-deep .vue-treeselect__multi-value-item{
    border: 0;
    padding: 0;
  }
</style>
