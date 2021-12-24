
//登录
export const login = '/api/web/user/login';
//获取菜单信息
export const getMenuList = p => get('/api/web/menu/tree',p);
//获取用户分页列表
export const getPageUserList = p => get('/api/web/user/list',p);
