<template>
  <el-row style="display: flex;align-items: center;">
    <el-icon :size="20" ><Edit/></el-icon><span>菜单管理</span>
  </el-row>
  <el-row>
    <span style="height: 1px;width: 100%;margin:20px 0;background-color: #ffffff"></span>
  </el-row>
  <el-form :model="form" ref="form" :inline="true">
    <el-form-item label="菜单名称：" prop="name">
      <el-input
          :maxlength="20"
          v-model="form.name"
          placeholder="请输入菜单名称"
      />
    </el-form-item>
    <el-form-item label="状态：" prop="isDeleted">
      <el-select v-model="form.isDeleted" class="m-2" placeholder="请选择状态">
        <el-option value="Y"><el-tag :type="'danger'">已删除</el-tag><span>&nbsp;Y</span></el-option>
        <el-option value="N"><el-tag :type="'success'">未删除</el-tag><span>&nbsp;N</span></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain @click="search"><el-icon><Search /></el-icon><span>查询</span></el-button>
      <el-button type="primary" plain @click="formReset"><el-icon><Refresh /></el-icon><span>重置</span></el-button>
      <el-button type="primary" plain @click="addGparent"><el-icon><Plus /></el-icon><span>新增</span></el-button>
      <el-button type="primary" plain @click="handleExpandAll(defaultExpandAll)" ><el-icon><Switch /></el-icon><span>展开/合并</span></el-button>
    </el-form-item>
  </el-form>
  <el-table :data="tableData"
            :row-class-name="rowClass"
            :default-expand-all="defaultExpandAll"
            v-if="refreshTable"
            :table-layout="'auto'"
            row-key="id"
            height="100%">
    <el-table-column prop="id" label="菜单ID"></el-table-column>
    <el-table-column prop="icon" label="菜单图标">
      <template #default="scope">
        <el-icon>
          <component :is="scope.row.icon"/>
        </el-icon>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="菜单名称"></el-table-column>
    <el-table-column prop="url" label="菜单地址"></el-table-column>
    <el-table-column prop="sno" label="序号"></el-table-column>
    <el-table-column prop="isDeleted" label="状态">
      <template #header>
        <el-tooltip
            class="box-item"
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
        <el-button size="default" plain type="primary" @click="handleAdd(scope.$index, scope.row)"><el-icon><Plus /></el-icon><span>新增子菜单</span></el-button>
        <el-button size="default" plain type="info" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.level<3" ><el-icon><Edit /></el-icon><span>编辑</span></el-button>
        <el-button size="default" plain type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.isDeleted==='N'" ><el-icon><Delete /></el-icon><span>删除</span></el-button>
        <el-button size="default" plain type="success" @click="handleEdit(scope.$index, scope.row)" v-else ><el-icon><Open /></el-icon><span>启用</span></el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--  新增 -->
  <el-dialog v-model="addDialog" title="新增菜单" width="30%" center :destroy-on-close="true">
        <el-form ref="addForm" :model="addForm" :rules="rules" @validate="validate(addForm)" label-width="100px">
          <el-form-item label="父级菜单" prop="pname">
            <el-input  v-model="addForm.pname" disabled></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" prop="name">
            <el-input  v-model="addForm.name" placeholder="请输入菜单名称" ></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="addForm.icon" placeholder="请输入菜单图标" ></el-input>
          </el-form-item>
          <el-form-item label="菜单地址" prop="url">
            <el-input v-model="addForm.url" show-url placeholder="请输入菜单地址"></el-input>
          </el-form-item>
          <el-form-item label="序号" prop="sno">
            <el-input-number type="number" v-model="addForm.sno" show-url placeholder="请输入序号"></el-input-number>
          </el-form-item>
        </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" @click="addMenu(this.addForm)">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!--  编辑 -->
  <el-dialog v-model="editDialog" title="编辑信息" width="30%" center :destroy-on-close="true">
    <el-form ref="editForm" :model="editForm" :rules="rules" @validate="validate(editForm)" label-width="100px">
      <el-form-item label="父级菜单" prop="pname">
        <el-tree-select
            v-model="editForm.pname"
            :data="menuTree"
            check-strictly
            filterable
            :render-after-expand="true"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入菜单名称" ></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="editForm.icon" placeholder="请输入菜单图标" ></el-input>
      </el-form-item>
      <el-form-item label="菜单地址" prop="url">
        <el-input v-model="editForm.url" show-url placeholder="请输入菜单地址"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="sno">
        <el-input-number type="number" v-model="editForm.sno" show-url placeholder="请输入序号"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialog = false">取消</el-button>
        <el-button type="primary" @click="editMenu(this.editForm)">保存</el-button>
      </span>
    </template>
  </el-dialog>


  <el-dialog v-model="addGPDialog" title="新增菜单" width="30%" center :destroy-on-close="true">
    <el-form ref="addForm" :model="addGPForm" :rules="rules" @validate="validate(addGPForm)" label-width="100px">
      <el-form-item label="父级菜单" prop="pname">
        <el-tree-select
            v-model="addGPForm.pname"
            :data="menuTree"
            check-strictly
            filterable
            :render-after-expand="true"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input  v-model="addGPForm.name" placeholder="请输入菜单名称" ></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="addGPForm.icon" placeholder="请输入菜单图标" ></el-input>
      </el-form-item>
      <el-form-item label="菜单地址" prop="url">
        <el-input v-model="addGPForm.url" show-url placeholder="请输入菜单地址"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="sno">
        <el-input-number type="number" v-model="addGPForm.sno" show-url placeholder="请输入序号"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addGPDialog = false">取消</el-button>
<!--        <el-button type="primary" @click="addMenu(this.addGPForm)">保存</el-button>-->
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { markRaw } from 'vue';
import { Delete } from '@element-plus/icons-vue';

export default {
  name: "MenuList",
  data(){
    return {
      defaultExpandAll:true,
      refreshTable:true,
      currentPage:1,
      tableData:[],
      pageSize:10,
      pageSizes:[10, 20, 30, 40, 50, 100],
      menuTree:[],
      total:0,
      form:{
        name:'',
        isDeleted:'',
        start:'',
        end:'',
      },
      addForm:{
        name:'',
        pname:'',
        pid:'',
        icon:'',
        url:'',
        sno:0
      },
      addGPForm:{
        name:'',
        pname:'',
        pid:'',
        icon:'',
        url:'',
        sno:0
      },
      editForm:{
        id:'',
        name:'',
        pname:'',
        icon:'',
        pid:'',
        url:'',
        sno:0
      },
      paginationStyle:{
        marginTop:'20px'
      },
      addDialog:false,
      editDialog:false,
      addGPDialog:false,
      rules: {
        name: [{ required: true, message: "请输菜单名称", trigger: "blur" }],
        url: [{ required: true, message: "请输用菜单地址", trigger: "blur" }],
        sno: [{ required: true, message: "请输用序号", trigger: "blur" }],
      }
    }
  },
  created() {
    this.getMenuList();
    this.getMenuListForLabel()
  },
  methods:{
    getMenuList(){
      this.axios.post(this.HttpRequestApi.terminal_menuManage)
          .then(resp=>{
            if (resp.data.success){
              this.tableData = resp.data.data
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
    search(){
      const pager = {
        name:this.form.name,
        isDeleted:this.form.isDeleted,
        start:this.form.start,
        end:this.form.end,
      }
      this.axios.post(this.HttpRequestApi.terminal_menuManage,this.$Qs.stringify(pager)).then(resp=>{
        if (resp.data.success){
          this.tableData = resp.data.data
        }
      }).catch(error=>{
        console.log(error)
        this.$message({
          message: '查询异常',
          type: 'warning',
          center:true,
          duration:1500
        })
      })
    },
    handleAdd(index,row){
      if (row.pname){
        this.addForm.pname = row.pname;
      }else {
        this.addForm.pname = '管理平台';
      }
      this.addForm.pid = row.id;
      this.addForm.icon= ''
      this.addDialog = true;
    },
    handleEdit(index,row){
      this.editForm.id = row.id;
      this.editForm.name = row.name;
      if (row.pname){
        this.editForm.pname = row.pname;
      }else {
        this.editForm.pname = '管理平台';
      }
      this.editForm.url = row.url;
      this.editForm.sno = row.sno;
      this.editForm.icon = row.icon;
      this.editDialog = true;
    },
    handleDelete(index,row){
      this.$messageBox.confirm(
          '删除用户：'+row.name,
          '确认删除吗?',
          {
            type:'warning',
            icon:markRaw(Delete),
            center:true,
            cancelButtonText:'取消',
            confirmButtonText:'确认',
            draggable:true,
          }).then(()=>{
        this.axios.post(this.HttpRequestApi.terminal_menuManage_del,this.$Qs.stringify({id:row.id}))
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
      if (form.url==''){
        return false;
      }
      if (form.sno==''){
        return false;
      }
      return true;
    },
    addMenu(form){
      this.$refs.addForm.validate((valid)=> {
        if (valid){
          const adminMenu = {
            name:form.name,
            url:form.url,
            pid:form.pid,
            icon:form.icon,
            sno:form.sno,
          }
          this.axios.post(this.HttpRequestApi.terminal_menuManage_add,this.$Qs.stringify(adminMenu))
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
    editMenu(form){
      this.$refs.editForm.validate((valid)=> {
        if (valid){
          const adminMenu = {
            id:form.id,
            name:form.name,
            pid:form.pid,
            url:form.url,
            sno:form.sno,
            icon:form.icon
          }
          this.axios.post(this.HttpRequestApi.terminal_menuManage_update,this.$Qs.stringify(adminMenu))
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
    addGparent(){
      this.addGPForm.pname = '管理平台';
      this.addGPDialog = true;
    },
    getMenuListForLabel() {
      this.axios.post(this.HttpRequestApi.terminal_menuManage_treeForLabel)
          .then(resp=>{
            if (resp.data.success){
              this.menuTree = resp.data.data
            }
          }).catch(error=>{
        console.log(error)
      })
    },
    handleExpandAll(val){
      if (!val){
        this.refreshTable = false;
        this.defaultExpandAll = true;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      }else {
        this.refreshTable = false;
        this.defaultExpandAll = false;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      }
    },
  },

}

</script>

<style>
.el-popper.is-dark{
  background: var(--el-text-color-regular);
}
</style>