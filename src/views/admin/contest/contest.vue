<template>
  <div class="app-container">
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="searchToggle">
        <!-- 搜索 -->
        <el-input v-model="queryParams.keyword" clearable size="small" placeholder="输入比赛名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="keydownHandler" />
        <span class="search-btn">
          <!-- 搜索 -->
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="search">搜索</el-button>
          <!-- 重置 -->
          <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </span>
      </div>
      <div class="crud-opts">
        <span class="crud-opts-left">
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="goCreate(contestId)"
          >
            新增比赛
          </el-button>
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
            @click="search"
          />
        </el-button-group>
      </div>
    </div>
    <!-- 表格渲染 -->
    <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" min-width="80" />
      <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip />
      <el-table-column prop="type" label="比赛类型" min-width="130" show-overflow-tooltip>
        <template v-slot="{ row }">
          <el-tooltip
            :content="CONTEST_TYPE_REVERSE[row.type].tips"
            placement="top"
            effect="light"
          >
            <el-tag
              size="medium"
            >
              {{ CONTEST_TYPE_REVERSE[row.type].name }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="auth" label="权限" min-width="150" show-overflow-tooltip>
        <template v-slot="{ row }">
          <el-tooltip
            :content="CONTEST_AUTH_REVERSE[row.auth].tips"
            placement="top"
            effect="light"
          >
            <el-tag
              :type="CONTEST_AUTH_REVERSE[row.auth].color"
              effect="plain"
              size="medium"
            >
              {{ CONTEST_AUTH_REVERSE[row.auth].name }}
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="150" show-overflow-tooltip>
        <template v-slot="{ row }">
          <el-tag
            effect="dark"
            :color="CONTEST_STATUS_REVERSE[row.status].color"
            size="medium"
          >
            {{ CONTEST_STATUS_REVERSE[row.status].name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更多" min-width="210">
        <template v-slot="scope">
          <p class="time-font">开始时间: {{ scope.row.startTime }}</p>
          <p class="time-font">结束时间: {{ scope.row.endTime }}</p>
          <p class="time-font">创建时间: {{ scope.row.createTime }}</p>
          <p class="time-font">作者: {{ scope.row.author }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template v-slot="{ row }">
          <el-tooltip effect="dark" content="编辑比赛" placement="top">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click.native="goEdit(row.id)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="查看比赛题目列表"
            placement="top"
          >
            <el-button
              icon="el-icon-tickets"
              size="mini"
              type="success"
              @click.native="goContestProblems(row.id)"
            />
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="查看比赛公告列表"
            placement="top"
          >
            <el-button
              icon="el-icon-info"
              size="mini"
              type="info"
              @click.native="goContestAnnouncement(row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pagination.current" :limit.sync="pagination.size" @pagination="search" />
  </div>
</template>

<script>
import { CONTEST_AUTH_REVERSE, CONTEST_STATUS_REVERSE, CONTEST_TYPE_REVERSE } from '@/utils/constants'
import Pagination from '@/components/Pagination'
import contestApi from '@/api/contest/contest'

export default {
  name: 'Contest',
  components: { Pagination },
  data() {
    return {
      queryParams: {},
      loading: false,
      total: 0,
      pagination: {
        size: 10,
        current: 1
      },
      searchToggle: true,
      tableData: [],
      CONTEST_AUTH_REVERSE: {},
      CONTEST_STATUS_REVERSE: {},
      CONTEST_TYPE_REVERSE: {},
      contestId: null
    }
  },
  mounted() {
    this.CONTEST_AUTH_REVERSE = Object.assign({}, CONTEST_AUTH_REVERSE)
    this.CONTEST_STATUS_REVERSE = Object.assign({}, CONTEST_STATUS_REVERSE)
    this.CONTEST_TYPE_REVERSE = Object.assign({}, CONTEST_TYPE_REVERSE)
    this.search()
  },
  methods: {
    search() {
      this.fetch({
        ...this.queryParams
      })
    },
    fetch(params = {}) {
      params.size = this.pagination.size
      params.current = this.pagination.current
      this.loading = true
      // 分页查询
      contestApi.getContests(params).then(res => {
        this.tableData = res.records
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    reset() {
      this.queryParams.keyword = ''
    },
    toggleSearch() {
      this.searchToggle = !this.searchToggle
    },
    goCreate() {
      this.$router.push({ name: 'ContestCreate' })
    },
    goEdit(contestId) {
      this.$router.push({ name: 'ContestEdit', params: { contestId }})
    },
    goContestProblems(contestId) {
      this.$router.push({ name: 'ContestProblems', params: { contestId }})
    },
    goContestAnnouncement() {}
  }
}
</script>

<style scoped>
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
.time-font {
  font-size: 5px;
}
.filter-row {
  margin-top: 10px;
}
@media screen and (max-width: 768px) {
  .filter-row span {
    margin-right: 5px;
  }
}
@media screen and (min-width: 768px) {
  .filter-row span {
    margin-right: 20px;
  }
}
.el-tag--dark {
  border-color: #fff;
}
</style>
