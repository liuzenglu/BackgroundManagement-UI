<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所考课程" prop="courseId">
            <el-select v-model="queryParams.courseId" placeholder="所考课程" clearable size="small" style="width: 200px">
              <el-option v-for="dict in courseOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
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
          v-hasPermi="['fxq:kaoshi:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="kaoshiList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="所考课程" align="center" prop="courseName" />
      <el-table-column label="考试开始时间" align="center" prop="begainTime" />
      <el-table-column label="考试结束时间" align="center" prop="endTime" />
      <el-table-column label="考试地点" align="center" prop="testAddress" />
      <el-table-column label="状态" align="center" prop="status" >
       <template slot-scope="scope">
          <span v-if="scope.row.status == '0'">允许报考</span>
          <span v-else>禁止报考</span>
       </template>
      </el-table-column>
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

    <!-- 添加或修改考试安排对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所考课程" prop="courseId">
            <el-select v-model="form.courseId" placeholder="所考课程" clearable size="small" style="width: 380px">
              <el-option v-for="dict in courseOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
      </el-form-item>
        <el-form-item label="考试时间" prop="testTime">
          <el-date-picker style="width: 380px"
      v-model="form.testTime"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
        </el-form-item>
        <el-form-item label="考试地点" prop="testAddress">
          <el-input v-model="form.testAddress" placeholder="请输入考试地点" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="状态" clearable size="small" style="width: 380px">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
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
import { listKaoshi, getKaoshi, delKaoshi, addKaoshi, updateKaoshi, exportKaoshi,getCourseList } from "@/api/fxq/kaoshi";

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
      listKaoshi(this.queryParams).then(response => {
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
      this.title = "添加考试安排";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getKaoshi(id).then(response => {
        this.form = response.data;
        const time = []
        time.push(response.data.begainTime)
        time.push(response.data.endTime)
        this.form.testTime = time
        this.open = true;
        this.title = "修改考试安排";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.begainTime = this.form.testTime[0]
          this.form.endTime = this.form.testTime[1]
          if (this.form.id != null) {
            updateKaoshi(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addKaoshi(this.form).then(response => {
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
      this.$confirm('是否确认删除考试安排编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delKaoshi(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有考试安排数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportKaoshi(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
