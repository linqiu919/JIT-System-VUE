<template>
  <div class="brand-wrapper">
    <!--搜索区域-->
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item label="员工姓名">
          <el-input v-model="searchForm.adminName" placeholder="请输入员工姓名"></el-input>
        </el-form-item>

        <el-form-item label="员工手机号">
          <el-input v-model="searchForm.adminPhone" placeholder="请输入员工手机号"></el-input>
        </el-form-item>


        <el-form-item label="员工性别">
          <el-select v-model="searchForm.gender" placeholder="请选择性别">
            <el-option label="男" value="0"/>
            <el-option label="女" value="1"/>
            <el-option label="保密" value="2"/>
          </el-select>
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
      <el-button type="primary" v-hasperm="'system:admin:add'" size="mini" @click="addBtn">新建员工</el-button>
      <el-button type="success" v-hasperm="'system:admin:update'" size="mini" :disabled="selectIds.length!=1" @click="createDialog=true,findById(selectIds[0])">编辑员工</el-button>
      <el-button type="danger" v-hasperm="'system:admin:batchdelete'" size="mini" :disabled="selectIds.length<=0" @click="showDelete">删除员工</el-button>
      <el-button type="danger" v-hasperm="'system:admin:export'" size="mini" @click="getExcel">导出表格</el-button>
<!--      <a id="exportExcel" class="el-button el-button&#45;&#45;warning el-button&#45;&#45;mini" v-hasperm="'system:admin:export'" style="color: #ffffff;text-decoration: none" :href="this.export+this.token">导出表格</a>-->
<!--      <el-button type="warning" size="mini" @click="exportExcel">导出表格</el-button>-->
    </div>


    <el-scrollbar>

      <!--数据表格-->
      <div class="table-data">
        <el-table
            @selection-change="selectChange"
            :data="tableData"
            style="width: 100%">
          <!--          stripe: true-->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="员工ID">
                  <span>{{ props.row.id}}</span>
                </el-form-item>
                <el-form-item label="员工账户">
                  <span>{{ props.row.adminAccount}}</span>
                </el-form-item>
                <el-form-item label="员工姓名">
                  <span>{{ props.row.adminName}}</span>
                </el-form-item>
                <el-form-item label="员工性别">
                    <el-tag v-if="props.row.gender==0">男</el-tag>
                    <el-tag v-if="props.row.gender==1" type="success">女</el-tag>
                    <el-tag v-if="props.row.gender==2" type="info">保密</el-tag>
                </el-form-item>
                <el-form-item label="员工手机">
                  <span>{{ props.row.adminPhone}}</span>
                </el-form-item>
                <el-form-item label="员工头像">
                  <img :src="props.row.adminAvatar" width="40px" height="40px" style="border-radius: 45%">
                </el-form-item>
                <el-form-item label="员工邮箱">
                  <span>{{ props.row.adminEmail }}</span>
                </el-form-item>
                <el-form-item label="是否激活">
                  <el-switch
                      v-model="props.row.isActive"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      disabled>
                  </el-switch>
                </el-form-item>
                <el-form-item label="身份号码">
                  <span>{{ props.row.adminCode}}</span>
                </el-form-item>
                <el-form-item label="是否超管">
                  <el-switch
                      v-model="props.row.isAdmin"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      disabled>
                  </el-switch>
                </el-form-item>
                <el-form-item label="员工薪资">
                  <span>{{ props.row.adminSalary}}</span>
                </el-form-item>
                <el-form-item label="员工地址">
                  <span>{{ props.row.adminAddress}}</span>
                </el-form-item>

              </el-form>
            </template>
          </el-table-column>

          <el-table-column
              type="selection"
              align="center">
          </el-table-column>
          <el-table-column
              align="center"
              prop="id"
              label="员工ID"
          >
          </el-table-column>

          <el-table-column
              align="center"
              prop="adminName"
              label="员工姓名"
          >
          </el-table-column>
          <el-table-column
              align="center"
              prop="adminAvatar"
              label="员工头像"
          >
            <template v-slot="logo">
              <img :src="logo.row.adminAvatar" width="40px" height="40px" style="border-radius: 45%">
            </template>
          </el-table-column>


          <el-table-column
              align="center"
              prop="isActive"
              label="是否可用"
          >
            <template v-slot="obj">
              <el-switch
                  v-model="obj.row.isAdmin"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  disabled>
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              prop="adminSalary"
              label="员工薪资"
          >
          </el-table-column>

          <el-table-column
              align="center"
              label="操作">

            <template v-slot="obj">
              <el-button type="success" v-hasperm="'system:admin:update'"  size="mini" @click="findById(obj.row.id)">编辑</el-button>
              <el-popconfirm
                  style="margin-left: 10px"
                  confirm-button-text='确定'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  @confirm="deleteById(obj.row.id)"
                  icon-color="red"
                  title="确定要删除这一条数据吗？"
              >
                <el-button slot="reference" v-hasperm="'system:admin:delete'"  type="primary" size="mini">删除</el-button>
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

<!-- 以下为添加与修改框显示的内容-->
      <el-form ref="form" label-width="80px" :model="formData" :rules="rules" label-position="left">

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item  label="员工账户" prop="adminAccount">
              <el-input :disabled="disabled" v-model="formData.adminAccount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工姓名" prop="adminName">
              <el-input v-model="formData.adminName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工性别" prop="gender">
              <el-radio v-model="formData.gender" :label="0">男</el-radio>
              <el-radio v-model="formData.gender" :label="1">女</el-radio>
              <el-radio v-model="formData.gender" :label="2">保密</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工手机" prop="adminPhone">
              <el-input v-model="formData.adminPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工邮箱" prop="adminEmail">
              <el-input v-model="formData.adminEmail"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否激活">
              <el-switch
                  v-model="formData.isActive"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item v-bind:disabled="formData.id" label="身份证号" prop="adminCode">
              <el-input :disabled="disabled" v-model="formData.adminCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工薪资" prop="adminSalary">
              <el-input v-model="formData.adminSalary"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工头像">
              <!--          <el-input v-model="formData.brandLogo"></el-input>-->
              <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :http-request="chooseImg"
                  :before-upload="beforeAvatarUpload"
                  :show-file-list="false">
                <img v-if="imgUrl" :src="imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配角色">
              <el-select  v-model="formData.roleIds" multiple placeholder="请选择员工角色">
                <el-option
                    v-for="role in roleList"
                    :key="role.id"
                    :label="role.roleName"
                    :value="role.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="员工地址" prop="adminAddress">
          <el-input type="textarea" v-model="formData.adminAddress"></el-input>
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