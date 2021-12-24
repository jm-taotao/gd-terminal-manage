<template>
<!--    <v-main>-->
<!--      <v-container fluid>-->
        <!--<v-row>-->
          <v-col cols="12" md="4" offset="4">
            <v-form ref="form">
              <v-text-field v-model="form.name" :rules="nameRules" label="用户名" required ></v-text-field>
              <v-text-field v-model="form.password" :rules="passwordRules" label="密码" required ></v-text-field>
              <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate" >
                登录
              </v-btn>
              <v-btn color="error" class="mr-4" @click="reset" >
                清空
              </v-btn>
            </v-form>
          </v-col>
        <!--</v-row>-->
<!--      </v-container>-->
<!--    </v-main>-->
</template>
<script>
  import { login } from '../request/api';
  import {get, post} from '../request/http'
  export default {
    name: 'index',
    data() {
      return {
        valid:true,
        checkbox: false,
        form:{
          name:'',
          password:'',
        },
        nameRules:[
          v => !!v || '请输入用户名',
        ],
        passwordRules:[
          v => !!v || '请输入密码'
        ]
      }
    },
    methods: {
      validate () {
        var validate = this.$refs.form.validate();
        if (validate){
          post(login,{
            name:this.form.name,
            password:this.form.password
          }).then(res => {
            console.log(res);
            this.$router.push({path:'home'});
          });
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  form{
    margin-top: 150px;
  }
</style>
