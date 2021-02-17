<template>
  <div class="app-container">


    <el-table v-loading="loading" :data="kaoshiList"  >

      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="所考课程" align="center" prop="courseName" />
      <el-table-column label="考试开始时间" align="center" prop="begainTime" />
      <el-table-column label="考试结束时间" align="center" prop="endTime" />
      <el-table-column label="考试地点" align="center" prop="testAddress" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >报名</el-button>
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
import { listKaoshi, getKaoshi, delKaoshi, addKaoshi, updateKaoshi, exportKaoshi,getCourseList } from "@/api/fxq/kaoshi";
import { listKsbm, getKsbm, delKsbm, addKsbm, updateKsbm, exportKsbm } from "@/api/ksbm/ksbm";
export default {
  name: "Kaoshi",
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
      // 考试安排表格数据
      kaoshiList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        courseId: null
      },
      courseOptions:[],
      // 表单参数
      form: {
      },
      statusOptions:[
        {
          dictValue: '0',
          dictLabel: '允许报考'
        },
        {
          dictValue: '1',
          dictLabel: '禁止报考'
        }
      ],
      // 表单校验
      rules: {
        courseId: [
          { required: true, message: "所考课程不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getAllCourseList()
    this.getList();
  },
  methods: {
    getAllCourseList(){
      getCourseList({'status':'0'}).then(response => {
        response.rows.some((item, index) => {
          this.courseOptions.push({
            dictValue: item.id,
            dictLabel: item.courseName
          })
        })
      });
    },

    /** 查询考试安排列表 */
    getList() {
      this.loading = true;
      listKaoshi({'status':'0'}).then(response => {
        this.kaoshiList = response.rows;
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
        courseId: null,
        testTime: null,
        testAddress: null
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


    /** 修改按钮操作 */
    handleUpdate(row) {
      const kaos = {}
      kaos.userId = this.$store.getters.userid
      kaos.kaoshiId = row.id
      addKsbm(kaos).then(response => {
              if (response.code === 200) {
                this.msgSuccess("报名成功");
                this.open = false;
                this.getList();
              }
            });
    },


  }
};
</script>
