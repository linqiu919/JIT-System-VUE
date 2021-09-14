<template>
  <div class="login">
    <div class="logo">
      <img src="" alt="">
      <span>V-login</span>
    </div>
    <p>测试项目</p>
    <div class="login-input" >
      <el-form :model="loginForm" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
        <el-form-item label="" prop="account">
          <el-input v-model="loginForm.account" clearable placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="" prop="code">
          <el-input type="text" v-model="loginForm.code"  placeholder="请输入验证码" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <img class="signImage" :src="codeImage" @click="getCode" alt="">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doLogin">登录</el-button>
        </el-form-item>
        
      </el-form>
    </div>
  </div>
</template>

<script src="./index.js">

</script>

<style src="./index.scss" lang='scss'>

</style>