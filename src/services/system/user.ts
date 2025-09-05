import { formatTreeData } from '@/utils/tree';
import { request } from '@umijs/max';
import { DataNode } from 'antd/es/tree';
import { downLoadXlsx } from '@/utils/downloadfile';

// 查询用户信息列表
export async function getUserList(params?: API.System.UserListParams, options?: { [key: string]: any }) {
  return request<API.System.UserPageResult>('/admin/system/user/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params,
    ...(options || {})
  });
}

// 查询用户信息详细
export function getUser(userId: number, options?: { [key: string]: any }) {
  return request<API.System.UserInfoResult>(`/admin/system/user/${userId}`, {
    method: 'GET',
    ...(options || {})
  });
}

// 新增用户信息
export async function addUser(params: API.System.User, options?: { [key: string]: any }) {
  return request<API.Result>('/admin/system/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params,
    ...(options || {})
  });
}

// 修改用户信息
export async function updateUser(params: API.System.User, options?: { [key: string]: any }) {
  return request<API.Result>('/admin/system/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params,
    ...(options || {})
  });
}

// 删除用户信息
export async function removeUser(ids: string, options?: { [key: string]: any }) {
  return request<API.Result>(`/admin/system/user/${ids}`, {
    method: 'DELETE',
    ...(options || {})
  });
}

// 导出用户信息
export function exportUser(params?: API.System.UserListParams, options?: { [key: string]: any }) {
  return downLoadXlsx(`/admin/system/user/export`, { params }, `user_${new Date().getTime()}.xlsx`);
}

// 用户状态修改
export function changeUserStatus(userId: number, status: string) {
  const data = {
    userId,
    status
  }
  return request<API.Result>('/admin/system/user/changeStatus', {
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request('/admin/system/user/profile', {
    method: 'get'
  })
}

export function updateUserProfile(data: API.CurrentUser) {
  return request<API.Result>('/admin/system/user/profile', {
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function resetUserPwd(userId: number, password: string) {
  const data = {
    userId,
    password
  }
  return request<API.Result>('/admin/system/user/resetPwd', {
    method: 'put',
    data: data
  })
}

// 用户t个人密码重置
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword
  }
  return request<API.Result>('/admin/system/user/profile/updatePwd', {
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data: any) {
  return request('/admin/system/user/profile/avatar', {
    method: 'post',
    data: data
  })
}


// 查询授权角色
export function getAuthRole(userId: number) {
  return request('/system/user/authRole/' + userId, {
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data: Record<string, any>) {
  return request('/system/user/authRole', {
    method: 'put',
    params: data
  })
}

// 获取数据列表
export function getDeptTree(params: any): Promise<DataNode[]> {
  return new Promise((resolve) => {
    request(`/admin/system/user/deptTree`, {
      method: 'get',
      params,
    }).then((res: any) => {
      if (res && res.code === 200) {
        const treeData = formatTreeData(res.data);
        resolve(treeData);
      } else {
        resolve([]);
      }
    });
  });
}
