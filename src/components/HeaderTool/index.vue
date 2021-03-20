<template>
  <div class="header-tool-container">
    <div v-if="searchToggle">
      <!-- 搜索 -->
      <el-input v-model="searchValue" clearable size="small" :placeholder="name" style="width: 200px;" class="filter-item" @keyup.enter.native="keydownHandler" />
      <!-- 插槽内容 -->
      <slot />
      <span class="search-btn">
        <!-- 搜索 -->
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="search">搜索</el-button>
        <!-- 重置 -->
        <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </span>
    </div>
    <!-- 操作 -->
    <div class="crud-opts">
      <span v-if="crudButton" class="crud-opts-left">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="insertClick"
        >
          新增
        </el-button>
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-edit"
          :disabled="selections.length !== 1"
          @click="updateClick"
        >
          修改
        </el-button>
        <el-button
          slot="reference"
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="selections.length < 1"
          @click="deleteClick"
        >
          删除
        </el-button>
        <!-- <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-download"
        >导出</el-button> -->
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
          @click="refresh"
        />
      </el-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeadTool',
  props: {
    value: {
      type: String,
      default: ''
    },
    name: {
      required: true,
      type: String
    },
    selections: {
      required: true,
      type: Array
    },
    crudButton: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      searchValue: this.value,
      searchToggle: true
    }
  },
  watch: {
    value(newValue) {
      this.searchValue = newValue
    },
    searchValue(newValue) {
      this.$emit('input', newValue)
    }
  },
  methods: {
    insertClick() {
      this.$emit('insert')
    },
    updateClick() {
      this.$emit('update')
    },
    deleteClick() {
      this.$emit('delete')
    },
    toggleSearch() {
      this.searchToggle = !this.searchToggle
    },
    search() {
      this.$emit('search')
    },
    refresh() {
      this.search()
    },
    keydownHandler(e) {
      const keyCode = window.event ? e.keyCode : e.which
      if (keyCode === 13) {
        this.search()
      }
    },
    // 清空搜索条件
    reset() {
      this.searchValue = ''
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
  .search-btn {
    margin-left: 10px;
  }
</style>
