<template>
  <div class="app-container">




    <el-table v-loading="loading" :data="xuankeList" >
      <el-table-column label="课程号" align="center" prop="id" />
      <el-table-column label="课程名称" align="center" prop="courseName" />
      <el-table-column label="课程学分" align="center" prop="courseGrade" />
      <el-table-column label="上课地点" align="center" prop="courseAddress" />
      <el-table-column label="上课时间" align="center" prop="courseTime" />
      <el-table-column label="所属年份" align="center" prop="couresYear" />

      <el-table-column label="所属学期" align="center" prop="courseXueqi" >
       <template slot-scope="scope">
          <span v-if="scope.row.courseXueqi == '1'">上学期</span>
          <span v-else>下学期</span>
       </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >退选</el-button>
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
import { listXuanke, getXuanke, delXuanke, addXuanke, updateXuanke, exportXuanke } from "@/api/xuanke/xuanke";

export default {
  name: "Xuanke",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户选课表格数据
      xuankeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: this.$store.getters.userid,
        courseId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户选课列表 */
    getList() {
      this.loading = true;
      listXuanke(this.queryParams).then(response => {
        this.xuankeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        courseId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户选课";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getXuanke(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户选课";
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const courseuser = {}
      courseuser.courseId = row.id
courseuser.userId = this.$store.getters.userid
      this.$confirm('是否确认退选此课程?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delXuanke(courseuser);
        }).then(() => {
          this.getList();
          this.msgSuccess("退选成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户选课数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportXuanke(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
