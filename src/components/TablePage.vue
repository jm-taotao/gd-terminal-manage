<template>
  <el-pagination background layout="prev, pager, next" :total="total" v-bind:dataSize="dataArray.length" :style="paginationStyle"/>
</template>
<script>

export default {
  name: "TablePage",
  props:{
    dataArray:{
      type:Array,
      required:true
    },
    total:{
      type:Number,
      required: true
    }
  },
  data(){
    return{
      totalPage:0,
      paginationStyle:{
          marginTop:'20px'
      }
    }
  }
}
</script>

<style scoped>

</style>