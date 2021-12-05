import menu from "@/api/menu";
import dateChoose from "@/utils/datachoose";
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
// register the component
    components: { Treeselect },
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
            selectId:-1,
            total: 0,
            createDialog: false,
            pageSize:6,
            formData: {
                parentId:0,
                menuType:1,
                sort:1,
            },
            menuSelectList:[
                {
                    id: 0,
                    menuTitle: "根目录",
                    children:[],
                }
            ],
            normalizer(node) {
                //去掉children=null的属性
                if(node.children==null||node.children=='null'){
                    delete node.children;
                }
                return {
                    id: node.id,
                    label: node.menuTitle,
                    children: node.children,
                }
            },
            options: {
                FontAwesome: true,
                ElementUI: true,
                eIcon: true,//自带的图标，来自阿里妈妈
                eIconSymbol: true,//是否开启彩色图标
                addIconList: [],
                removeIconList: []
            },
            rules: {
                parentId: [
                    {required: true, message: '父ID不能为空', trigger: 'blur'},
                ],
                menuType: [
                    {required: true, message: '权限类型不能为空', trigger: 'blur'},
                ],
                menuIcon: [
                    {required: true, message: '图标不能为空', trigger: 'blur'},
                    {required: true, message: '图标不能为空', trigger: 'change'},
                ],
                menuTitle: [
                    {required: true, message: '权限名称不能为空', trigger: 'blur'},
                ],
                sort: [
                    {required: true, message: '排序不能为空', trigger: 'blur'},
                ],
                permSign: [
                    {required: true, message: '权限标识不能为空', trigger: 'blur'},
                ],
                menuRouter: [
                    {required: true, message: '路由地址不能为空', trigger: 'blur'},
                ],
                componentPath: [
                    {required: true, message: '组件地址不能为空', trigger: 'blur'},
                ],
                componentName: [
                    {required: true, message: '组件名称不能为空', trigger: 'blur'},
                ],
            },
        }
    },
    methods: {
        //查询所有 异步获取响应数据

        async searchPage() {
            // let response = await menu.findAll();
            // //将响应数据传到表格数据中
            // this.tableData  = response;
            // let response = await  menu.findAll();
            // this.total = response.total;
            // this.tableData = response.data;

            let response = await menu.searchPage(this.searchForm)
            this.total = response.total;
            this.tableData = response.data;

            // if(this.searchForm.menuName===null||this.searchForm.menuDesc===null){
            //     this.searchForm.currentPage=1;
            // }

            this.menuSelectList[0].children = [];
            this.menuSelectList[0].children = await menu.getAllTreeData();
            this.selectId=-1;
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
                        await menu.update(this.formData);
                    } else {
                        //添加
                        await menu.add(this.formData)
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
            this.formData = await menu.findById(id);
            if(this.$refs.form!==undefined){
                this.$refs.form.resetFields();
            }
        },
        //通过id进行删除
        async deleteById(id) {
            await menu.delete(id);
            //删除最后一条数据时，自动跳转前一页
            const lastPage = Math.ceil((this.total) / this.pageSize) // 总页数
            if(this.searchForm.currentPage===lastPage && this.total%this.searchForm.pageSize===1){
                this.searchForm.currentPage--;
            }
            this.searchPage();
        },

        //
        // //获得所有的树形数据
        // async getAllTreeData(){
        //   this.menuSelectList[0].children = await menu.getAllTreeData();
        // },

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
                pageSize: 6
            }
            this.chooseData = ''
        },

        //添加按钮点击事件
        addBtn() {
            this.createDialog = true;
            this.formData = {
                parentId:0,
                menuType:1,
                sort:1,
            };
            if(this.$refs.form!==undefined){
                this.$refs.form.resetFields();
            }
        },
        //批量删除弹框
        async showDelete() {
            this.$confirm('确定要删除id为 ' + this.selectId + ' 的几条数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                //确定删除
                await this.deleteById(this.selectId);
            }).catch(() => {
                //取消删除

            });
        },
        //点击某一行的事件
        async rowClick(row){
            this.selectId = row.id;
        },
    }
}
