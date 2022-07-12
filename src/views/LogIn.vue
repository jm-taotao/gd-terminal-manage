<template>
  <el-row :justify="'center'" label-width="120px" >
    <el-form ref="form" :model="form" :rules="rules" @validate="validate" status-icon :label-position="labelPosition" label-width="100px">
      <el-form-item label="用户名" prop="account">
        <el-input v-model="form.account" placeholder="请输入用户名" ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" show-password placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit(form)">登录</el-button>
        <el-button @click="resetForm(form)">Reset</el-button>
        <el-button type="primary">注册</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import {ElMessage} from "element-plus";
import router from "@/router";
import axios from "axios";
import qs from "qs";
import HttpRequestAPI from "@/api/HttpRequestApi";
export default {
  name: "LogIn",
  data(){
    return{
      labelPosition:'right',
      form:{
        account:'',
        password:''
      },
      rules: {
        account: [{ required: true, message: "请输用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输用密码", trigger: "blur" }],
      }
    }
  },
  methods:{
    submit:function (){
      const user = {
        account:this.form.account,
        password:this.form.password,
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          axios({
                method: 'post',
                url: HttpRequestAPI.terminal_login,
                data: qs.stringify(user)
              })
              .then(resp=>{
                if (resp.data.code=='100000'){
                  this.$store.commit('initLoginUser',resp.data.data)
                  ElMessage({
                    message: '登录成功',
                    type: 'success',
                    center:true,
                    duration:1500
                  })
                  router.push(HttpRequestAPI.terminal_index)
                }else {
                  ElMessage({
                    message: resp.data.msg,
                    type: 'warning',
                    center:true,
                    duration:1500
                  })
                }
              })
              .catch(error=>{
                console.log(error)
                ElMessage({
                  message: '登录失败',
                  type: 'error',
                  center:true,
                  duration:1500
                })
              })
        } else {
          return false
        }
      });

    },
    reset:function (){
      this.$refs.form.resetFields()
    },
    formRules:function (){
       // this.$refs.form.name.validate();
    },
    resetForm:function (form){
      form.resetField()
    },
    validate:function () {
      if (this.name==''){
        return false;
      }
      if (this.password==''){
        return false;
      }
      return true;
    }
  },

}

</script>

<style scoped>

</style>