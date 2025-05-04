<template>
    <div class="page-header d-print-none">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">User</h2>
            <form>
  <div class="mb-3">
    <label for="id" class="form-label">Id</label>
    <input type="number" class="form-control" id="id" name="id">
  </div>
  <div class="mb-3">
    <label for="name" class="form-label">Name</label>
    <input type="text" class="form-control" id="name" name="name">
  </div>
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" name="email">
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" name="password">
  </div>
  <div class="mb-3">
    <label for="role" class="form-label">Role</label>
    <input type="text" class="form-control" id="role" name="role">
  </div>
  <div class="mb-3">
    <label for="status" class="form-label">Status</label>
    <input type="text" class="form-control" id="status" name="status">
  </div>
  <div class="mb-3">
    <label for="lastLogin" class="form-label">LastLogin</label>
    <input type="datetime-local" class="form-control" id="lastLogin" name="lastLogin">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="isVerified" name="isVerified">
    <label class="form-check-label" for="isVerified">IsVerified</label>
  </div>
  <div class="mb-3">
    <label for="verificationToken" class="form-label">VerificationToken</label>
    <input type="password" class="form-control" id="verificationToken" name="verificationToken">
  </div>
  <div class="mb-3">
    <label for="resetToken" class="form-label">ResetToken</label>
    <input type="password" class="form-control" id="resetToken" name="resetToken">
  </div>
  <div class="mb-3">
    <label for="resetTokenExpiry" class="form-label">ResetTokenExpiry</label>
    <input type="datetime-local" class="form-control" id="resetTokenExpiry" name="resetTokenExpiry">
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