import newaxios from "@/utils/myaxios";
let schedule ={

    //查询所有
    findAll(){
        return newaxios.get(`schedule`);
    },
    //通过id查询v
    findById(id){
        return newaxios.get(`schedule/${id}`);
    },
    //添加
    add(entity){
        return newaxios.post('schedule/add',entity);
    },
    //修改
    update(entity){
        return newaxios.post(`schedule/alter`,entity);
    },
    //删除
    delete(id){
        return newaxios.delete(`schedule/${id}`);
    },
    //暂停
    pause(id){
        return newaxios.put(`schedule/${id}`);
    },
    //重启
    resume(id){
        return newaxios.post(`schedule/resume/${id}`);
    }
}
export default schedule;
