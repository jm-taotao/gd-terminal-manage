import {get, post} from 'http'

//登录
export const login = p => get('api/v1/login',p);
