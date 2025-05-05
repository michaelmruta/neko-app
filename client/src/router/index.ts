/// <reference types="vite/client" />
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../components/Login.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../components/SignUp.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/contact',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: false },
            children: [{
                path: '',
                name: 'Contacts List',
                component: () => import('../views/contact/list.vue')
            }, {
                path: '/contact/edit',
                name: 'Contact Edit',
                component: () => import('../views/contact/edit.vue')
            }]
        },
        {
            path: '/customer',
            name: 'customer',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: false },
            children: [{
                path: '',
                name: 'Customers List',
                component: () => import('../views/customer/list.vue')
            }, {
                path: '/customer/edit',
                name: 'Customer Edit',
                component: () => import('../views/customer/edit.vue')
            }]
        },
        {
            path: '/lead',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: false },
            children: [{
                path: '',
                name: 'Leads List',
                component: () => import('../views/lead/list.vue')
            }, {
                path: '/lead/edit',
                name: 'Lead Edit',
                component: () => import('../views/lead/edit.vue')
            }]
        },
        {
            path: '/opportunity',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: false },
            children: [{
                path: '',
                name: 'Opportunities List',
                component: () => import('../views/opportunity/list.vue')
            }, {
                path: '/opportunity/edit',
                name: 'Opportunity Edit',
                component: () => import('../views/opportunity/edit.vue')
            }]
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../layouts/DashboardLayout.vue'),
            // meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard-home',
                    component: () => import('../views/Dashboard.vue')
                },
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('../views/Users.vue')
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('../views/Settings.vue')
                }
            ]
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    try {
        // Handle authentication state conflicts
        if (requiresAuth) {
            if (!authStore.isAuthenticated) {
                next({ name: 'login', query: { redirect: to.fullPath } })
                return
            }
        } else {
            if (authStore.isAuthenticated) {
                // Redirect authenticated users from auth pages to dashboard
                if (to.name === 'login' || to.name === 'signup') {
                    next({ name: 'dashboard-home' })
                    return
                }
            }
        }

        next()
    } catch (error) {
        console.error('Router error:', error)
        next('/login')
    }
})

export default router