import { request } from '@umijs/max';


/**
 * 短剧绑定标签
 * @param params 
 * @returns 
 */
export function postMovieBind(data: Record<string, any>) {
  return request('/admin/drama/movieTag', {
    method: 'POST',
    data,
  });
}

/**
 * 修改短剧绑定标签
 */
export function putMovieTag(data: Record<string, any>) {
  return request('/admin/drama/movieTag', {
    method: 'PUT',
    data,
  });
}


/** 获取关联列表 */
export function getMovieTagList(params: Record<string, any>) {
  return request('/admin/drama/movieTag/list', {
    method: 'GET',
    params,
  });
}

/** 删除短剧标签关联 */
export function deleteMovieTag(ids: number[]) {
  return request(`/admin/drama/movieTag/${ids}`, {
    method: 'DELETE',
  });
}

/** 获取短剧标签关联详细信息 */
export function getMovieTagDetail(id: string) {
  return request(`/admin/drama/movieTag/${id}`, {
    method: 'GET',
  });
}



