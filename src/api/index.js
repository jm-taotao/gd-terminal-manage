const Index = {
    'LOGIN_SUCCESS':'10000',
    'LOGIN_FAILED':'10001',

    'terminal_login': '/login',
    'terminal_logout': '/logOut',
    'terminal_index': '/index',
    'terminal_menuTree': '/menu/tree',

//系统管理->用户管理
    'terminal_userManage': '/user/list',
    'terminal_userManage_detail': '/user/detail',
    'terminal_userManage_add': '/user/add',
    'terminal_userManage_update': '/user/update',
    'terminal_userManage_del': '/user/del',

//系统管理->菜单管理
    'terminal_menuManage': '/menu/tree',
    'terminal_menuManage_treeForLabel': '/menu/treeForLabel',
    'terminal_menuManage_treeForLabelID': '/menu/treeForLabelAndID',
    'terminal_menuManage_detail': '/menu/detail',
    'terminal_menuManage_add': '/menu/add',
    'terminal_menuManage_update': '/menu/update',
    'terminal_menuManage_del': '/menu/del',

//系统管理->角色管理
    'terminal_roleManage': '/role/list',
    'terminal_roleManage_roleMenuList': '/role/roleMenuList',//获取指定角色下的菜单id集合
    'terminal_roleManage_detail': '/role/detail',
    'terminal_roleManage_add': '/role/add',
    'terminal_roleManage_addUserRole': '/role/addUserRole',
    'terminal_roleManage_addRoleMenu': '/role/addRoleMenus',
    'terminal_roleManage_update': '/role/update',
    'terminal_roleManage_del': '/role/del',
    'terminal_roleManage_removeUserRole': '/role/removeUserRole',

    //系统管理->用户管理
    'terminal_productManage': '/product/list',
    'terminal_productManage_detail': '/product/detail',
    'terminal_productManage_add': '/product/add',
    'terminal_productManage_update': '/product/update',
    'terminal_productManage_del': '/product/del',

}

export default Index;