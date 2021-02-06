<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="searchToggle">
        <!-- 搜索 -->
        <el-input clearable size="small" placeholder="用户名" style="width: 200px;" class="filter-item" />
        <span>
          <!-- 搜索 -->
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search">搜索</el-button>
          <!-- 重置 -->
          <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left">重置</el-button>
        </span>
      </div>
      <!-- 操作 -->
      <div class="crud-opts">
        <span class="crud-opts-left">
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
          >
            新增
          </el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-edit"
          >
            修改
          </el-button>
          <el-button
            slot="reference"
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
          >
            删除
          </el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-download"
          >导出</el-button>
        </span>
        <el-button-group class="crud-opts-right">
          <el-button
            size="mini"
            plain
            type="info"
            icon="el-icon-search"
            @click="toggleSearch"
          />
          <el-button
            size="mini"
            icon="el-icon-refresh"
          />
        </el-button-group>
      </div>
      <!-- 状态 -->
      <!-- <el-select clearable size="small" placeholder="状态" class="filter-item" style="width: 90px">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select> -->
    </div>
    <!--表格渲染-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="日期" width="150">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="city" label="市区" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="zip" label="邮编" />
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.$index, scope.row)" />
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />
    <!-- <user-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    /> -->
  </div>
</template>

<script>
import { isvalidPhone } from '@/utils/validate'
import Pagination from '@/components/Pagination'
import UserEdit from './edit'
export default {
  name: 'Problems',
  components: { Pagination, UserEdit },
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
      total: 0,
      pagination: {
        size: 10,
        num: 1
      },
      searchToggle: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
        }
      ],
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
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    toggleSearch() {
      this.searchToggle = !this.searchToggle
    },
    search() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .crud-opts {
    padding: 4px 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }
  .crud-opts .crud-opts-right {
    margin-left: auto;
  }
  ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
