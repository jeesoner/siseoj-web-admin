<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="searchToggle">
        <!-- 搜索 -->
        <el-input clearable size="small" placeholder="输入编号或题目搜索" style="width: 200px;" class="filter-item" />
        <span>
          <!-- 搜索 -->
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="search">搜索</el-button>
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
    <!-- 表格渲染 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="#" width="100" />
      <el-table-column prop="source" label="OJ" show-overflow-tooltip />
      <el-table-column prop="title" label="题目" show-overflow-tooltip />
      <el-table-column prop="tag" label="标签" show-overflow-tooltip />
      <el-table-column prop="level" label="难度" />
      <el-table-column label="更新时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleEdit(scope.$index, scope.row)" />
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination />
  </div>
</template>

<script>
import { isvalidPhone } from '@/utils/validate'
import Pagination from '@/components/Pagination'
export default {
  name: 'Problems',
  components: { Pagination },
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
      searchToggle: true,
      tableData: [
        {
          id: '1',
          source: 'leetcode',
          title: '最长公共子序列',
          tag: '动态规划',
          level: '困难',
          updateTime: '2016-05-02'
        },
        {
          id: '2',
          source: 'leetcode',
          title: '最长公共子序列',
          tag: '动态规划',
          level: '困难',
          updateTime: '2016-05-02'
        },
        {
          id: '3',
          source: 'leetcode',
          title: '最长公共子序列',
          tag: '动态规划',
          level: '困难',
          updateTime: '2016-05-02'
        },
        {
          id: '4',
          source: 'leetcode',
          title: '最长公共子序列',
          tag: '动态规划',
          level: '困难',
          updateTime: '2016-05-02'
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
    search() {
      console.log('search')
      this.$http.get('/test/1').then(
        res => {
          console.log(res.data.data)
        }
      ).catch(
        error => {
          console.log(error)
        }
      )
    }
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
