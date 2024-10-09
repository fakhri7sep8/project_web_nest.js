export interface ResponseSuccess {
    status: string;
    message: string;
    data?: any;
}


export interface ResponsePagination {
  status: string;
  message: string;
  data: any;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    total_page: number;
    nextPage?: number ; 
    previosPage?: number; 
  };
}



  