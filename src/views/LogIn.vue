<template>
  <div id="building">
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
<!--          <el-button @click="resetForm(form)">Reset</el-button>-->
<!--          <el-button type="primary">注册</el-button>-->
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
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
          this.$Axios({
                method: 'post',
                url: this.HttpRequestApi.terminal_login,
                data: this.$Qs.stringify(user)
              })
              .then(resp=>{
                if (resp.data.code=='100000'){
                  this.$store.commit('initToken',resp.data.data.token)
                  this.$store.commit('initLoginUser',resp.data.data.user)
                  this.$message({
                    message: '登录成功',
                    type: 'success',
                    center:true,
                    duration:1500
                  })
                  this.$router.push(this.HttpRequestApi.terminal_index)
                }else {
                  this.$message({
                    message: resp.data.msg,
                    type: 'warning',
                    center:true,
                    duration:1500
                  })
                }
              })
              .catch(error=>{
                console.log(error)
                this.$message({
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
#building{
  background:url("../assets/bg.jpeg");
  width:100%;
  height:100%;
  position:fixed;
  background-size:100% 100%;
}
.el-row{
  margin-top: 25%;
  color: #fff;
}
</style>