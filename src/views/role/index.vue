<template>
  <div class="brand-wrapper">
    <!--搜索区域-->
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.roleName" placeholder="请输入角色名称"></el-input>
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
          <el-button type="success"  @click="search">搜索</el-button>
          <el-button type="info" @click="resetSearchForm">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
    <!--操作区域-->
    <div class="exec-box">
      <el-button type="primary" v-hasperm="'system:role:add'" size="mini" @click="addBtn">新建</el-button>
      <el-button type="success" v-hasperm="'system:role:update'" size="mini" :disabled="selectIds.length!=1" @click="createDialog=true,findById(selectIds[0])">编辑</el-button>
      <el-button type="danger" v-hasperm="'system:role:batchdelete'" size="mini" :disabled="selectIds.length<=0" @click="showDelete">删除</el-button>
    </div>


    <!--角色管理分成左右两列-->
    <el-row :gutter="50" style="height: 80%">
      <el-col :span="13" style="height: 80%">
        <el-scrollbar>

          <!--数据表单-->
          <div class="table-data">
            <el-table
                highlight-current-row
                @row-click="rowClick"
                @selection-change="selectChange"
                :data="tableData"
                style="width: 100%">
              <el-table-column
                  type="selection"
                  align="center">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="id"
                  label="角色ID"
              >
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="roleName"
                  label="角色名称"
              >
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="roleDesc"
                  label="角色描述">
              </el-table-column>

              <el-table-column
                  align="center"
                  label="操作">

                <template v-slot="obj">
                  <el-button type="success" v-hasperm="'system:role:update'" size="mini" @click.native.stop="findById(obj.row.id)">编辑</el-button>
                  <el-popconfirm
                      style="margin-left: 10px"
                      confirm-button-text='确定'
                      cancel-button-text='取消'
                      icon="el-icon-info"
                      @confirm="deleteById(obj.row.id)"
                      icon-color="red"
                      title="确定要删除这一条数据吗？"
                  >
                    <el-button slot="reference" v-hasperm="'system:role:delete'" type="primary" size="mini" @click.native.stop>删除</el-button>
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
      </el-col>
      <el-col :span="9">
        <el-card class="box-card" v-hasperm="'system:role:menu'">
          <div slot="header" class="clearfix">
            <span>分配权限</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="setRowMenu" >确认分配</el-button>
          </div>
          <el-scrollbar style="height:400px">
            <el-tree
                ref="treeData"
                :data="menuList"
                show-checkbox
                node-key="id"
                :props="defaultProps">
            </el-tree>
          </el-scrollbar>

        </el-card>

      </el-col>
    </el-row>


    <!--新建弹框-->

    <el-dialog
        title="操作"
        :visible.sync="createDialog"
        width="40%">

      <el-form ref="form" label-width="80px" :model="formData" :rules="rules" label-position="left">

        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="formData.roleDesc"></el-input>
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