<template>
  <div class="page">
    <!-- Sidebar -->
    <aside class="navbar navbar-vertical navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-menu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <h1 class="navbar-brand navbar-brand-autodark">
          <a href="#">
            <img
              src="/static/logo-white.svg"
              width="110"
              height="32"
              alt="Tabler"
              class="navbar-brand-image"
            />
          </a>
        </h1>
        <div class="collapse navbar-collapse" id="navbar-menu">
          <ul class="navbar-nav pt-lg-3">
            <li class="nav-item">
              <router-link
                to="/dashboard"
                class="nav-link"
                :class="{ active: $route.path === '/dashboard' }"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <i class="ti ti-home"></i>
                </span>
                <span class="nav-link-title">Dashboard</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/contact"
                class="nav-link"
                :class="{ active: $route.path === '/contact' }"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <i class="ti ti-user"></i>
                </span>
                <span class="nav-link-title">Contact</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/customer"
                class="nav-link"
                :class="{ active: $route.path === '/customer' }"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <i class="ti ti-user"></i>
                </span>
                <span class="nav-link-title">Customer</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/lead" class="nav-link" :class="{ active: $route.path === '/lead' }">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <i class="ti ti-user"></i>
                </span>
                <span class="nav-link-title">Lead</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/opportunity"
                class="nav-link"
                :class="{ active: $route.path === '/opportunity' }"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <i class="ti ti-user"></i>
                </span>
                <span class="nav-link-title">Opportunity</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/dashboard/users"
                class="nav-link"
                :class="{ active: $route.path.includes('/users') }"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <i class="ti ti-users"></i>
                </span>
                <span class="nav-link-title">Users</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/dashboard/settings"
                class="nav-link"
                :class="{ active: $route.path.includes('/settings') }"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <i class="ti ti-settings"></i>
                </span>
                <span class="nav-link-title">Settings</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <!-- Navbar -->
    <header class="navbar navbar-expand-md navbar-light d-print-none d-md-block d-none">
      <div class="container-xl">
        <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3"></h1>
        <div class="navbar-nav flex-row order-md-last">
          <div class="nav-item dropdown">
            <a
              href="#"
              class="nav-link d-flex lh-1 text-reset p-0"
              data-bs-toggle="dropdown"
              aria-label="Open user menu"
            >
              <div class="d-none d-xl-block ps-2">
                <div>{{ user?.name || 'User' }}</div>
                <div class="mt-1 small text-muted">{{ user?.email }}</div>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
              <a href="#" class="dropdown-item">Profile</a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item" @click.prevent="handleLogout">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="page-wrapper">
      <!-- Page content -->
      <div class="page-body">
        <div class="container-xl">
          <router-view></router-view>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer footer-transparent d-print-none">
        <div class="container-xl">
          <div class="row text-center align-items-center flex-row-reverse">
            <div class="col-12 col-lg-auto mt-3 mt-lg-0">
              <ul class="list-inline list-inline-dots mb-0">
                <li class="list-inline-item">
                  Copyright &copy; {{ new Date().getFullYear() }}
                  <a href="." class="link-secondary">Neko App</a>. All rights reserved.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style>
/* Add any custom styles here */
.navbar-vertical {
  background-color: #1e293b;
}
</style>
