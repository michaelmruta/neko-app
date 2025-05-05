module.exports = (model) => `<div class="card-footer d-flex align-items-center">
  <p class="m-0 text-muted">
    Showing
    <span>{{ (currentPage - 1) * pageSize + 1 }}</span> to
    <span>{{ Math.min(currentPage * pageSize, filteredSet.length) }}</span> of
    <span>{{ filteredSet.length }}</span> entries
  </p>
  <ul class="pagination m-0 ms-auto">
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
        Previous
      </button>
    </li>
    <li
      class="page-item"
      v-for="page in totalPages"
      :key="page"
      :class="{ active: currentPage === page }"
    >
      <button class="page-link" @click="currentPage = page">
        {{ page }}
      </button>
    </li>
    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <button
        class="page-link"
        @click="currentPage++"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </li>
  </ul>
</div>`;
