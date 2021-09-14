import newaxios from "@/utils/myaxios";
let brand ={
    //分页条件查询
    searchPage(entity){
        return newaxios.get(`brand/searchPage`,{params:entity})
    },
    //查询所有
    findAll(){
        return newaxios.get(`brand`);
    },
    //通过id查询v
    findById(id){
        return newaxios.get(`brand/${id}`);
    },
    //添加
    add(entity){
        return newaxios.post('brand/add',entity);
    },
    //修改
    update(entity){
        return newaxios.post(`brand/alter`,entity);
    },
    //删除
    delete(id){
        return newaxios.delete(`brand/${id}`);
    },
    //批量删除
    batchDelete(ids){
        return newaxios.delete(`brand/batch/${ids}`);
    }
}
export default brand;
