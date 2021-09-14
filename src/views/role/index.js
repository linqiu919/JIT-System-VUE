import role from "@/api/role";
import dateChoose from "@/utils/datachoose";
// import id from "element-ui/src/locale/lang/id";
// import newaxios from "@/utils/myaxios";
export default {

    name: "index",
    created() {
        this.searchPage();
        this.getAllTreeData();
    },
    data() {
        return {
            searchForm: {
                currentPage: 1,
                pageSize: 8,
            },
            pickerOptions: dateChoose.pickerOptions,
            chooseData: dateChoose.chooseData,
            tableData: [],
            total: 0,
            selectIds: [],
            createDialog: false,
            pageSize:8,
            formData: {},
            defaultProps:{
                children:'children',
                label:'menuTitle',
            },
            menuList:[],
            rowId :'',
            rules: {
                roleName: [
                    {required: true, message: '角色名称不能为空', trigger: 'blur'},
                ],
            },
        }
    },
    methods: {
        //查询所有 异步获取响应数据

        async searchPage() {
            // let response = await role.findAll();
            // //将响应数据传到表格数据中
            // this.tableData  = response;
            // let response = await  role.findAll();
            // this.total = response.total;
            // this.tableData = response.data;

            let response = await role.searchPage(this.searchForm)
            this.total = response.total;
            this.tableData = response.data;
            if(this.searchForm.roleName===null||this.searchForm.roleDesc===null){
                this.searchForm.currentPage=1;
            }
            //清空选择的权限
            this.$refs.treeData.setCheckedKeys([]);
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
                        await role.update(this.formData);
                    } else {
                        //添加
                        await role.add(this.formData)
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
            this.formData = await role.findById(id);
            if(this.$refs.form!==undefined){
                this.$refs.form.resetFields();
            }
        },
        //通过id进行删除
        async deleteById(id) {
            await role.delete(id);
            //删除最后一条数据时，自动跳转前一页
            const lastPage = Math.ceil((this.total) / this.pageSize) // 总页数
            if(this.searchForm.currentPage===lastPage && this.total%this.searchForm.pageSize===1){
                this.searchForm.currentPage--;
            }
            this.searchPage();
        },
        //获取所有权限
        async getAllTreeData(){
         this.menuList =  await role.getAllMenuTreeData();
        },
        //设置角色的权限
        async setRowMenu(){
            //设置权限的角色id

            //拿到角色勾选的权限名
                //获取全选的功能
            let result = this.$refs.treeData.getCheckedKeys();
                //获取半选的功能
            let result1 = this.$refs.treeData.getHalfCheckedKeys();
            let ids = result.concat(result1);
            await role.setRoleMenu(this.rowId,ids);

            //设置权限成功之后，刷新页面
            this.searchPage();
            alert("权限添加成功")

        },
        //通过rowId获取已有的权限值
        async getMenusByRowId(){
         let ids = await role.getMenusByRowId(this.rowId);
         this.$refs.treeData.setCheckedKeys(ids);
        },

        //批量删除
        async batchDeleteByids() {
            await role.batchDelete(this.selectIds);
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
        //行点击事件
        rowClick(row){
            //获取选择行的id
            this.rowId = row.id;
            //调用获取当前行的员工的权限
            this.getMenusByRowId();
        },

    }
}
