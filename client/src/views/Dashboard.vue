<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">Dashboard</h2>
        </div>
      </div>
    </div>
  </div>

  <div class="page-body">
    <div class="container-xl">
      <div class="row row-deck row-cards">
        <!-- Stats cards -->
        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="subheader">Total Users</div>
              </div>
              <div class="h1 mb-3">75</div>
              <div class="d-flex mb-2">
                <div>Conversion rate</div>
                <div class="ms-auto">
                  <span class="text-green d-inline-flex align-items-center lh-1">
                    7% <i class="ti ti-trending-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="subheader">Active Users</div>
              </div>
              <div class="h1 mb-3">62</div>
              <div class="d-flex mb-2">
                <div>Conversion rate</div>
                <div class="ms-auto">
                  <span class="text-green d-inline-flex align-items-center lh-1">
                    9% <i class="ti ti-trending-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="subheader">New Users</div>
              </div>
              <div class="h1 mb-3">7</div>
              <div class="d-flex mb-2">
                <div>Conversion rate</div>
                <div class="ms-auto">
                  <span class="text-red d-inline-flex align-items-center lh-1">
                    -2% <i class="ti ti-trending-down"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="subheader">Pending Verification</div>
              </div>
              <div class="h1 mb-3">6</div>
              <div class="d-flex mb-2">
                <div>Conversion rate</div>
                <div class="ms-auto">
                  <span class="text-green d-inline-flex align-items-center lh-1">
                    5% <i class="ti ti-trending-up"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Welcome card -->
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">Welcome to Neko App Dashboard</h3>
              <p>
                This is your admin dashboard where you can manage users, settings, and view
                statistics.
              </p>
              <p>
                Use the navigation menu on the left to access different sections of the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dashboard component logic can be added here
</script>
