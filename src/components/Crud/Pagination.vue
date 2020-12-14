<!--分页-->
<template>
  <el-pagination
    :page-size.sync="page.size"
    :total="page.total"
    :current-page.sync="page.page"
    style="margin-top: 8px;"
    layout="total, prev, pager, next, sizes"
    @size-change="crud.sizeChangeHandler($event)"
    @current-change="crud.pageChangeHandler"
  />
</template>
<script>
export default {
  data() {
    return {
      page: {
        // 页码
        page: 0,
        // 每页数据条数
        size: 10,
        // 总数据条数
        total: 0
      },
      crud: {
        sizeChangeHandler: () => {},
        pageChangeHandler: () => {}
      }
    }
  }
}
</script>
