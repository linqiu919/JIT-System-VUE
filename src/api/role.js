import newaxios from "@/utils/myaxios";
let role ={
    //分页条件查询
    searchPage(entity){
        return newaxios.get(`role/searchPage`,{params:entity})
    },
    //查询所有
    findAll(){
        return newaxios.get(`role`);
    },
    //通过id查询v
    findById(id){
        return newaxios.get(`role/${id}`);
    },
    //添加
    add(entity){
        return newaxios.post('role/add',entity);
    },
    //修改
    update(entity){
        return newaxios.post(`role/alter`,entity);
    },
    //删除
    delete(id){
        return newaxios.delete(`role/${id}`);
    },
    //批量删除
    batchDelete(ids){
        return newaxios.delete(`role/batch/${ids}`);
    },
    //获取所有权限
    getAllMenuTreeData(){
        return newaxios.get(`menu/getTreeData`);
    },
    //给角色分配权限
    setRoleMenu(roleId,menuIds){
        return newaxios.post(`role/${roleId}/menu/${menuIds}`)
    },
    //获取角色的Menus
    getMenusByRowId(roleId){
        return newaxios.get(`role/${roleId}/menus`)
    },
}
export default role;
