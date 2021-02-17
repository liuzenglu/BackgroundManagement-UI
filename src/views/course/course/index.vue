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
      <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="状态" clearable size="small" style="width: 200px">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['course:course:edit']"
        >修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

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
      <el-table-column label="状态" align="center" prop="status" >
       <template slot-scope="scope">
          <span v-if="scope.row.status == '0'">显示</span>
          <span v-else>隐藏</span>
       </template>
      </el-table-column>
      <el-table-column label="是否可选" align="center" prop="xuanze" >
       <template slot-scope="scope">
          <span v-if="scope.row.xuanze == '0'">可选</span>
          <span v-else>不可选</span>
       </template>
      </el-table-column>

      <el-table-column label="上课时间" align="center" prop="courseTime" />
      <el-table-column label="备注" align="center" prop="beizhu" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 添加或修改课程管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="授课教师" prop="courseTeacherId">
            <el-select v-model="form.courseTeacherId" placeholder="请选择授课教师" clearable size="small" style="width: 380px">
              <el-option v-for="dict in teacherOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
        </el-form-item>
        <el-form-item label="课程学分" prop="courseGrade">
          <el-input v-model="form.courseGrade" placeholder="请输入课程学分" />
        </el-form-item>
        <el-form-item label="上课地点" prop="courseAddress">
          <el-input v-model="form.courseAddress" placeholder="请输入上课地点" />
        </el-form-item>
        <el-form-item label="所属年份" prop="couresYear">
        <el-date-picker v-model="form.couresYear"  style="width: 380px" type="year" format="yyyy" value-format="yyyy" placeholder="选择年份"></el-date-picker>
        </el-form-item>
        <el-form-item label="所属学期" prop="courseXueqi">
            <el-select v-model="form.courseXueqi" placeholder="请选择所属学期" clearable size="small" style="width: 380px">
              <el-option v-for="dict in xueqiOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" clearable size="small" style="width: 380px">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
        </el-form-item>

        <el-form-item label="是否可选" prop="xuanze">
            <el-select v-model="form.xuanze" placeholder="请选择是否可选" clearable size="small" style="width: 380px">
              <el-option v-for="dict in xuanzeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
        </el-form-item>
        <el-form-item label="上课时间" prop="courseTime">
          <el-input v-model="form.courseTime" placeholder="请输入上课时间" />
        </el-form-item>
        <el-form-item label="备注" prop="beizhu">
          <el-input v-model="form.beizhu" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCourse, getCourse, delCourse, addCourse, updateCourse, exportCourse,userTeacher } from "@/api/course/course";

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
      xuanzeOptions:[
        {
          dictValue: '0',
          dictLabel: '可选'
        },
        {
          dictValue: '1',
          dictLabel: '不可选'
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加课程管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCourse(id).then(response => {
        this.form = row
        this.open = true;
        this.title = "修改课程管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCourse(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addCourse(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除课程管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCourse(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有课程管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCourse(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
