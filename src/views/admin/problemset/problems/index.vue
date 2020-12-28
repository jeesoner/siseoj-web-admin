<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="#" width="100">
      </el-table-column>
      <el-table-column prop="source" label="来源" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="title" label="题目" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tag" label="标签" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="level" label="难度">
      </el-table-column>
      <el-table-column label="更新时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { isvalidPhone } from '@/utils/validate'
export default {
  name: 'User',
  components: {},
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
    }
  }
}
</script>

<style>
</style>