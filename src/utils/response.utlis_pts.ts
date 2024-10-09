// src/utils/response.utlis.ts
import { ResponsePagination, ResponseSuccess } from '../interface/response.interface_pts';

class BaseResponse {
  _success(message: string, data?: any): ResponseSuccess {
    return {
      status: 'Success',
      message: message,
      data: data || {},
    };
  }

  _pagination(
    message: string,
    data: any,
    total: number,
    page: number,
    pageSize: number
  ): ResponsePagination {
    const total_page = Math.ceil(total / pageSize);
    const nextPage = page < total_page ? page + 1 : 0;
    const previosPage = page > 1 ? page - 1 : 1;
  
    return {
      status: 'Success',
      message: message,
      data: data || {},
      pagination: {
        total: total,
        page: page,
        pageSize: pageSize,
        total_page: total_page,
        nextPage: nextPage,
        previosPage: previosPage,
      },
    };
  }
  
}

export default BaseResponse;
