<template>
  <el-row style="display: flex;align-items: center;">
      <el-icon :size="20" ><Edit/></el-icon><span>用户管理</span>
  </el-row>
  <el-row>
    <span style="height: 1px;width: 100%;margin:20px 0;background-color: #ffffff"></span>
  </el-row>
<!--  <el-row>-->
    <el-form :model="form" ref="form" :inline="true">
      <el-form-item label="用户名：" prop="loginName">
        <el-input
            :maxlength="20"
            v-model="form.loginName"
            placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="isDeleted">
        <el-select v-model="form.isDeleted" class="m-2" placeholder="请选择状态">
          <el-option value="Y"><el-tag :type="'danger'">已删除</el-tag><span>&nbsp;Y</span></el-option>
          <el-option value="N"><el-tag :type="'success'">未删除</el-tag><span>&nbsp;N</span></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：" prop="start">
        <el-date-picker
            v-model="form.start"
            value-format="YYYY-MM-DD"
            type="datetime"
            placeholder="请选择开始时间"
        />
      </el-form-item>
      <el-form-item>
        <span>-</span>
      </el-form-item>
      <el-form-item prop="end">
        <el-date-picker
            v-model="form.end"
            value-format="YYYY-MM-DD"
            type="datetime"
            placeholder="请选择结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="search"><el-icon><Search/></el-icon><span>查询</span></el-button>
        <el-button type="primary" plain @click="formReset"><el-icon><Refresh /></el-icon><span>重置</span></el-button>
        <el-button type="primary" plain @click="addDialog = true"><el-icon><Plus /></el-icon><span>新增</span></el-button>
      </el-form-item>
    </el-form>
  <el-table :data="tableData" :row-class-name="rowClass" :table-layout="'auto'" height="1000px">
<!--    <el-table-column prop="" label="" type="selection"></el-table-column>-->
    <el-table-column prop="id" label="用户ID"></el-table-column>
    <el-table-column prop="loginName" label="用户名"></el-table-column>
    <el-table-column prop="isDeleted" label="状态">
      <template #header>
        <el-tooltip
            content="Y：已删除,N：未删除"
            placement="top-start"
            trigger="hover"
        >
          <span>状态</span>
        </el-tooltip>
      </template>
      <template #default="scope">
        <el-tag :type="scope.row.isDeleted === 'N' ? 'success' : 'error'">{{ scope.row.isDeleted }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="createTimeStr" label="创建时间"></el-table-column>
    <el-table-column prop="updateTimeStr" label="更新时间"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="default" plain type="info" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="default" plain type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.isDeleted==='N'" >删除</el-button>
        <el-button size="default" plain type="success" @click="handleOpen(scope.$index, scope.row)" v-else >启动</el-button>
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
  <!--  新增 -->
  <el-dialog v-model="addDialog" title="新增信息" width="30%" center :destroy-on-close="true">
    <el-row>
      <el-col :span="12" :offset="4">
        <el-form ref="addForm" :model="addForm" :rules="rules" @validate="validate(addForm)" status-icon label-width="100px">
          <el-form-item label="用户名" prop="loginName">
            <el-input v-model="addForm.loginName" placeholder="请输入用户名" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addForm.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="addForm.checkPass" show-password placeholder="请输入确认密码"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" @click="addUser(this.addForm)">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="editDialog" title="编辑信息" width="30%" center :destroy-on-close="true">
    <el-form ref="editForm" :model="editForm" :rules="rules" @validate="validate(editForm)" status-icon label-width="100px">
      <el-form-item label="用户名" prop="loginName">
        <el-input v-model="editForm.loginName" placeholder="请输入用户名" ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialog = false">取消</el-button>
        <el-button type="primary" @click="editUser(this.editForm)">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script >
import { markRaw } from 'vue';
import { Delete } from '@element-plus/icons-vue';
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
        isDeleted:'',
        start:'',
        end:'',
      },
      addForm:{
        loginName:'',
        password:'',
        checkPass:''
      },
      editForm:{
        id:'',
        loginName:''
      },
      paginationStyle:{
        marginTop:'20px'
      },
      addDialog:false,
      editDialog:false,
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
    getUserList(){
      const page = {
        page:this.currentPage,
        pageSize:10
      }
      this.axios.post(this.HttpRequestApi.terminal_userManage,this.$Qs.stringify(page))
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data.list
              this.total = resp.data.data.total
            }
          }).catch(error=>{
          console.log(error)
      })
    },
    rowClass(row) {
      if (row.rowIndex%2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    nextPage(page){
      const pager = {
        page:page+1,
        pageSize:10
      }
      this.axios.post(this.HttpRequestApi.terminal_userManage,this.$Qs.stringify(pager))
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
      this.axios.post(this.HttpRequestApi.terminal_userManage,this.$Qs.stringify(pager))
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
      this.axios.post(this.HttpRequestApi.terminal_userManage,this.$Qs.stringify(pager))
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
      this.axios.post(this.HttpRequestApi.terminal_userManage,this.$Qs.stringify(pager))
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data.list
              this.total = resp.data.data.total
            }
          }).catch(error=>{
        console.log(error)
      })
    },
    search(){
      const pager = {
        page:1,
        pageSize:this.pageSize,
        loginName:this.form.loginName,
        isDeleted:this.form.isDeleted,
        start:this.form.start,
        end:this.form.end,
      }
      this.axios.post(this.HttpRequestApi.terminal_userManage,this.$Qs.stringify(pager))
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
      this.editForm.loginName = row.loginName;
      this.editForm.id = row.id;
      this.editDialog = true;
    },
    handleDelete(index,row){
      this.$messageBox.confirm(
        '删除用户：'+row.loginName,
        '确认删除吗?',
        {
          type:'warning',
          icon:markRaw(Delete),
          center:true,
          cancelButtonText:'取消',
          confirmButtonText:'确认',
          draggable:true,
      }).then(()=>{
        this.axios.post(this.HttpRequestApi.terminal_userManage_del,this.$Qs.stringify({id:row.id}))
            .then(resp=>{
              if (resp.data.success){
                this.$message({
                  message: '删除成功',
                  type: 'success',
                  center:true,
                  duration:1500
                })
                this.search();
              } else {
                this.$message({
                  message: '删除失败，请重试',
                  type: 'error',
                  center:true,
                  duration:1500
                })
              }
            }).catch(error=>{
            this.$message({
              message: '删除失败，请重试',
              type: 'error',
              center:true,
              duration:1500
            })
            console.log(error)
        })
      }).catch(()=>{
        //todo
      })
      console.log(index,row)
    },
    validate:function (form) {
      if (form.loginName==''){
        return false;
      }
      if (form.password==''){
        return false;
      }
      if (form.checkPass==''){
        return false;
      }
      return true;
    },
    addUser(form){
      this.$refs.addForm.validate((valid)=> {
        if (valid){
          const adminUser = {
            loginName:form.loginName,
            password:form.password
          }
          this.axios.post(this.HttpRequestApi.terminal_userManage_add,this.$Qs.stringify(adminUser))
              .then(resp=>{
                if (resp.data.success){
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    center:true,
                    duration:1500
                  })
                  this.addDialog = false
                  this.search();
                } else {
                  this.$message({
                    message: resp.data.msg,
                    type: 'error',
                    center:true,
                    duration:1500
                  })
                }
              }).catch(error=>{
            this.$message({
              message: '保存失败，请重试',
              type: 'error',
              center:true,
              duration:1500
            })
            console.log(error)
          })
        }
      })
    },
    editUser(form){
      this.$refs.editForm.validate((valid)=> {
        if (valid){
          const adminUser = {
            id:form.id,
            loginName:form.loginName
          }
          this.axios.post(this.HttpRequestApi.terminal_userManage_update,this.$Qs.stringify(adminUser))
              .then(resp=>{
                if (resp.data.success){
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                    center:true,
                    duration:1500
                  })
                  this.editDialog = false
                  this.search();
                } else {
                  this.$message({
                    message: '保存失败，请重试',
                    type: 'error',
                    center:true,
                    duration:1500
                  })
                }
              }).catch(error=>{
              this.$message({
                message: '保存失败，请重试',
                type: 'error',
                center:true,
                duration:1500
              })
            console.log(error)
          })
        }
      })
    },
    formReset(){
      this.$refs.form.resetFields()
    },
    handleOpen(index,row){
      this.$messageBox.confirm(
        '启用用户：'+row.loginName,
        '确认启用吗?',{
          type:'warning',
          icon:markRaw(Delete),
          center:true,
          cancelButtonText:'取消',
          confirmButtonText:'确认',
          draggable:true,
        }).then(()=>{
          const user = {
            id:row.id,
            isDeleted:'N'
          }
        this.axios.post(this.HttpRequestApi.terminal_userManage_update,this.$Qs.stringify(user))
            .then(resp=>{
              if (resp.data.success){
                this.$message({
                  message: '启用成功',
                  type: 'success',
                  center:true,
                  duration:1500
                })
                this.search();
              } else {
                this.$message({
                  message: '启用失败，请重试',
                  type: 'error',
                  center:true,
                  duration:1500
                })
              }
            }).catch(error=>{
          this.$message({
            message: '启用失败，请重试',
            type: 'error',
            center:true,
            duration:1500
          })
          console.log(error)
        })
      }).catch(()=>{
        //todo
      })
    }
  },
}



</script>

<style>
.el-popper.is-dark{
  background: var(--el-text-color-regular);
}
</style>