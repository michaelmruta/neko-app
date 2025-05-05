const blank = () => {
  return "";
};
module.exports = (
  model,
  html,
  scriptTemplate,
  headerTemplate = blank,
  filtersTemplate = blank,
  footerTemplate = blank
) => `<template>
  ${headerTemplate(model)}
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4 class="card-title">${model}</h4>
          <h3 class="card-title">{{id ? "#" + id : ""}}</h3>
        </div>
        ${filtersTemplate(model)}
        <div class="row g-2 align-items-center">
          <div class="col">
            ${html}
          </div>
        </div>
        ${footerTemplate(model)}
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
          <div>If you proceed, you will delete the record #{{ itemToDelete?.id }}.</div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-link link-secondary me-auto"
            @click="closeDeleteModal"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="deleteRecord">Yes, delete record</button>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showDeleteModal" style="z-index: -1"></div>
  </div>
</template>
${scriptTemplate(model)}`;
