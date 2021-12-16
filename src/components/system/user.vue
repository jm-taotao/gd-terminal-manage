<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-breadcrumbs>
      <v-spacer></v-spacer>
      <v-breadcrumbs-item>系统管理</v-breadcrumbs-item>
      <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
      <v-breadcrumbs-item :href="thisComponentPath" link>用户管理</v-breadcrumbs-item>
    </v-breadcrumbs>

    <form ref="form">
      <v-row dense="" :style="display">
        <v-col lg="2" md="2" sm="2">
          <v-text-field v-model="form.name" label="用户名" placeholder="用户名" outlined></v-text-field>
        </v-col>
        <v-col lg="2" md="2" sm="2">
          <v-text-field v-model="form.mobile" label="手机号" placeholder="手机号" outlined></v-text-field>
        </v-col>
        <v-col lg="2" md="2" sm="2">
          <v-btn :text="true" outlined large class="success"><v-icon left>mdi-card-search-outline</v-icon>查询</v-btn>
        </v-col>
      </v-row>
    </form>

    <v-data-table :headers="headers" :items="users" :page.sync="page" :item-per-page="itemsPerPage" hide-default-footer >
      <template v-slot:item.actions="{ item }">
        <v-btn :text="true" outlined small color="success"><v-icon left>mdi-account-details</v-icon>详情</v-btn>
        <v-btn :text="true" outlined small color="warning"><v-icon left>mdi-pencil</v-icon>编辑</v-btn>
        <v-btn :text="true" outlined small color="error"><v-icon left>mdi-delete</v-icon>删除</v-btn>
      </template>
    </v-data-table>
    <v-pagination v-model="page" :length="pageCount"></v-pagination>
  </div>

</template>

<script>
    export default {
      name: "user",
      data() {
        return {
          page: 1,
          pageCount: 10,
          itemsPerPage: 2,
          form:{name:'',mobile:''},
          display:{alignItems:'baseline'},
          headers: [
            {text: 'Dessert (100g serving)', align: 'start', sortable: false, value: 'name'},
            {text: 'Calories', value: 'calories'},
            {text: 'Fat (g)', value: 'fat'},
            {text: 'Carbs (g)', value: 'carbs'},
            {text: 'Protein (g)', value: 'protein'},
            {text: '操作', value: 'actions',sortable:false},
          ],
          users: [],
          thisComponentPath:'#/system/user',
        }
      },
      created() {
        this.initialize()
      },

      methods: {
        initialize() {
          this.users = [
            {
              name: 'Frozen Yogurt',
              calories: 159,
              fat: 6.0,
              carbs: 24,
              protein: 4.0,
            },
            {
              name: 'Ice cream sandwich',
              calories: 237,
              fat: 9.0,
              carbs: 37,
              protein: 4.3,
            },
            {
              name: 'Eclair',
              calories: 262,
              fat: 16.0,
              carbs: 23,
              protein: 6.0,
            },
            {
              name: 'Cupcake',
              calories: 305,
              fat: 3.7,
              carbs: 67,
              protein: 4.3,
            },
            {
              name: 'Gingerbread',
              calories: 356,
              fat: 16.0,
              carbs: 49,
              protein: 3.9,
            },
            {
              name: 'Jelly bean',
              calories: 375,
              fat: 0.0,
              carbs: 94,
              protein: 0.0,
            },
            {
              name: 'Lollipop',
              calories: 392,
              fat: 0.2,
              carbs: 98,
              protein: 0,
            },
            {
              name: 'Honeycomb',
              calories: 408,
              fat: 3.2,
              carbs: 87,
              protein: 6.5,
            },
            {
              name: 'Donut',
              calories: 452,
              fat: 25.0,
              carbs: 51,
              protein: 4.9,
            },
            {
              name: 'KitKat',
              calories: 518,
              fat: 26.0,
              carbs: 65,
              protein: 7,
            },
          ]
        }
      }
    }
</script>

<style scoped>

</style>
