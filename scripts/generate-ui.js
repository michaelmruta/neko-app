const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

const viewsPath = path.join(__dirname, "..", "client", "src", "views");
const schemaPath = path.join(__dirname, "..", "server", "prisma", "models");

// Import templates
const headerTemplate = require("./templates/header.template");
const filtersTemplate = require("./templates/filters.template");
const footerTemplate = require("./templates/footer.template");
const scriptTemplate = require("./templates/script.template");
const scriptEditTemplate = require("./templates/script-edit.template");
const pageTemplate = require("./templates/page.template");

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

// Helper functions for form field generation
function generateFormField(field) {
  const fieldLabel = capitalizeFirstLetter(field.name);
  const fieldId = field.name;

  switch (field.formControl) {
    case "checkbox":
      return generateCheckboxField(fieldId, fieldLabel);
    case "textarea":
      return generateTextareaField(fieldId, fieldLabel);
    case "select":
      return generateSelectField(fieldId, fieldLabel);
    default:
      return generateInputField(fieldId, fieldLabel, field.formControl);
  }
}

function generateCheckboxField(id, label) {
  return `<div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
    <div class="form-check">
      <input type="checkbox" class="form-check-input" id="${id}" v-model="formData.${id}">
      <label class="form-check-label" for="${id}">${toSentenceCase(label)}</label>
    </div>
  </div>
`;
}

function generateTextareaField(id, label) {
  return `<div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
    <label for="${id}" class="form-label">${toSentenceCase(label)}</label>
    <textarea class="form-control" id="${id}" v-model="formData.${id}" rows="3"></textarea>
  </div>
`;
}

function generateSelectField(id, label) {
  return `<div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
    <label for="${id}" class="form-label">${label}</label>
    <select class="form-select" id="${id}" v-model="formData.${id}">
      <!-- Options to be populated by JavaScript -->
    </select>
  </div>
`;
}

function generateInputField(id, label, type) {
  return `<div class="col-sm-12 col-md-6 col-lg-4 px-5 py-2">
    <label for="${id}" class="form-label">${toSentenceCase(label)}</label>
    <input type="${type}" class="form-control" id="${id}" 
      ${
        type === "datetime-local"
          ? `:value="formatDateTime(formData.${id})"`
          : `v-model="formData.${id}"`
      } />
  </div>
`;
}

function generateForm(model) {
  let formHtml = `<form @submit.prevent="saveRecord">
  <div class="row">
`;

  // Generate form fields
  model.fields.forEach((field) => {
    if (field.name === "id") return;
    formHtml += generateFormField(field);
  });

  formHtml += `</div>
`;

  // Add submit and cancel buttons
  formHtml +=
    `  <div class="d-flex justify-content-between mt-4 card-footer">` +
    `    <button type="button" class="btn btn-secondary" @click="cancel">Cancel</button>` +
    `    <button type="submit" class="btn btn-primary" :disabled="isLoading">` +
    `      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>` +
    `      {{ isNewRecord ? 'Create' : 'Update' }}` +
    `    </button>` +
    `  </div>
`;

  // Add debug panel for formData - only visible in development mode
  formHtml +=
    `  <div v-if="isDev" class="p-3 rounded bg-light">` +
    `    <h5>Form Data (Debug):</h5>` +
    `    <pre class="mb-0">{{ JSON.stringify(formData, null, 2) }}</pre>` +
    `  </div>
`;

  formHtml += `</form>`;

  return pageTemplate(model.name, formHtml, scriptEditTemplate, headerTemplate);
}

function generateTable(model) {
  let tableHtml = `<div class="table-responsive"><table class="table"><thead><tr>`;

  model.fields.forEach((field) => {
    tableHtml += `<th scope="col">${toSentenceCase(field.name)}</th>`;
  });

  tableHtml += `<th scope="col">Actions</th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          ${model.fields
            .map(
              (field) => `
          <td>{{ item.${field.name} }}</td>`
            )
            .join("")}
          <td>
            <div class="btn-list flex-nowrap">
              <button class="btn btn-sm btn-outline-primary" @click="edit(item)">
                <i class="ti ti-edit"></i>
                Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(item)">
                <i class="ti ti-trash"></i>
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table></div>`;

  return pageTemplate(
    model.name,
    tableHtml,
    scriptTemplate,
    headerTemplate,
    filtersTemplate,
    footerTemplate
  );
}

async function formatVueFile(content) {
  try {
    // Get prettier config from client directory
    const prettierConfig = await prettier.resolveConfig(
      path.join(__dirname, "..", "client", ".prettierrc.json")
    );

    // Format the content using prettier
    return prettier.format(content, {
      ...prettierConfig,
      parser: "vue",
    });
  } catch (error) {
    console.error("Error formatting Vue file:", error);
    return content; // Return original content if formatting fails
  }
}

fs.readdir(schemaPath, (err, files) => {
  if (err) {
    console.error("Error reading dir file:", err);
    return;
  }

  // Ensure templates directory exists
  const templatesDir = path.join(__dirname, "templates");
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  for (let file of files) {
    if (file.includes(".prisma")) {
      fs.readFile(path.join(schemaPath, file), "utf8", async (err, data) => {
        if (err) {
          console.error("Error reading the file:", err);
          return;
        }

        // Extract model definitions from the schema content
        const models = extractModels(data);

        console.log(models);
        // Generate Bootstrap HTML for each model

        for (const model of models) {
          const dirPath = path.join(`${viewsPath}`, model.name.toLowerCase());

          console.log(dirPath);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }

          // Generate and format edit.vue
          const editContent = generateForm(model);
          const formattedEditContent = await formatVueFile(editContent);
          fs.writeFileSync(
            `${viewsPath}/${model.name?.toLowerCase()}/edit.vue`,
            formattedEditContent,
            { encoding: "utf-8" }
          );

          // Generate and format list.vue
          const listContent = generateTable(model);
          const formattedListContent = await formatVueFile(listContent);
          fs.writeFileSync(
            `${viewsPath}/${model.name?.toLowerCase()}/list.vue`,
            formattedListContent,
            { encoding: "utf-8" }
          );
        }
      });
    }
  }
});
