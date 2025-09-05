
import { request } from '@umijs/max'; 

//获取系统错误日志列表
export async function listSysError(params: any) {
  return request('/admin/drama/err-log/list', {
    method: 'GET',
    params,
  });
}



