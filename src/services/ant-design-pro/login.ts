// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 登录接口 POST /admin/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/admin/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送验证码 POST /admin/login/captcha */
export async function getFakeCaptcha(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFakeCaptchaParams,
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/admin/login/captcha', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 登录接口 POST /admin/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/admin/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
