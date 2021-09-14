import schedule from "@/api/schedule";
// import id from "element-ui/src/locale/lang/id";

export default {

    name: "index",
    created() {
        this.findAll();
    },
    data() {
        return {
            tableData: [],
            createDialog: false,
            formData: {},
        }
    },
    methods: {
        //查询所有的定时任务
       async  findAll(){
         this.tableData = await schedule.findAll();
       },

        //增加or修改
      async  addOrEdit() {
          //关闭弹窗
            this.createDialog = false;
            if (this.formData.cronId) {
                //修改
                await schedule.update(this.formData);
            } else {
                //添加
                await schedule.add(this.formData)
            }
            this.findAll();
        },
        //修改的方法
        async findById(id) {
            //显示修改框
            this.createDialog = true;
            this.formData = await schedule.findById(id);
            if(this.$refs.form!==undefined){
                this.$refs.form.resetFields();
            }
            this.imgUrl = this.formData.scheduleLogo;
        },
        //通过id进行删除
        async deleteById(id) {
            await schedule.delete(id);
            this.findAll();
        },
        //暂停定时功能
        async pause(id){
          await schedule.pause(id);
          this.findAll();
        },
        //启动定时功能
        async resume(id){
           await schedule.resume(id);
           this.findAll();
        }

    }
}
