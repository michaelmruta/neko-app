const fs = require("fs");
const path = require("path");

const viewsPath = path.join(__dirname, "..", "client", "src", "views");
const schemaPath = path.join(__dirname, "..", "server", "prisma", "models");

const headerPartial = (title) => `<div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <h2 class="page-title">{{ name }}</h2>
        </div>
        <div class="col-auto ms-auto d-print-none">
          <div class="btn-list">
            <button class="btn btn-primary d-none d-sm-inline-block" @click="openAddUserModal">
              <i class="ti ti-plus"></i>
              Add ${title}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;

const filtersPartial = `<div class="card-body border-bottom py-3">
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
                  placeholder="Search users..."
                />
              </div>
            </div>
          </div>
        </div>`;

const footerPartial = `<div class="card-footer d-flex align-items-center">
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

const pageWrapper = (title, html) => `<template>
    ${headerPartial(title)}
    <div class="page-header d-print-none">
      <div class="container-xl">
       <div class="card">
          <div class="card-header">
            <h3 class="card-title">${title}</h3>
          </div>
          ${filtersPartial}
          <div class="row g-2 align-items-center">
            <div class="col">
              ${html}
            </div>
          </div>
           ${footerPartial}
        </div>
       
      </div>
    </div>
  </template>
  <script>
    import { ref, computed, onMounted, watch } from 'vue'

    const searchQuery = ref('')
    const pageSize = ref(10)
    const currentPage = ref(1)
    const totalPages = computed(() => {
      return Math.ceil(filteredSet.value.length / pageSize.value)
    })

    watch([searchQuery, pageSize], () => {
      currentPage.value = 1
    })

    export default {
      computed: {
        filteredSet() {
          return (!searchQuery.value) ? [] : []
        },
        name() {
          return this.$route.name
        },
      },
    }
  </script>`;

// Map Prisma types to form controls
const typeToFormControl = {
  String: (field) => {
    // Check if the field name contains 'token' or 'password' to determine if it's a password field
    if (
      field.toLowerCase().includes("token") ||
      field.toLowerCase().includes("password")
    ) {
      return "password";
    }
    // Check if the field name contains 'email' to determine if it's an email field
    if (field.toLowerCase().includes("email")) {
      return "email";
    }
    // For longer text fields, use textarea
    if (
      field.toLowerCase().includes("description") ||
      field.toLowerCase().includes("content")
    ) {
      return "textarea";
    }
    return "text";
  },
  Int: () => "number",
  Float: () => "number",
  Decimal: () => "number",
  Boolean: () => "checkbox",
  DateTime: () => "datetime-local",
  Json: () => "textarea",
  Enum: () => "select",
  // For relations, we'll use select
  Relation: () => "select",
};

function extractModels(schemaContent) {
  const modelRegex = /model (\w+) {([^}]+)}/g;
  const models = [];
  let match;

  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const modelName = match[1];
    const modelContent = match[2];

    const fields = extractFields(modelContent);
    models.push({
      name: modelName,
      fields: fields,
    });
  }

  return models;
}

function extractFields(modelContent) {
  const fieldRegex = /(\w+)\s+(\w+)(\?)?(\s+@\w+(\([^)]*\))?)*/g;
  const fields = [];
  let match;

  while ((match = fieldRegex.exec(modelContent)) !== null) {
    const fieldName = match[1];
    const fieldType = match[2];
    const isOptional = match[3] === "?";
    const attributes = match[4] || "";

    // Determine if it's a relation field
    const isRelation = attributes.includes("@relation");

    fields.push({
      name: fieldName,
      type: fieldType,
      isOptional,
      formControl: isRelation
        ? typeToFormControl["Relation"]()
        : typeToFormControl[fieldType]?.(fieldName) || "text",
      attributes: attributes.trim(),
    });
  }

  return fields;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toSentenceCase(str) {
  return str
    .split(/(?=[A-Z])/)
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
}

function generateForm(model) {
  let formHtml = `<form>\n`;

  model.fields.forEach((field) => {
    if (field.formControl === "checkbox") {
      formHtml += `  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="${field.name}" name="${
        field.name
      }">
    <label class="form-check-label" for="${field.name}">${capitalizeFirstLetter(
        field.name
      )}</label>
  </div>\n`;
    } else if (field.formControl === "textarea") {
      formHtml += `  <div class="mb-3">
    <label for="${field.name}" class="form-label">${capitalizeFirstLetter(
        field.name
      )}</label>
    <textarea class="form-control" id="${field.name}" name="${
        field.name
      }" rows="3"></textarea>
  </div>\n`;
    } else if (field.formControl === "select") {
      formHtml += `  <div class="mb-3">
    <label for="${field.name}" class="form-label">${capitalizeFirstLetter(
        field.name
      )}</label>
    <select class="form-select" id="${field.name}" name="${field.name}">
      <!-- Options to be populated by JavaScript -->
    </select>
  </div>\n`;
    } else {
      formHtml += `  <div class="mb-3">
    <label for="${field.name}" class="form-label">${capitalizeFirstLetter(
        field.name
      )}</label>
    <input type="${field.formControl}" class="form-control" id="${
        field.name
      }" name="${field.name}">
  </div>\n`;
    }
  });

  formHtml += `</form>`;

  return pageWrapper(model.name, formHtml);
}

function generateTable(model) {
  let tableHtml = `<table class="table">
  <thead>
    <tr>\n`;

  model.fields.forEach((field) => {
    tableHtml += `<th scope="col">${toSentenceCase(field.name)}</th>\n`;
  });

  tableHtml += `</tr>
  </thead>
  <tbody>
    <!-- Table rows to be populated by JavaScript -->
  </tbody>
</table>`;

  return pageWrapper(model.name, tableHtml);
}

fs.readdir(schemaPath, (err, files) => {
  if (err) {
    console.error("Error reading dir file:", err);
  }
  for (let file of files) {
    if (file.includes(".prisma")) {
      fs.readFile(path.join(schemaPath, file), "utf8", (err, data) => {
        if (err) {
          console.error("Error reading the file:", err);
          return;
        }

        // Extract model definitions from the schema content
        const models = extractModels(data);

        console.log(models);
        // Generate Bootstrap HTML for each model

        const html = models.map((model) => {
          const dirPath = path.join(`${viewsPath}`, model.name.toLowerCase());

          console.log(dirPath);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }

          fs.writeFileSync(
            `${viewsPath}/${model.name?.toLowerCase()}/edit.vue`,
            generateForm(model),
            {
              encoding: "utf-8",
            }
          );
          fs.writeFileSync(
            `${viewsPath}/${model.name?.toLowerCase()}/list.vue`,
            generateTable(model),
            {
              encoding: "utf-8",
            }
          );
        });
      });
    }
  }
});
