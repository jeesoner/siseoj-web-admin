<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model.number="form.phone" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="form.nickName" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="部门" prop="dept.id">
        <treeselect
          v-model="form.dept.id"
          :options="depts"
          :load-options="loadDepts"
          style="width: 178px"
          placeholder="选择部门"
        />
      </el-form-item>
      <el-form-item label="岗位" prop="jobs">
        <el-select
          v-model="jobDatas"
          style="width: 178px"
          multiple
          placeholder="请选择"
          @remove-tag="deleteTag"
          @change="changeJob"
        >
          <el-option
            v-for="item in jobs"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender" style="width: 178px">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.enabled" :disabled="form.id === user.id">
          <el-radio
            v-for="item in dict.user_status"
            :key="item.id"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
        <el-select
          v-model="roleDatas"
          style="width: 437px"
          multiple
          placeholder="请选择"
          @remove-tag="deleteTag"
          @change="changeRole"
        >
          <el-option
            v-for="item in roles"
            :key="item.name"
            :disabled="level !== 1 && item.level <= level"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">取消</el-button>
      <el-button :loading="crud.status.cu === 2" type="primary" @click="submitForm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
        this.reset()
      }
    }
  },
  methods: {
    initUser() {
      return {
        userId: '',
        username: '',
        password: '1234qwer',
        email: '',
        mobile: '',
        sex: '',
        status: '1',
        deptId: null,
        roleId: [],
        deptIds: '',
        deptIdsArr: []
      }
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '45%'
      } else {
        return '800px'
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
