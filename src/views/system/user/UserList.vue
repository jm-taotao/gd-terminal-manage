<template>
  <el-row style="display: flex;align-items: center;">
      <el-icon :size="20" ><Edit/></el-icon><span>用户管理</span>
  </el-row>
  <el-row>
    <span style="height: 1px;width: 100%;margin:20px 0;background-color: #ffffff"></span>
  </el-row>
  <el-form :model="form" ref="form">
    <el-row :gutter="10">
      <el-col :span="3">
        <el-form-item label="用户名：" prop="loginName">
          <el-input
              :maxlength="20"
              :clearable="true"
              v-model="form.loginName"
              size="default "
              placeholder="请输入用户名查找"
          />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item label="创建时间：" prop="loginName">
          <el-date-picker
          v-model="form.start"
          value-format="YYYY-MM-DD"
          type="dateTime"
          placeholder="请选择开始时间"
          />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item>
          <el-date-picker
              v-model="form.end"
              value-format="YYYY-MM-DD"
              type="dateTime"
              placeholder="请选择结束时间"
          />
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" bg @click="submit">查询</el-button>
        <el-button type="primary" bg @click="centerDialogVisible = true">新增</el-button>
      </el-col>
    </el-row>
  </el-form>
  <el-table :data="tableData" :row-class-name="rowClass" :table-layout="'auto'" height="1000px">
    <el-table-column prop="id" label="用户ID"></el-table-column>
    <el-table-column prop="loginName" label="用户名"></el-table-column>
    <el-table-column prop="createTimeStr" label="创建时间"></el-table-column>
    <el-table-column prop="updateTimeStr" label="更新时间"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="default" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="default" type="danger" @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="pageSizes"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      @prev-click="prePage"
      @next-click="nextPage"
      layout="total, sizes, prev, pager,  next, jumper"
      :total="total"
      v-bind:dataSize="tableData.length"
      :style="paginationStyle"/>


  <el-dialog v-model="centerDialogVisible" title="新增信息" width="30%" center>
    <el-form ref="form" :model="form" :rules="rules" @validate="validate" status-icon :label-position="labelPosition" label-width="100px">
      <el-form-item label="用户名" prop="account">
        <el-input v-model="form.loginName" placeholder="请输入用户名" ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" show-password placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="form.checkPass" show-password placeholder="请输入确认密码"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script >
import Qs from "qs";
import HttpRequestAPI from "@/api/HttpRequestApi";
export default {
  name: "UserList",
  data(){
    return {
      currentPage:1,
      tableData:[],
      pageSize:10,
      pageSizes:[10, 20, 30, 40, 50, 100],
      total:0,
      form:{
        loginName:'',
        start:'',
        end:'',
      },
      paginationStyle:{
        marginTop:'20px'
      },
      centerDialogVisible:false,
      rules: {
        loginName: [{ required: true, message: "请输用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输用密码", trigger: "blur" }],
        checkPass: [{ required: true, message: "请输用确认密码", trigger: "blur" }],
      }
    }
  },
  created() {
    this.getUserList();
  },
  methods:{
    rowClass(row) {
      if (row.rowIndex%2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    getUserList(){
      const page = {
        page:this.currentPage,
        pageSize:10
      }
      this.axios.post(HttpRequestAPI.terminal_userManage,Qs.stringify(page))
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data.list
              this.total = resp.data.data.total
            }
          }).catch(error=>{
          console.log(error)
      })
    },
    nextPage(page){
      const pager = {
        page:page+1,
        pageSize:10
      }
      this.axios.post(HttpRequestAPI.terminal_userManage,Qs.stringify(pager))
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data.list
              this.total = resp.data.data.total
            }
          }).catch(error=>{
        console.log(error)
      })
    },
    prePage(page){
      const pager = {
        page:page-1,
        pageSize:10
      }
      this.axios.post(HttpRequestAPI.terminal_userManage,Qs.stringify(pager))
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data.list
              this.total = resp.data.data.total
            }
          }).catch(error=>{
        console.log(error)
      })
    },
    handleSizeChange(newSize){
      const pager = {
        page:this.currentPage,
        pageSize:newSize
      }
      this.axios.post(HttpRequestAPI.terminal_userManage,Qs.stringify(pager))
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data.list
              this.total = resp.data.data.total
            }
          }).catch(error=>{
        console.log(error)
      })
    },
    handleCurrentChange(newPage){
      const pager = {
        page:newPage,
        pageSize:this.pageSize
      }
      this.axios.post(HttpRequestAPI.terminal_userManage,Qs.stringify(pager))
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data.list
              this.total = resp.data.data.total
            }
          }).catch(error=>{
        console.log(error)
      })
    },
    submit(){
      const pager = {
        page:1,
        pageSize:this.pageSize,
        loginName:this.form.loginName,
        start:this.form.start,
        end:this.form.end,
      }
      this.axios.post(HttpRequestAPI.terminal_userManage,Qs.stringify(pager))
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data.list
              this.total = resp.data.data.total
            }
          }).catch(error=>{
        console.log(error)
      })
    },
    handleEdit(index,row){
      console.log(index)
      console.log(row)
    },
    handleDelete(index,row){
      console.log(index)
      console.log(row)
    }
  },
}



</script>

<style>

</style>