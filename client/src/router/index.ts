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
            path: '/forgot-password',
            name: 'forgot-password',
            component: () => import('../views/ForgotPassword.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/reset-password',
            name: 'reset-password',
            component: () => import('../views/ResetPassword.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../components/SignUp.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/terms',
            name: 'terms',
            component: () => import('../views/Terms.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/policy',
            name: 'policy',
            component: () => import('../views/Policy.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: '',
                name: 'dashboard-home',
                component: () => import('../views/Dashboard.vue')
            }]
        },
        {
            path: '/users',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: '',
                name: 'users',
                component: () => import('../views/Users.vue')
            }]
        },
        {
            path: '/profile',
            meta: { requiresAuth: true },
            component: () => import('../layouts/DashboardLayout.vue'),
            children: [{
                path: '',
                name: 'profile',
                component: () => import('../views/Profile.vue')
            }]
        },
        {
            path: '/settings',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: '',
                name: 'settings',
                component: () => import('../views/Settings.vue')
            }]
        },
        {
            path: '/contact',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: '',
                name: 'contact-list',
                component: () => import('../views/contact/list.vue')
            }, {
                path: '/contact/edit',
                name: 'contact-edit',
                component: () => import('../views/contact/edit.vue')
            }]
        },
        {
            path: '/customer',
            name: 'customer',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: '',
                name: 'customer-list',
                component: () => import('../views/customer/list.vue')
            }, {
                path: '/customer/edit',
                name: 'customer-edit',
                component: () => import('../views/customer/edit.vue')
            }]
        },
        {
            path: '/lead',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: '',
                name: 'lead-list',
                component: () => import('../views/lead/list.vue')
            }, {
                path: '/lead/edit',
                name: 'lead-edit',
                component: () => import('../views/lead/edit.vue')
            }]
        },
        {
            path: '/opportunity',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: '',
                name: 'opportunity-list',
                component: () => import('../views/opportunity/list.vue')
            }, {
                path: '/opportunity/edit',
                name: 'opportunity-edit',
                component: () => import('../views/opportunity/edit.vue')
            }]
        },
        {
            path: '/product',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: '',
                name: 'product-list',
                component: () => import('../views/product/list.vue')
            }, {
                path: '/product/edit',
                name: 'product-edit',
                component: () => import('../views/product/edit.vue')
            }]
        },
        {
            path: '/inventory',
            component: () => import('../layouts/DashboardLayout.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: '',
                name: 'inventory-list',
                component: () => import('../views/inventory/list.vue')
            }, {
                path: '/inventory/edit',
                name: 'inventory-edit',
                component: () => import('../views/inventory/edit.vue')
            }]
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Initialize auth state if not already done
    if (!authStore.isAuthenticated) {
        await authStore.initializeAuth()
    }

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