import login from "@/api/login";

export default {
    name: "index",
    created() {
        this.getCode()
    },
    data() {
        return {
            codeImage: '',
            str:'',
            loginForm: {
                code:'',
                uuid: '',
                account: '',
                password: '',
            },
            rules: {
                account: [
                    {required: true, message: '用户名不能为空', trigger: 'blur'},
                    {pattern: /^[a-zA-Z]\w{5,8}$/,message: '数字字母下划线6-9位,首位是字母', trigger: 'blur'},
                ],
                password: [
                    {required: true, message: '密码不能为空', trigger: 'blur'},
                ],
                code: [
                    {required: true, message: '验证码不能为空', trigger: 'blur'},
                ],
            },
        }
    },
    methods: {
        async getCode() {
            this.loginForm.uuid = this.guid();
            this.codeImage = await login.getCode(this.loginForm.uuid);
        },
        guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        async doLogin(){
            // let response = await login.doLogin(this.loginForm);
            // //将权限信息放入localStorage中
            // localStorage.setItem("menuList",JSON.stringify(response));

            //将token信息放入localStorage中
            let token = await login.doLogin(this.loginForm);
            localStorage.setItem("token",token);
            let response =  await login.getUserInfo();
            //获取用户信息和用户菜单
            let admin = response.admin;
            localStorage.setItem("admin",JSON.stringify(admin));
            let menuList = response.menuList;
            localStorage.setItem("menuList",JSON.stringify(menuList));
            let btnList = response.btnList;
            localStorage.setItem("btnList",JSON.stringify(btnList));

            //登录成功，跳转首页
            this.$router.push("/main/index");
        },
    }
}