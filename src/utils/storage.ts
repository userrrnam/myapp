/**
 * Storage
 * @file 公共存储
 * @module src/utils/storage.ts
 * @author hecan
 */

 export enum EnumStorageKey {
    TOKEN = 'admin',
    USER_INFO = 'adminInfo',
  }
  
  export function setToken(token: string) {
    localStorage.setItem(EnumStorageKey.TOKEN, token);
  }
  
  export function getToken(): string {
    return localStorage.getItem(EnumStorageKey.TOKEN) as string;
  }
  
  export function removeToken() {
    localStorage.removeItem(EnumStorageKey.TOKEN);
  }
  
  export function setUserInfo(userInfo: any) {
    localStorage.setItem(EnumStorageKey.USER_INFO, JSON.stringify(userInfo));
  }
  
  export function getUserInfo(): any {
    return JSON.parse(localStorage.getItem(EnumStorageKey.USER_INFO) as string);
  }
  
  export function removeUserInfo() {
    localStorage.removeItem(EnumStorageKey.USER_INFO);
  }
  