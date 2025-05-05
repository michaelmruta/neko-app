module.exports = `<div class="card-body border-bottom py-3">
  <div class="d-flex">
    <div class="text-muted">
      Show
      <div class="mx-2 d-inline-block">
        <select class="form-select form-select-sm" v-model="pageSize">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      entries
    </div>
    <div class="ms-auto text-muted">
      Search:
      <div class="ms-2 d-inline-block">
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="searchQuery"
          placeholder="Search..."
        />
      </div>
    </div>
  </div>
</div>`;
