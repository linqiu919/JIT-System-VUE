<template>
  <div class="main-box">
    <el-container>
      <el-aside width="200px">
        <!--      logo区域-->
        <div class="aside-logo">
          <img :src="admin.adminAvatar" alt="">
          <span>VUE-TEST</span>
        </div>
        <!--
          控制滚动的区域
          这个标签中，放入需要滚动的内容
            el-scrollbar指定高度，滚动的区域就会在高度范围内滚动
        -->
        <el-scrollbar>
          <!--    侧边菜单栏-->
          <el-menu
              default-active="4"
              active-text-color="green"
              class="el-menu-vertical-demo"
              router>
            <targetres v-for="(item,index) in menuList" :key="index" :mmmm="item"/>
          </el-menu>
        </el-scrollbar>
        <!--      操作区-->
      </el-aside>

      <el-container>
        <el-header class="el_header_style">不知道叫什么的系统
<!--          <el-dropdown @command="dialogVisible = true" trigger="click" split-button type="primary">-->
<!--            欢迎你：<span>{{ admin.adminName }}</span>-->
<!--            <el-dropdown-menu trigger="click" slot="dropdown">-->
<!--              <el-dropdown-item>退出登录</el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
<!--          </el-dropdown>-->
          <el-dropdown @command="dialogVisible = true" trigger="click"
          >
            <span class="el-dropdown-link">
              {{ admin.adminName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu  slot="dropdown">
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dialog
              title="登出提示"
              :visible.sync="dialogVisible"
              width="30%"
              center>
            <span>确定要退出系统吗？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="signOut">确 定</el-button>
  </span>
          </el-dialog>


<!--          <el-dialog-->
<!--              title="确定退出吗?"-->
<!--              :visible.sync="dialogVisible"-->
<!--              width="20%"-->
<!--              center="center"-->
<!--          >-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--              <el-button @click="dialogVisible = false">取 消</el-button>-->
<!--              <el-button type="primary" @click="signOut">确 定</el-button>-->
<!--            </span>-->
<!--          </el-dialog>-->

<!--          <el-dialog-->
<!--              title="登出提示"-->
<!--              :visible.sync="dialogVisible"-->
<!--              width="20%">-->
<!--            <span>确定退出登录吗？</span>-->
<!--            <span slot="footer" class="dialog-footer">-->
<!--                <el-button @click="dialogVisible = false">取 消</el-button>-->
<!--                <el-button type="primary" @click="signOut">确 定</el-button>-->
<!--            </span>-->
<!--          </el-dialog>-->

        </el-header>

        <el-main>

          <div class="body-box">
            <router-view/>
          </div>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import targetres from "@/components/targetres";

export default {
  components: {targetres},
  name: "index",
  created() {
    this.menuList = JSON.parse(localStorage.getItem("menuList"))
    this.admin = JSON.parse(localStorage.getItem("admin"))
  },
  data() {
    return {
      dialogVisible: false,
      admin: {},
      menuList: {}
    }
  },
  methods: {
    signOut(){
      //退出登录清空token
      window.localStorage.clear();
      //跳转登录页
      this.$router.push('/login');
    },

  }
}
</script>

<style scoped lang="scss">

.el_header_style {
  font-size: 30px;
}

.main-box {
  width: 100%;
  height: 100%;
}

/*控制滚动的区域*/
.el-scrollbar {
  height: calc(100% - 60px);
}


/*主页面头部的样式*/
.el-header {
  background-color: #088A85;
  color: white;
  text-align: center;
  line-height: 60px;
}

/*主页面侧边栏的样式*/
.el-aside {
  background-color: white;
  color: #333;
  //text-align: center;
  .aside-logo {
    height: 60px;
    line-height: 60px;
    background-color: white;
    padding-left: 10px;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 8px;
  }

  span {
    font-weight: 800;
    font-family: Arial;
  }
}

/*主页面中间的样式*/
.el-main {

  background-color: #088A85;
  /*消除内边距*/
  padding: 10px 10px 10px 10px;
  color: #333;

  .body-box {
    border-radius: 5px;
    width: 100%;
    height: 100%;
    background-color: white;
    //margin: 0;
    //padding: 0;
    /*设置内边距*/
    padding: 10px 10px 10px 10px;
    box-sizing: border-box;
  }
}

.el-container {
  height: 100%;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-dropdown {
  float: right;
  color: darkcyan;
}
.el-dropdown-link {
  cursor: pointer;
  color: white;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>