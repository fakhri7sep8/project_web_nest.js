import { ResponsePagination, ResponseSuccess } from "src/interface";

class BaseResponse {
    _success (msg : string , data? : any) : ResponseSuccess{
        return {
            status : "success",
            message : msg,
            data : data || {},
        };
    }

    _pagination(
    message : string ,
    data : any ,
    total : number ,
    page :number ,
    pageSize : number 
    ) : ResponsePagination {
        return {
            status : "Success",
            message : message,
            data : data || {},
            pagination : {
                total : total ,
                page : page,
                pageSize : pageSize,
                totalPage : Math.ceil(total/pageSize)
            }
        }
    }
}

export default BaseResponse