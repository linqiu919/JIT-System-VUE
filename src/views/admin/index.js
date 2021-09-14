import admin from "@/api/admin";
import dateChoose from "@/utils/datachoose";
import {upload} from "@/api/upload";
// import da from "element-ui/src/locale/lang/da";

export default {

    name: "index",
    created() {
        this.searchPage();
        this.token = localStorage.getItem("token");
    },
    data() {
        //自定义校验器
        var salaryValid = (rule, value, callback) => {
            setTimeout(() => {
                var b = isNaN(value);
                if (b) {
                    callback(new Error('你输入的不是一个数字'))
                } else {
                    callback();
                }
            });
        };
        return {
            disabled: false,
            searchForm: {
                currentPage: 1,
                pageSize: 8,
            },
            pickerOptions: dateChoose.pickerOptions,
            chooseData: dateChoose.chooseData,
            tableData: [],
            total: 0,
            token: '',
            pageSize: 8,
            selectIds: [],
            createDialog: false,
            formData: {
                isAdmin: false,
                isActive: true,
                gender: 0,
            },
            imgUrl: '',
            roleList: [],
            rules: {
                adminAccount: [
                    {required: true, message: '员工账户信息不能为空', trigger: 'blur'},
                    {pattern: /^[a-zA-Z]\w{5,8}$/, message: '数字字母下划线6-9位,首位是字母', trigger: 'blur'},
                ],
                adminName: [
                    {required: true, message: '员工姓名不能为空', trigger: 'blur'},
                ],
                gender: [
                    {required: true, message: '员工性别不能为空', trigger: 'blur'},
                ],
                adminPhone: [
                    {required: true, message: '员工手机号不能为空', trigger: 'blur'},
                    {
                        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                        message: '手机号格式不正确',
                        trigger: 'blur'
                    },

                ],
                adminEmail: [
                    {required: true, message: '邮箱不能为空', trigger: 'blur'},
                    {type: 'email', message: '输入的邮箱格式错误', trigger: 'blur'},
                ],
                adminSalary: [
                    {required: true, message: '员工薪资不能为空', trigger: 'blur'},
                    {validator: salaryValid, message: '员工薪资不是一个数字', trigger: 'blur'},
                ],
                adminCode: [
                    {required: true, message: '员工身份证号不能为空', trigger: 'blur'},
                    {
                        pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                        message: '输入身份证号格式错误',
                        trigger: 'blur'
                    },
                ],
                adminAddress: [
                    {required: true, message: '员工地址不能为空', trigger: 'blur'},
                ],
            },
        }
    },
    methods: {

        //查询所有 异步获取响应数据
        async searchPage() {
            let response = await admin.searchPage(this.searchForm)
            this.total = response.total;
            this.tableData = response.data;
        },
        search() {
            this.searchForm.currentPage = 1;
            this.searchPage();
        },
        //增加or修改
        addOrEdit() {
            //表单手动校验
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    //校验成功，关闭弹窗
                    this.createDialog = false;
                    if (this.formData.id) {
                        //修改
                        await admin.update(this.formData);
                    } else {
                        //添加
                        await admin.add(this.formData)
                    }
                } else {
                    this.$message.error("表单校验失败")
                    return false;
                }
                this.searchPage();
            });

        },
        //修改的方法
        async findById(id) {
            //显示修改框
            this.createDialog = true;
            this.disabled = true;
            this.formData = await admin.findById(id);
            if (this.$refs.form !== undefined) {
                this.$refs.form.resetFields();
            }
            this.imgUrl = this.formData.adminAvatar;
            this.getAllRoles();
        },
        //通过id进行删除
        async deleteById(id) {
            await admin.delete(id);
            const lastPage = Math.ceil((this.total) / this.pageSize) // 总页数
            if (this.searchForm.currentPage === lastPage && this.total % this.searchForm.pageSize === 1) {
                console.log(this.searchForm.currentPage)
                this.searchForm.currentPage--;
            }
            this.searchPage();
        },
        //批量删除
        async batchDeleteByids() {
            await admin.batchDelete(this.selectIds);
            const lastPage = Math.ceil((this.total) / this.pageSize) // 最后一页

            console.log(this.searchForm.currentPage)
            if (this.searchForm.currentPage === lastPage && this.total % this.searchForm.pageSize === 1) {
                this.searchForm.currentPage--;
            }
            this.searchPage();
        },


        //***********************************************
        //分页回调函数
        pageChange(page) {
            this.searchForm.currentPage = page;
            //刷新页面
            this.searchPage();
        },
        //用户选择时间
        chooseDataChange(val) {
            // eslint-disable-next-line no-empty
            if (val == null) {
                this.chooseData = '';
                this.searchForm.stratTime = '';
                this.searchForm.endTime = '';
            } else {
                this.searchForm.startTime = val[0];
                this.searchForm.endTime = val[1];
            }
        },
        //搜索重置
        resetSearchForm() {
            this.searchForm = {
                currentPage: 1,
                pageSize: 8
            }
            this.chooseData = ''
        },
        //勾选框事件函数
        selectChange(val) {
            //获取勾选的品牌ID
            this.selectIds = val.map(item => item.id);
        },
        //添加按钮点击事件
        addBtn() {
            this.disabled = false;
            this.createDialog = true;

            //设置添加默认选项
            this.formData = {
                isAdmin: false,
                isActive: true,
                gender: 0,
            };
            this.imgUrl = '';
            if (this.$refs.form !== undefined) {
                this.disabled = false;
                this.$refs.form.resetFields();
            }
            this.getAllRoles();

        },
        //批量删除弹框
        async showDelete() {
            this.$confirm('确定要删除id为 ' + this.selectIds + ' 的几条数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //确定删除
                await this.batchDeleteByids(this.selectIds);
            }).catch(() => {
                //取消删除

            });
        },
        //文件上传 选择图片
        async chooseImg(e) {

            let formData = new FormData();
            formData.append("avatar", e.file);
            formData.append("avatar", e.file);
            this.imgUrl = await upload(formData);
            this.formData.adminAvatar = this.imgUrl;
        },
        //前端校验上传图片
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 < 100;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 50k!');
            }
            return isJPG && isLt2M;
        },
        //获取所有角色
        async getAllRoles() {
            this.roleList = await admin.getAllRoles();
            console.log(this.roleList)
        },
        //导出表格
        async getExcel() {
            let data = await admin.exportExcel();
            let blob = new Blob([data])
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = "员工信息表.xlsx";
            a.click();
        },
    }
}
