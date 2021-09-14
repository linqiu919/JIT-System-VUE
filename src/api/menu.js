import newaxios from "@/utils/myaxios";
let menu ={
    //分页条件查询
    searchPage(entity){
        return newaxios.get(`menu/searchPage`,{params:entity})
    },
    //查询所有
    findAll(){
        return newaxios.get(`menu`);
    },
    //通过id查询v
    findById(id){
        return newaxios.get(`menu/${id}`);
    },
    //添加
    add(entity){
        return newaxios.post('menu/add',entity);
    },
    //修改
    update(entity){
        return newaxios.post(`menu/alter`,entity);
    },
    //删除
    delete(id){
        return newaxios.delete(`menu/${id}`);
    },
    //批量删除
    batchDelete(ids){
        return newaxios.delete(`menu/batch/${ids}`);
    },
    //获取所有的树形数据
    getAllTreeData(){
        return newaxios.get(`menu/getTreeData`);
    }
}
export default menu;
