module.exports = (title) => `<div class="page-header d-print-none">
  <div class="container-xl">
    <div class="row g-2 align-items-center">
      <div class="col">
        <h2 class="page-title">{{ name }}</h2>
      </div>
      <div class="col-auto ms-auto d-print-none">
        <div class="btn-list">
          <button class="btn btn-danger d-none d-sm-inline-block" @click="cancel">
            <i class="ti ti-plus"></i>
            Cancel
          </button>
          <button class="btn btn-primary d-none d-sm-inline-block" @click="save">
            <i class="ti ti-plus"></i>
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`;
