import newaxios from "@/utils/myaxios";

export function upload(formData){
    return newaxios.post(`common/upload`,formData,{headers:{'Content-Type':"multipart-form-data"}})
}