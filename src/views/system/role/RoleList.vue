<template>
  <el-row style="display: flex;align-items: center;">
    <el-icon :size="20" ><Edit/></el-icon><span>角色管理</span>
  </el-row>
  <el-row>
    <span style="height: 1px;width: 100%;margin:20px 0;background-color: #ffffff"></span>
  </el-row>
  <!--  <el-row>-->
  <el-form :model="form" ref="form" :inline="true">
    <el-form-item label="角色名：" prop="name">
      <el-input
          :maxlength="20"
          v-model="form.name"
          placeholder="请输入角色名"
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
    <el-table-column prop="" label="" type="selection"></el-table-column>
    <el-table-column prop="id" label="角色ID"></el-table-column>
    <el-table-column prop="name" label="角色名"></el-table-column>
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
        <el-tag :type="scope.row.isDeleted === 'N' ? 'success' : 'danger'">{{ scope.row.isDeleted }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="createTimeStr" label="创建时间"></el-table-column>
    <el-table-column prop="updateTimeStr" label="更新时间"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="default" plain type="info" @click="handlePower(scope.$index, scope.row)"><el-icon><Edit /></el-icon><span>权限</span></el-button>
        <el-button size="default" plain type="info" @click="handleEdit(scope.$index, scope.row)"><el-icon><Edit /></el-icon><span>编辑</span></el-button>
        <el-button size="default" plain type="success" @click="handleOpen(scope.$index, scope.row)" v-if="scope.row.isDeleted==='Y'"><el-icon><Open /></el-icon><span>启用</span></el-button>
        <el-button size="default" plain type="danger" @click="handleDelete(scope.$index, scope.row)" v-else><el-icon><Delete /></el-icon><span>删除</span></el-button>
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
          <el-form-item label="角色名" prop="name">
            <el-input v-model="addForm.name" placeholder="请输入角色名" ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" @click="addRole(this.addForm)">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="editDialog" title="编辑信息" width="30%" center :destroy-on-close="true">
    <el-form ref="editForm" :model="editForm" :rules="rules" @validate="validate(editForm)" status-icon label-width="100px">
      <el-form-item label="角色名" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入角色名" ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialog = false">取消</el-button>
        <el-button type="primary" @click="editRole(this.editForm)">保存</el-button>
      </span>
    </template>
  </el-dialog>


  <el-dialog v-model="powerDialog"
             title="权限管理"
             width="30%"
             center
             :destroy-on-close="true"
             @close="powerDialogClose"
  >
    <el-tree
        ref="tree"
        :data="menuTree"
        show-checkbox
        node-key="id"
        :default-checked-keys="roleMenuIds"
        highlight-current
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="powerDialog = false">取消</el-button>
        <el-button type="primary" @click="saveMenu">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script >
import { markRaw } from 'vue';
import { Delete } from '@element-plus/icons-vue';
export default {
  name: "RoleList",
  data(){
    return {
      currentPage:1,
      tableData:[],
      pageSize:10,
      pageSizes:[10, 20, 30, 40, 50, 100],
      total:0,
      form:{
        name:'',
        isDeleted:'',
        start:'',
        end:'',
      },
      addForm:{
        name:'',
      },
      editForm:{
        id:'',
        name:'',
        isDeleted:''
      },
      paginationStyle:{
        marginTop:'20px'
      },
      addDialog:false,
      editDialog:false,
      powerDialog:false,
      menuTree:[],
      roleMenuIds:[],
      rules: {
        name: [{ required: true, message: "请输角色名", trigger: "blur" }]
      }
    }
  },
  created() {
    this.getRoleList();
    this.getMenuList();
    this.getRoleMenu();
  },
  methods:{
    getRoleList(){
      const page = {
        page:this.currentPage,
        pageSize:10
      }
      this.axios.post(this.HttpRequestApi.terminal_roleManage,this.$Qs.stringify(page))
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data.list
              this.total = resp.data.data.total
            }
          }).catch(error=>{
        console.log(error)
      })
    },
    getMenuList(){
      this.axios.post(this.HttpRequestApi.terminal_menuManage_treeForLabelID)
          .then(resp=>{
            if (resp.data.success){
              this.menuTree = resp.data.data
            }
          }).catch(error=>{
        console.log(error)
      })
    },
    getRoleMenu(){
      // this.axios.post(this.HttpRequestApi.terminal_roleManage_roleMenuList,this.$Qs.stringify({roleId:row.id}))
      //     .then(resp=>{
      //       if (resp.data.success){
      //         this.roleMenuIds = resp.data.data
      //         console.log(this.roleMenuIds)
      //       }
      //     }).catch(error=>{
      //   console.log(error)
      // })
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
      this.axios.post(this.HttpRequestApi.terminal_roleManage,this.$Qs.stringify(pager))
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
      this.axios.post(this.HttpRequestApi.terminal_roleManage,this.$Qs.stringify(pager))
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
      this.axios.post(this.HttpRequestApi.terminal_roleManage,this.$Qs.stringify(pager))
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
      this.axios.post(this.HttpRequestApi.terminal_roleManage,this.$Qs.stringify(pager))
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
        name:this.form.name,
        isDeleted:this.form.isDeleted,
        start:this.form.start,
        end:this.form.end,
      }
      this.axios.post(this.HttpRequestApi.terminal_roleManage,this.$Qs.stringify(pager))
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
      this.editForm.name = row.name;
      this.editForm.id = row.id;
      this.editDialog = true;
    },
    handlePower(index,row){
      // console.log(index,row);
      this.axios.post(this.HttpRequestApi.terminal_roleManage_roleMenuList,this.$Qs.stringify({roleId:row.id}))
          .then(resp=>{
            if (resp.data.success){
              this.roleMenuIds = resp.data.data
              console.log(this.roleMenuIds)
            }
          }).catch(error=>{
        console.log(error)
      })
      this.powerDialog = true;
    },
    handleOpen(index,row){
      this.$messageBox.confirm(
        '启用角色：'+row.name,
        '确认启用吗?',{
          type:'warning',
          icon:markRaw(Delete),
          center:true,
          cancelButtonText:'取消',
          confirmButtonText:'确认',
          draggable:true,
        }).then(()=>{
        const role = {
          id:row.id,
          name:row.name,
          isDeleted:'N'
        }
        this.axios.post(this.HttpRequestApi.terminal_roleManage_update,this.$Qs.stringify(role))
            .then(resp=>{
              if (resp.data.success){
                this.$message({
                  message: '保存成功',
                  type: 'success',
                  center:true,
                  duration:1500
                })
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
      })
    },
    handleDelete(index,row){
      this.$messageBox.confirm(
          '删除角色：'+row.name,
          '确认删除吗?',
          {
            type:'warning',
            icon:markRaw(Delete),
            center:true,
            cancelButtonText:'取消',
            confirmButtonText:'确认',
            draggable:true,
          }).then(()=>{
        this.axios.post(this.HttpRequestApi.terminal_roleManage_del,this.$Qs.stringify({id:row.id}))
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
      if (form.name==''){
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
    addRole(form){
      this.$refs.addForm.validate((valid)=> {
        if (valid){
          const adminRole = {
            name:form.name,
            password:form.password
          }
          this.axios.post(this.HttpRequestApi.terminal_roleManage_add,this.$Qs.stringify(adminRole))
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
    editRole(form){
      this.$refs.editForm.validate((valid)=> {
        if (valid){
          const role = {
            id:form.id,
            name:form.name
          }
          this.axios.post(this.HttpRequestApi.terminal_roleManage_update,this.$Qs.stringify(role))
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
    powerDialogClose(){
        this.roleMenuIds = [];
    },
    saveMenu(){
      console.log(this.$refs.tree.getCheckedNodes())
    }
  },
}



</script>

<style>
.el-popper.is-dark{
  background: var(--el-text-color-regular);
}
</style>