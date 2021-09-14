<template>
  <div class="brand-wrapper">
    <!--搜索区域-->
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item label="品牌名称">
          <el-input v-model="searchForm.brandName" placeholder="请输入品牌名称"></el-input>
        </el-form-item>

        <el-form-item label="品牌描述">
          <el-input v-model="searchForm.brandDesc" placeholder="请输入品牌描述"></el-input>
        </el-form-item>

        <el-date-picker
            v-model="chooseData"
            style="width: 330px"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="--"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH-mm-ss"
            @change="chooseDataChange"
            size="mini"
            align="right">
        </el-date-picker>

        <el-form-item style="margin-left: 10px">
          <el-button type="success" @click="search">搜索</el-button>
          <el-button type="info" @click="resetSearchForm">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
    <!--操作区域-->
    <div class="exec-box">
      <el-button type="primary" size="mini" @click="addBtn" v-hasperm="'goods:brand:add'">新建</el-button>
      <el-button type="success" size="mini" v-hasperm="'goods:brand:update'" :disabled="selectIds.length!=1" @click="createDialog=true,findById(selectIds[0])" >编辑</el-button>
      <el-button type="danger" size="mini" v-hasperm="'goods:brand:batchdelete'" :disabled="selectIds.length<=0" @click="showDelete">删除</el-button>
    </div>


    <el-scrollbar>

      <!--数据表单-->
      <div class="table-data">
        <el-table
            @selection-change="selectChange"
            :data="tableData"
            style="width: 100%">
          stripe: true
          <el-table-column
              type="selection"
              align="center">
          </el-table-column>
          <el-table-column
              align="center"
              prop="id"
              label="品牌ID"
          >
          </el-table-column>
          <el-table-column
              align="center"
              prop="brandName"
              label="品牌名称"
          >
          </el-table-column>
          <el-table-column
              align="center"
              prop="brandSite"
              label="品牌站点">
            <!--            使用插槽取值-->
            <template v-slot="Site">
              <el-link type="primary" target="_blank" :href="Site.row.brandSite">{{Site.row.brandSite}}</el-link>
            </template>

          </el-table-column>
          <el-table-column
              align="center"
              prop="brandDesc"
              label="品牌描述">
          </el-table-column>
          <el-table-column
              align="center"
              prop="brandLogo"
              label="品牌Logo">

            <template v-slot="logo">
              <img :src="logo.row.brandLogo" width="100px" height="40px" >
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="操作">

            <template v-slot="obj">
              <el-button type="success" v-hasperm="'goods:brand:update'" size="mini" @click="findById(obj.row.id)">编辑</el-button>
              <el-popconfirm
                  style="margin-left: 10px"
                  confirm-button-text='确定'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  @confirm="deleteById(obj.row.id)"
                  icon-color="red"
                  title="确定要删除这一条数据吗？"
              >
                <el-button slot="reference" v-hasperm="'goods:brand:delete'" type="primary" size="mini">删除</el-button>
              </el-popconfirm>

<!--              <el-button type="primary" size="mini">删除</el-button>-->
            </template>

          </el-table-column>

        </el-table>
      </div>

      <!--分页区域-->

      <div class="page-box">
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="searchForm.pageSize"
            :current-page="searchForm.currentPage"
            @current-change="pageChange"
            :total="total">
        </el-pagination>
      </div>
    </el-scrollbar>

    <!--新建弹框-->

    <el-dialog
        title="操作"
        :visible.sync="createDialog"
        width="40%">

      <el-form ref="form" label-width="80px" :model="formData" :rules="rules" label-position="left">

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input v-model="formData.brandName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌站点" prop="brandSite">
              <el-input v-model="formData.brandSite"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="品牌Logo">
<!--          <el-input v-model="formData.brandLogo"></el-input>-->
          <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :http-request="chooseImg"
              :show-file-list="false">

            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="品牌描述">
          <el-input v-model="formData.brandDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="createDialog = false" size="mini">取 消</el-button>
    <el-button type="success" @click="addOrEdit" size="mini" >确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script src="./index.js">
</script>

<style src="./index.scss" lang="scss">

</style>