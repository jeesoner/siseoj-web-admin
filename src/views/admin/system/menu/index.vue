<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <header-tool v-model="queryParams.keyword" :name="searchTitle" :selections="selections" @insert="addBtn" @update="editBtn(selections[0])" @delete="batchDeleteBtn" @search="search" />
    </div>
    <!-- 表格渲染 -->
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="tableData"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :load="getMenus"
      style="width: 100%"
      row-key="id"
      lazy
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
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="editBtn(scope.row)" />
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="singleDeleteBtn(scope.row)" />
          <!-- 确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！ -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog.isVisible" :title="dialog.title" width="580px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" label="菜单图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" label="外链菜单" prop="iframe">
          <el-radio-group v-model="form.iframe" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() === '1'" label="菜单缓存" prop="cache">
          <el-radio-group v-model="form.cache" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" label="菜单可见" prop="hidden">
          <el-radio-group v-model="form.hidden" size="mini">
            <el-radio-button label="false">是</el-radio-button>
            <el-radio-button label="true">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="菜单标题" prop="title">
          <el-input v-model="form.title" :style=" form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'" placeholder="菜单标题" />
        </el-form-item>
        <el-form-item v-if="form.type.toString() === '2'" label="按钮名称" prop="title">
          <el-input v-model="form.title" placeholder="按钮名称" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '0'" label="权限标识" prop="permission">
          <el-input v-model="form.permission" :disabled="form.iframe" placeholder="权限标识" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" label="路由地址" prop="path">
          <el-input v-model="form.path" placeholder="路由地址" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input-number v-model.number="form.menuSort" :min="0" :max="999" controls-position="right" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="!form.iframe && form.type.toString() === '1'" label="组件名称" prop="componentName">
          <el-input v-model="form.componentName" style="width: 178px;" placeholder="匹配组件内Name字段" />
        </el-form-item>
        <el-form-item v-show="!form.iframe && form.type.toString() === '1'" label="组件路径" prop="component">
          <el-input v-model="form.component" style="width: 178px;" placeholder="组件路径" />
        </el-form-item>
        <el-form-item label="上级类目" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="menus"
            :load-options="loadMenus"
            style="width: 450px;"
            placeholder="选择上级类目"
          />
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
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import menuApi from '@/api/system/menu'

const defaultForm = { id: null, title: null, menuSort: 999, path: null, component: null, componentName: null, iframe: false, roles: [], pid: 0, icon: null, cache: false, hidden: false, type: 0, permission: null }
export default {
  name: 'Menu',
  components: { Pagination, HeaderTool, IconSelect, Treeselect },
  data() {
    return {
      searchTitle: '输入名称搜索',
      tableKey: 0,
      queryParams: {},
      loading: false,
      total: 0,
      selections: [],
      tableData: [],
      menus: [],
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
        type: ''
      },
      rules: {
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
      setTimeout(() => {
        menuApi.getMenus(params).then(res => {
          console.log(res)
          this.tableData = res.records
          this.loading = false
        }).catch(() => {
          this.loading = true
        })
      }, 100)
    },
    beforeToOperator(form) {
      // 加载数据
      if (form.id != null) {
        if (form.pid === null) {
          form.pid = 0
        }
        this.getSupDepts(form.id)
      } else {
        this.menus = [{ id: 0, label: '顶级类目', children: null }]
      }
    },
    addBtn() {
      this.form = Object.assign({}, defaultForm)
      this.beforeToOperator(this.form)
      this.dialog.title = '新增菜单'
      this.dialog.isVisible = true
    },
    editBtn(data) {
      this.form = Object.assign({}, data) // 深克隆
      this.beforeToOperator(this.form)
      console.log(data)
      // 表单数据初始化
      this.dialog.title = '编辑菜单'
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
    // 删除菜单
    delete(ids) {
      this.loading = true
      menuApi.del(ids).then(res => {
        this.loading = false
        this.$message.success('删除菜单成功')
        this.search()
      }).catch(() => {
        this.loading = false
      })
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    editClose() {
      this.dialog.isVisible = false
      this.$refs.form.resetFields()
      // 重置弹出的表单数据
      this.form = {
        type: ''
      }
    },
    editSuccess() {
      this.search()
    },
    // 选择数据改变
    selectionChangeHandler(val) {
      this.selections = val
    },
    // 选中图标
    selected(name) {
      this.form.icon = name
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        menuApi.getMenusTree(parentNode.id).then(res => {
          parentNode.children = res.map(function(obj) {
            if (!obj.leaf) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    getMenus(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        menuApi.getMenus(params).then(res => {
          resolve(res.records)
        })
      }, 100)
    },
    getSupDepts(id) {
      menuApi.getMenuSuperior(id).then(res => {
        const children = res.map(function(obj) {
          if (!obj.leaf && !obj.children) {
            obj.children = null
          }
          return obj
        })
        this.menus = [{ id: 0, label: '顶级类目', children: children }]
      })
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.componentName) {
            this.form.componentName = null
          }
          if (!this.form.component) {
            this.form.component = null
          }
          this.buttonLoading = true
          if (!this.form.id) { // 新增
            menuApi.add(this.form).then(res => {
              this.buttonLoading = false
              this.editClose()
              this.editSuccess()
              this.$message.success('新增菜单成功')
            })
          } else { // 更新
            menuApi.edit(this.form).then(res => {
              this.buttonLoading = false
              this.editClose()
              this.$message.success('修改菜单成功')
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
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
