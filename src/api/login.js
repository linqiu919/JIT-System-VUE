import newaxios from "@/utils/myaxios";
let login ={
    //获取验证码
    getCode(uuid){
        return newaxios.get(`common/getCode/${uuid}`)
    },
    //登录
    doLogin(form){
        return newaxios.post(`common/doLogin`,form);
    },
    //获取用户动态菜单
    getUserInfo(){
        return newaxios.get(`common/getUserInfo`);
    }

}
export default login;
