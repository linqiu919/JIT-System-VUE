<template>
  <div class="brand-wrapper">
    <!--搜索区域-->
    <div class="search-box">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item label="权限名称">
          <el-input v-model="searchForm.menuTitle" placeholder="请输入权限名称"></el-input>
        </el-form-item>

        <el-form-item label="权限类型">
          <el-select v-model="searchForm.menuType" placeholder="请选择权限类型">
            <el-option label="目录" value="1"/>
            <el-option label="菜单" value="2"/>
            <el-option label="按钮" value="3"/>
<!--                v-for="item in options"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
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
      <el-button type="primary" v-hasperm="'system:menu:add'" size="mini" @click="addBtn">新建</el-button>
      <el-button type="success" v-hasperm="'system:menu:update'" size="mini" @click="createDialog=true,findById(selectId)" :disabled="selectId==-1">编辑</el-button>
      <el-button type="danger" v-hasperm="'system:menu:delete'" size="mini" @click="showDelete" :disabled="selectId==-1">删除</el-button>
    </div>


    <el-scrollbar>

      <!--数据表单-->
      <div class="table-data">
        <el-table
            highlight-current-row
            @row-click="rowClick"
            :data="tableData"
            row-key="id"
            :tree-props="{children: 'children'}"
            style="width: 100%">
          stripe: true
          <el-table-column
              align="center"
              prop="menuTitle"
              label="权限名称"
          >
          </el-table-column>

          <el-table-column
              align="center"
              prop="menuIcon"
              label="权限图标"
          >
            <template v-slot="obj">
              <e-icon :icon-name="obj.row.menuIcon"/>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              prop="sort"
              label="权限排序"
          >
          </el-table-column>

          <el-table-column
              align="center"
              prop="menuType"
              label="权限类型"
          >
            <template v-slot="obj">
              <el-tag v-if="obj.row.menuType==1">目录</el-tag>
              <el-tag v-if="obj.row.menuType==2" type="success">菜单</el-tag>
              <el-tag v-if="obj.row.menuType==3" type="danger">按钮</el-tag>
            </template>
          </el-table-column>


          <el-table-column
              align="center"
              prop="menuRouter"
              label="菜单路由">
          </el-table-column>

          <el-table-column
              align="center"
              prop="permSign"
              label="权限标识">
          </el-table-column>

          <el-table-column
              align="center"
              label="操作">

            <template v-slot="obj">
              <el-button type="success" v-hasperm="'system:menu:update'" size="mini" @click.native.stop="findById(obj.row.id)">编辑</el-button>
              <el-popconfirm
                  style="margin-left: 10px"
                  confirm-button-text='确定'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  @confirm="deleteById(obj.row.id)"
                  icon-color="red"
                  title="确定要删除这一条数据吗？"
              >
                <el-button slot="reference" v-hasperm="'system:menu:delete'" type="primary"  @click.native.stop size="mini">删除</el-button>
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

        <el-form-item label="上级权限" prop="parentId">
          <treeselect v-model="formData.parentId" :options="menuSelectList" :show-count="true" :normalizer="normalizer" placeholder="请选择父级菜单" />
        </el-form-item>

        <el-form-item label="权限类型" prop="menuType">
          <el-radio-group v-model="formData.menuType" size="medium">
            <el-radio-button label="1">目录</el-radio-button>
            <el-radio-button label="2">菜单</el-radio-button>
            <el-radio-button label="3">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="按钮图标" prop="menuIcon" v-if="formData.menuType!=3">
          <!--              <el-input v-model="formData.menuIcon"></el-input>-->
          <e-icon-picker v-model="formData.menuIcon" :options="options"/>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="权限名称" prop="menuTitle">
              <el-input v-model="formData.menuTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限排序" prop="sort">
              <el-input-number v-model="formData.sort" controls-position="right" :min="1" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路由地址" prop="menuRouter" v-if="formData.menuType!=3">
              <el-input v-model="formData.menuRouter"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识" prop="permSign" v-if="formData.menuType!=1">
              <el-input v-model="formData.permSign"></el-input>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row :gutter="20">

          <el-col :span="12">
            <el-form-item label="组件地址" prop="componentPath" v-if="formData.menuType==2">
              <el-input v-model="formData.componentPath"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件名称" prop="componentName" v-if="formData.menuType==2">
              <el-input v-model="formData.componentName"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

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