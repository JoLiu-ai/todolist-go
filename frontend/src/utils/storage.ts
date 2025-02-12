/**
 * 本地存储工具函数
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

/**
 * 保存 token 到本地存储
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 从本地存储获取 token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 从本地存储删除 token
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 保存用户信息到本地存储
 */
export const setUserInfo = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * 从本地存储获取用户信息
 */
export const getUserInfo = (): any | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * 从本地存储删除用户信息
 */
export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_KEY);
};

/**
 * 清除所有认证相关的本地存储
 */
export const clearAuthStorage = (): void => {
  removeToken();
  removeUserInfo();
}; 