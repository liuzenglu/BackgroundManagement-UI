<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="queryParams.courseName" placeholder="请输入课程名称" clearable size="small"  @keyup.enter.native="handleQuery"  />
      </el-form-item>
      <el-form-item label="授课教师" prop="courseTeacherId">
            <el-select v-model="queryParams.courseTeacherId" placeholder="授课教师" clearable size="small" style="width: 200px">
              <el-option v-for="dict in teacherOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
      </el-form-item>
      <el-form-item label="所属年份" prop="couresYear">
        <el-date-picker v-model="queryParams.couresYear" style="width: 200px" type="year" format="yyyy" value-format="yyyy" placeholder="选择年份"></el-date-picker>
      </el-form-item>
      <el-form-item label="所属学期" prop="courseXueqi">
            <el-select v-model="queryParams.courseXueqi" placeholder="所属学期" clearable size="small" style="width: 200px">
              <el-option v-for="dict in xueqiOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>



    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="课程号" align="center" prop="id" />
      <el-table-column label="课程名称" align="center" prop="courseName" />
      <el-table-column label="授课教师" align="center" prop="courseTeacherName" />
      <el-table-column label="课程学分" align="center" prop="courseGrade" />
      <el-table-column label="上课地点" align="center" prop="courseAddress" />
      <el-table-column label="所属年份" align="center" prop="couresYear" />
      <el-table-column label="所属学期" align="center" prop="courseXueqi" >
       <template slot-scope="scope">
          <span v-if="scope.row.courseXueqi == '1'">上学期</span>
          <span v-else>下学期</span>
       </template>
      </el-table-column>
      <el-table-column label="上课时间" align="center" prop="courseTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >报名学习</el-button>
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
import { listCourse, getCourse, delCourse, addCourse, updateCourse, exportCourse,userTeacher } from "@/api/course/course";
import { listXuanke, getXuanke, delXuanke, addXuanke, updateXuanke, exportXuanke } from "@/api/xuanke/xuanke";
export default {
  name: "Course",
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
      // 课程管理表格数据
      courseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        courseName: null,
        courseTeacherId: null,
        courseGrade: null,
        courseAddress: null,
        couresYear: null,
        courseXueqi: null,
        courseTime: null,
        xuanze: '0',
        status: '0',
        beizhu: null
      },
      xueqiOptions:[
        {
          dictValue: '1',
          dictLabel: '上学期'
        },
        {
          dictValue: '2',
          dictLabel: '下学期'
        }
      ],
      statusOptions:[
        {
          dictValue: '0',
          dictLabel: '显示'
        },
        {
          dictValue: '1',
          dictLabel: '隐藏'
        }
      ],
      teacherOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        courseTeacherId: [
          { required: true, message: "授课教师不能为空", trigger: "blur" }
        ],
        courseTime: [
          { required: true, message: "上课时间不能为空", trigger: "blur" }
        ],
        courseGrade: [
          { required: true, message: "课程学分不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getUserTeacher()
    this.getList();
  },
  methods: {
    getUserTeacher(){
      userTeacher({'deptId':101}).then(response => {
        response.rows.some((item, index) => {
          this.teacherOptions.push({
            dictValue: item.userId,
            dictLabel: item.nickName
          })
        })
      });
    },
    /** 查询课程管理列表 */
    getList() {
      this.loading = true;
      listCourse(this.queryParams).then(response => {
        this.courseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        courseName: null,
        courseTeacherId: null,
        courseGrade: null,
        courseAddress: null,
        couresYear: null,
        courseXueqi: null,
        courseTime: null,
        beizhu: null
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

    /** 修改按钮操作 */
    handleUpdate(row) {
      const xuanke = {}
      xuanke.courseId = row.id
      xuanke.userId = this.$store.getters.userid
      addXuanke(xuanke).then(response => {
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
