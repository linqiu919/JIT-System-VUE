<template>
  <div>

    <!--系统首页-->
    <el-menu-item v-if="!mmmm.children || mmmm.children.length==0" :index="mmmm.menuRouter">
          <i v-bind:class="mmmm.menuIcon"></i>
<!--      <el-icon :icon-name="mmmm.menuIcon"/>-->
      <span slot="title">&nbsp;&nbsp;{{ mmmm.menuTitle }}</span>
    </el-menu-item>

    <!--系统管理-->
    <el-submenu v-if="mmmm.children && mmmm.children.length>0" :index="mmmm.menuRouter">
      <template slot="title">
        <i v-bind:class="mmmm.menuIcon"></i>
<!--        <el-icon :icon-name="mmmm.menuIcon"/>-->
        <span>{{ mmmm.menuTitle }}</span>
      </template>

      <targetres v-for="(item,index) in mmmm.children" :key="index" :mmmm="item"/>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: "targetres",
  props: ['mmmm'],
}
</script>

<style scoped>

</style>