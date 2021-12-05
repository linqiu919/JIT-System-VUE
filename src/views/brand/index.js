import brand from "@/api/brand";
import dateChoose from "@/utils/datachoose";
export default {

    name: "index",
    created() {
        this.searchPage();
    },
    data() {
        return {
            searchForm: {
                currentPage: 1,
                pageSize: 6,
            },
            pickerOptions: dateChoose.pickerOptions,
            chooseData: dateChoose.chooseData,
            tableData: [],
            total: 0,
            selectIds: [],
            createDialog: false,
            pageSize:6,
            formData: {},
            imgUrl: '',
            rules: {
                brandName: [
                    {required: true, message: '品牌名称不能为空', trigger: 'blur'},

                ],
                brandSite: [
                    {required: true, message: '品牌站点不能为空', trigger: 'blur'},
                    {type: 'url', message: '品牌站点必须为链接', trigger: 'blur'}
                ],
            },
        }
    },
    methods: {
        //查询所有 异步获取响应数据

        async searchPage() {
            // let response = await brand.findAll();
            // //将响应数据传到表格数据中
            // this.tableData  = response;
            // let response = await  brand.findAll();
            // this.total = response.total;
            // this.tableData = response.data;

            let response = await brand.searchPage(this.searchForm)
            this.total = response.total;
            this.tableData = response.data;
            if(this.searchForm.brandName===null||this.searchForm.brandDesc===null){
                this.searchForm.currentPage=1;
            }
        },
        search(){
            this.searchForm.currentPage = 1
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
                        await brand.update(this.formData);
                    } else {
                        //添加
                        await brand.add(this.formData)
                    }
                } else {
                    this.$message.error("表单校验失败")
                    return false;
                }
                this.searchPage()
            });

        },
        //修改的方法
        async findById(id) {
            //显示修改框
            this.createDialog = true;
            this.formData = await brand.findById(id);
            if(this.$refs.form!==undefined){
                this.$refs.form.resetFields();
            }
            this.imgUrl = this.formData.brandLogo;
        },
        //通过id进行删除
        async deleteById(id) {
            await brand.delete(id);
            //删除最后一条数据时，自动跳转前一页
            const lastPage = Math.ceil((this.total) / this.pageSize) // 总页数
            if(this.searchForm.currentPage===lastPage && this.total%this.searchForm.pageSize===1){
                this.searchForm.currentPage--;
            }
            this.searchPage();
        },

        //批量删除
        async batchDeleteByids() {
            await brand.batchDelete(this.selectIds);
            //删除最后一条数据时，自动跳转前一页
            const lastPage = Math.ceil((this.total) / this.pageSize) // 总页数
            if(this.searchForm.currentPage===lastPage && this.total%this.searchForm.pageSize===0){
                this.searchForm.currentPage--;
            }

            this.searchPage();
        },

        //分页回调函数
        pageChange(page) {
            this.searchForm.currentPage = page;
            //刷新页面
            this.searchPage();
        },
        //用户选择时间
        chooseDataChange(val) {
            // eslint-disable-next-line no-empty
            if(val==null){
                this.chooseData = '';
                this.searchForm.stratTime = '';
                this.searchForm.endTime = '';
            }else {
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
            this.createDialog = true;
            this.formData = {};
            this.imgUrl = '';
            if(this.$refs.form!==undefined){
                this.$refs.form.resetFields();
            }
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
        //选择图片
        chooseImg(e) {
            let fileReader = new FileReader();
            //读取文件是异步操作
            fileReader.readAsDataURL(e.file);
            fileReader.onloadend = (response) => {
                this.imgUrl = response.target.result;
                this.formData.brandLogo = response.target.result;
            }
        }
    }
}
