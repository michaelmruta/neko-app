module.exports = (model) => `<div class="page-header d-print-none">
  <div class="container-xl">
    <div class="row g-2 align-items-center">
      <div class="col">
        <h2 class="page-title">{{ title }}</h2>
      </div>
      <div class="col-auto ms-auto d-print-none">
        <div class="btn-list">
          <button v-if="items" class="btn btn-primary d-none d-sm-inline-block" @click="addRecord()">
            <i class="ti ti-plus"></i>
            Add ${model}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`;
