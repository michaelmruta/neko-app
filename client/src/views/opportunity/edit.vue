<template>
    <div class="page-header d-print-none">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">Opportunity</h2>
            <form>
  <div class="mb-3">
    <label for="id" class="form-label">Id</label>
    <input type="number" class="form-control" id="id" name="id">
  </div>
  <div class="mb-3">
    <label for="title" class="form-label">Title</label>
    <input type="text" class="form-control" id="title" name="title">
  </div>
  <div class="mb-3">
    <label for="description" class="form-label">Description</label>
    <textarea class="form-control" id="description" name="description" rows="3"></textarea>
  </div>
  <div class="mb-3">
    <label for="amount" class="form-label">Amount</label>
    <input type="number" class="form-control" id="amount" name="amount">
  </div>
  <div class="mb-3">
    <label for="stage" class="form-label">Stage</label>
    <input type="text" class="form-control" id="stage" name="stage">
  </div>
  <div class="mb-3">
    <label for="customer" class="form-label">Customer</label>
    <select class="form-select" id="customer" name="customer">
      <!-- Options to be populated by JavaScript -->
    </select>
  </div>
  <div class="mb-3">
    <label for="customerId" class="form-label">CustomerId</label>
    <input type="number" class="form-control" id="customerId" name="customerId">
  </div>
  <div class="mb-3">
    <label for="createdAt" class="form-label">CreatedAt</label>
    <input type="datetime-local" class="form-control" id="createdAt" name="createdAt">
  </div>
  <div class="mb-3">
    <label for="updatedAt" class="form-label">UpdatedAt</label>
    <input type="datetime-local" class="form-control" id="updatedAt" name="updatedAt">
  </div>
</form>
          </div>
        </div>
      </div>
    </div>
  </template>