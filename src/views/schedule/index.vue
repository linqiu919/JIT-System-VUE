<template>
  <div class="brand-wrapper">
    <!--搜索区域-->
    <!--操作区域-->
    <div class="exec-box">
      <el-button type="primary" size="mini" disabled>新建</el-button>
    </div>


    <el-scrollbar>

      <!--数据表单-->
      <div class="table-data">
        <el-table
            :data="tableData"
            style="width: 100%">
          stripe: true
          <el-table-column
              align="center"
              prop="cronId"
              label="定时ID"
          >
          </el-table-column>
          <el-table-column
              align="center"
              prop="cronExpress"
              label="定时内容"
          >
          </el-table-column>

          <el-table-column
              align="center"
              prop="cronDesc"
              label="定时描述">
          </el-table-column>

          <el-table-column
              align="center"
              label="操作">

            <template v-slot="obj">
              <el-button type="danger" v-hasperm="'task:time:pause'" size="mini" @click="pause(obj.row.cronId)">暂停</el-button>
              <el-button type="success" v-hasperm="'task:time:resume'" size="mini" @click="resume(obj.row.cronId)">启动</el-button>
              <el-button type="success" v-hasperm="'task:timer:update'" size="mini" @click="findById(obj.row.cronId)">编辑</el-button>
              <el-popconfirm
                  style="margin-left: 10px"
                  confirm-button-text='确定'
                  cancel-button-text='取消'
                  icon="el-icon-info"
                  @confirm="deleteById(obj.row.cronId)"
                  icon-color="red"
                  title="确定要删除这一条数据吗？"
              >
                <el-button slot="reference" v-hasperm="'task:timer:delete'" type="primary" size="mini">删除</el-button>
              </el-popconfirm>

            </template>

          </el-table-column>

        </el-table>
      </div>

    </el-scrollbar>

    <!--新建弹框-->

    <el-dialog
        title="操作"
        :visible.sync="createDialog"
        width="40%">

      <el-form ref="form" label-width="80px" :model="formData" label-position="left">

            <el-form-item label="定时内容">
              <el-input v-model="formData.cronExpress"></el-input>
            </el-form-item>
            <el-form-item label="定时描述">
              <el-input v-model="formData.cronDesc"></el-input>
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