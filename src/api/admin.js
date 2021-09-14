import newaxios from "@/utils/myaxios";

let admin = {
    //分页条件查询
    searchPage(entity) {
        return newaxios.get(`admin/searchPage`, {params: entity})
    },
    //查询所有
    findAll() {
        return newaxios.get(`admin`);
    },
    //通过id查询v
    findById(id) {
        return newaxios.get(`admin/${id}`);
    },
    //添加
    add(entity) {
        return newaxios.post('admin/add', entity);
    },
    //修改
    update(entity) {
        return newaxios.post(`admin/alter`, entity);
    },
    //删除
    delete(id) {
        return newaxios.delete(`admin/${id}`);
    },
    //批量删除
    batchDelete(ids) {
        return newaxios.delete(`admin/batch/${ids}`);
    },
    //获得所有角色
    getAllRoles() {
        return newaxios.get(`role`);
    },
    //获取表格下载链接
    exportExcel() {
        return newaxios.get("admin/exportExcel");
    },
}
export default admin;
