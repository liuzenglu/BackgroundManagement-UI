<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="学生姓名" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入学生姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级名称" prop="banjiId">
            <el-select v-model="queryParams.banjiId" placeholder="班级名称" clearable size="small" style="width: 200px">
              <el-option v-for="dict in banjiOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
      </el-form-item>
      <el-form-item label="所考课程" prop="courseId">
            <el-select v-model="queryParams.courseId" placeholder="所考课程" clearable size="small" style="width: 200px">
              <el-option v-for="dict in courseOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
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
          v-hasPermi="['chengji:chengji:edit']"
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

    <el-table v-loading="loading" :data="chengjiList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="学生姓名" align="center" prop="username" />
      <el-table-column label="班级名称" align="center" prop="banjiName" />
      <el-table-column label="课程名称" align="center" prop="courseName" />
      <el-table-column label="教师名称" align="center" prop="courseTeacherName" />
      <el-table-column label="所考分数" align="center" prop="grade" />
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

    <!-- 添加或修改成绩对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="学生姓名" prop="userId">
            <el-select v-model="form.userId" placeholder="请选择学生姓名" clearable size="small" style="width: 380px">
              <el-option v-for="dict in teacherOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
        </el-form-item>
         <el-form-item label="所考课程" prop="courseId">
            <el-select v-model="form.courseId" placeholder="所考课程" clearable size="small" style="width: 380px">
              <el-option v-for="dict in courseOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
      </el-form-item>

        <el-form-item label="所考分数" prop="grade">
          <el-input v-model="form.grade" placeholder="请输入所考分数" />
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
import { listChengji, getChengji, delChengji, addChengji, updateChengji, exportChengji,banjilist } from "@/api/chengji/chengji";
import { userTeacher } from "@/api/course/course";
import { getCourseList } from "@/api/fxq/kaoshi";
export default {
  name: "Chengji",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      banjiOptions:[],
      courseOptions:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      teacherOptions: [],
      // 成绩表格数据
      chengjiList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        username: null,
        banjiId: null,
        banjiName: null,
        courseId: null,
        courseName: null,
        courseTeacherName: null,
        grade: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "学生id不能为空", trigger: "blur" }
        ],
        banjiId: [
          { required: true, message: "班级id不能为空", trigger: "blur" }
        ],
        courseId: [
          { required: true, message: "课程id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getbanjilist()
     this.getAllCourseList()
     this.getUserTeacher()
    this.getList();
  },
  methods: {
     getbanjilist(){
      banjilist().then(response => {
        response.data.some((item, index) => {
          this.banjiOptions.push({
            dictValue: item.deptId,
            dictLabel: item.deptName
          })
        })
      });
    },


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
    getUserTeacher(){
      userTeacher({'deptId':102}).then(response => {
        response.rows.some((item, index) => {
          this.teacherOptions.push({
            dictValue: item.userId,
            dictLabel: item.nickName
          })
        })
      });
    },
    /** 查询成绩列表 */
    getList() {
      this.loading = true;
      listChengji(this.queryParams).then(response => {
        this.chengjiList = response.rows;
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
        username: null,
        banjiId: null,
        banjiName: null,
        courseId: null,
        courseName: null,
        courseTeacherName: null,
        grade: null
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
      this.title = "添加成绩";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getChengji(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改成绩";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateChengji(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addChengji(this.form).then(response => {
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
      this.$confirm('是否确认删除成绩编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delChengji(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有成绩数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportChengji(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
