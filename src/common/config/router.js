const routes = [
    {
        path:'/home',
        component:() => import('@/views/home'),
        children:[
            {
                path:'/',
                redirect:{name:'dashboard'},
                component:() => import('@/views/home'),
            },
            {
                path:'/dashboard',
                name:'dashboard',
                component: () => import('@/views/dashboard/dashboard')
            },

            //用户
            {
                path:'/users_list',
                component: () => import('@/views/users/users_list')
            },
            {
                path:'/user_detail',
                component: () => import('@/views/users/user_detail')
            },
            //商户
            {
                path:'/merchants',
                component: () => import('@/views/merchant/merchants')
            },
            {
                path:'/edit_merchant',
                component: () => import('@/views/merchant/edit')
            },
            {
                path:'/add_merchant',
                component: () => import('@/views/merchant/add')
            },
            {
                path:'/photos_merchant',
                component: () => import('@/views/merchant/photos')
            },

            //活动
            {
                path:'/activity_list',
                component: () => import('@/views/activity/activityList')
            },
            {
                path:'/activity_detail',
                component: () => import('@/views/activity/activityDetail')
            },
            {
                path:'/add_activity',
                component: () => import('@/views/activity/addActivity' )
            },
            {
                path:'/edit_activity',
                component: () => import('@/views/activity/editActivity')
            },
            {
                path:'/join_activity',
                component: () => import('@/views/activity/joinActivity')
            },

            //邀约
            {
                path:'/meets',
                component:() => import('@/views/meet/meets')
            },




            //匹配
            {
                path:'/pair',
                component: () => import('@/views/pair/index')
            },


            //权限管理
            {
                path:'/roles',
                component: () => import('@/views/manage/roles')
            },
            {
                path:'/permissions',
                component: () => import('@/views/manage/permissions')
            },
            {
                path:'/user_roles',
                component: () => import('@/views/manage/user_roles')
            },
            {
                path:'/role_permissions',
                component: () => import('@/views/manage/role_permissions')
            },


        ]
    },
    //未嵌套，左边无导航
    {
        path:'/check',
        component: () => import('@/views/activity/check')
    },
    {
        path:'/meet_check',
        component:() => import('@/views/meet/meet_check')//验邀约码
    },

    {
        path: '/login',
        name:'login',
        component:  () => import('@/views/login/login')
    },
    {
        path: '*',
        redirect:{name:'dashboard'},
    },
]
export default routes
