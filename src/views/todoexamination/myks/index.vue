<template>
  <div class="app-container">




    <el-table v-loading="loading" :data="ksbmList" >

      <el-table-column label="考试编号" align="center" prop="id" />
      <el-table-column label="所考课程" align="center" prop="courseName" />
      <el-table-column label="考试开始时间" align="center" prop="begainTime" />
      <el-table-column label="考试结束时间" align="center" prop="endTime" />
      <el-table-column label="考试地点" align="center" prop="testAddress" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >取消报名</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />


  </div>
</template>

<script>
import { listKsbm, getKsbm, delKsbm, addKsbm, updateKsbm, exportKsbm } from "@/api/ksbm/ksbm";

export default {
  name: "Ksbm",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 考试报名表格数据
      ksbmList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: this.$store.getters.userid,
        kaoshiId: null
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户选课列表 */
    getList() {
      this.loading = true;
      listKsbm(this.queryParams).then(response => {
        this.ksbmList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },


    /** 删除按钮操作 */
    handleDelete(row) {
      const kaoshiuser = {}
      kaoshiuser.kaoshiId = row.id
kaoshiuser.userId = this.$store.getters.userid
      this.$confirm('是否确认取消考试报名?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delKsbm(kaoshiuser);
        }).then(() => {
          this.getList();
          this.msgSuccess("取消报名成功");
        }).catch(function() {});
    },
  }
};
</script>
