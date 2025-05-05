module.exports = (
  model,
  html,
  headerTemplate,
  filtersTemplate,
  footerTemplate,
  scriptTemplate
) => `<template>
  ${headerTemplate(model)}
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${model}</h3>
        </div>
        ${filtersTemplate}
        <div class="row g-2 align-items-center">
          <div class="col">
            ${html}
          </div>
        </div>
        ${footerTemplate}
      </div>
    </div>
  </div>

  <div
    class="modal modal-blur fade"
    :class="{ show: showDeleteModal }"
    tabindex="-1"
    :style="showDeleteModal ? 'display: block;' : ''"
  >
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="modal-title">Are you sure?</div>
          <div>If you proceed, you will delete the record {{ itemToDelete?.name }}.</div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-link link-secondary me-auto"
            @click="closeDeleteModal"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="deleteItem">Yes, delete record</button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showDeleteModal" style="z-index: -1"></div>
  </div>
</template>
${scriptTemplate(model)}`;
