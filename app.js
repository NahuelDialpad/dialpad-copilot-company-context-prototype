(function () {
  "use strict";

  const MAX_FILE_BYTES = 20 * 1024 * 1024;
  const offices = [
    { id: "sf", name: "San Francisco" },
    { id: "ny", name: "New York" },
    { id: "aus", name: "Austin" },
    { id: "lon", name: "London" },
    { id: "bos", name: "Boston" },
    { id: "chi", name: "Chicago" },
    { id: "sea", name: "Seattle" },
    { id: "la", name: "Los Angeles" },
    { id: "den", name: "Denver" },
    { id: "atl", name: "Atlanta" },
    { id: "mia", name: "Miami" },
    { id: "dc", name: "Washington, DC" },
    { id: "tor", name: "Toronto" },
    { id: "van", name: "Vancouver" },
    { id: "mtl", name: "Montreal" },
    { id: "mex", name: "Mexico City" },
    { id: "sao", name: "São Paulo" },
    { id: "bue", name: "Buenos Aires" },
    { id: "dub", name: "Dublin" },
    { id: "par", name: "Paris" },
    { id: "ber", name: "Berlin" },
    { id: "ams", name: "Amsterdam" },
    { id: "sin", name: "Singapore" },
    { id: "syd", name: "Sydney" },
    { id: "tok", name: "Tokyo" },
    { id: "blr", name: "Bengaluru" },
  ];
  const groups = [
    { id: "sales", name: "Sales", type: "Department", office: "San Francisco" },
    {
      id: "support",
      name: "Customer Support",
      type: "Contact center",
      office: "Austin",
    },
    { id: "billing", name: "Billing", type: "Department", office: "New York" },
  ];
  const people = [
    {
      id: "alex",
      name: "Alex Morgan",
      email: "alex.morgan@example.com",
      office: "sf",
      groups: ["sales"],
    },
    {
      id: "priya",
      name: "Priya Shah",
      email: "priya.shah@example.com",
      office: "aus",
      groups: ["support"],
    },
    {
      id: "jordan",
      name: "Jordan Lee",
      email: "jordan.lee@example.com",
      office: "ny",
      groups: ["billing"],
    },
    {
      id: "samira",
      name: "Samira Patel",
      email: "samira.patel@example.com",
      office: "aus",
      groups: ["support"],
    },
    {
      id: "elliot",
      name: "Elliot Reed",
      email: "elliot.reed@example.com",
      office: "lon",
      groups: [],
    },
    {
      id: "maya",
      name: "Maya Chen",
      email: "maya.chen@example.com",
      office: "bos",
      groups: [],
    },
    {
      id: "noah",
      name: "Noah Tan",
      email: "noah.tan@example.com",
      office: "sin",
      groups: [],
    },
  ];
  const providers = [
    { id: "guru", name: "Guru", logo: "G", new: true },
    { id: "drive", name: "Google Drive", logo: "▲" },
    { id: "zendesk", name: "Zendesk", logo: "Z" },
    { id: "box", name: "Box", logo: "box" },
    { id: "document360", name: "Document360", logo: "◉" },
    { id: "confluence", name: "Confluence", logo: "≋" },
    { id: "servicenow", name: "ServiceNow", logo: "●" },
    { id: "salesforce", name: "Salesforce", logo: "☁" },
  ];
  const sampleDocuments = [
    {
      id: "sample-product",
      title: "Product and service guide",
      kind: "file",
      source: "upload",
      fileName: "product-service-guide.pdf",
      label: "Product",
      status: "published",
      scope: { company: true, offices: [], groups: [], users: [] },
      content:
        "The Standard plan includes shared team calling and messaging. Advanced adds call center reporting and priority support. New teams receive guided onboarding during their first 30 days.",
      keywords: "product package plan standard advanced onboarding service",
    },
    {
      id: "sample-pricing",
      title: "US pricing guidance",
      kind: "file",
      source: "upload",
      fileName: "us-pricing-guidance.pdf",
      label: "Policy",
      status: "published",
      scope: { company: false, offices: ["sf", "ny"], groups: [], users: [] },
      content:
        "For US quotes, use the current approved price book. Discounts above 15 percent require the regional manager. Do not use expired promotional pricing.",
      keywords: "pricing price quote discount manager promotional sales",
    },
    {
      id: "sample-regional",
      title: "Regional office handbook",
      kind: "file",
      source: "upload",
      fileName: "regional-office-handbook.pdf",
      label: "Policy",
      status: "published",
      scope: {
        company: false,
        offices: [
          "sf",
          "ny",
          "aus",
          "lon",
          "bos",
          "chi",
          "sea",
          "la",
          "den",
          "atl",
          "mia",
          "dc",
          "tor",
          "van",
          "mtl",
          "mex",
          "sao",
          "bue",
          "dub",
          "par",
          "ber",
          "ams",
        ],
        groups: [],
        users: [],
      },
      content:
        "For an office access request, contact the local office coordinator. The coordinator verifies the employee's location and sends the current visitor and workspace guidance.",
      keywords: "office handbook workspace visitor access coordinator regional",
    },
    {
      id: "sample-support",
      title: "Priority incident escalation",
      kind: "import",
      source: "drive",
      fileName: "priority-incident-escalation.docx",
      label: "Support",
      status: "published",
      scope: { company: false, offices: [], groups: ["support"], users: [] },
      providerAllowed: ["priya", "samira"],
      content:
        "For an urgent customer incident, confirm the impact, open an incident record, and page the on-call lead. The lead owns a customer update every 30 minutes until the incident is stable.",
      keywords: "urgent customer incident support escalation on-call priority",
    },
    {
      id: "sample-renewal",
      title: "Renewal exception note",
      kind: "text",
      source: "upload",
      fileName: "",
      label: "Policy",
      status: "published",
      scope: { company: false, offices: [], groups: [], users: ["jordan"] },
      content:
        "A 30-day renewal extension is allowed when procurement is delayed. A longer extension requires finance review before a customer commitment.",
      keywords: "renewal extension exception procurement finance",
    },
  ];
  const state = {
    section: "documents",
    documents: [],
    connectors: [],
    demoLoaded: false,
    search: "",
    statusFilter: "published",
    sourceFilter: "all",
    labelFilter: "all",
    scopeFilter: "all",
    drawer: null,
    draft: null,
    scopeUi: { query: "", open: false, type: "offices" },
    accessUi: {
      listQuery: "",
      page: 0,
      personQuery: "",
      personId: null,
      personOpen: false,
    },
    error: "",
    viewer: "priya",
    question: "",
    answer: null,
    modal: null,
  };
  let toastTimer;
  let previousFocus;
  let accessPreviewTrigger;
  let suppressScopeOpenOnFocus = false;
  let scopeComposing = false;
  const PROCESSING_DELAY_MS = 1400;

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function esc(value) {
    return String(value == null ? "" : value).replace(
      /[&<>"']/g,
      function (char) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[char];
      },
    );
  }
  function searchText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
  function emptyScope() {
    return { company: false, offices: [], groups: [], users: [] };
  }
  function emptyAccessUi() {
    return {
      listQuery: "",
      page: 0,
      personQuery: "",
      personId: null,
      personOpen: false,
    };
  }
  function person(id) {
    return people.find(function (item) {
      return item.id === id;
    });
  }
  function documentById(id) {
    return state.documents.find(function (item) {
      return item.id === id;
    });
  }
  function providerById(id) {
    return (
      providers.find(function (item) {
        return item.id === id;
      }) ||
      (id === "webcrawler"
        ? { id: "webcrawler", name: "Webcrawler", logo: "⌕" }
        : undefined)
    );
  }
  function connectorById(id) {
    return state.connectors.find(function (item) {
      return item.id === id;
    });
  }
  function officeName(id) {
    const item = offices.find(function (entry) {
      return entry.id === id;
    });
    return item ? item.name : id;
  }
  function groupName(id) {
    const item = groups.find(function (entry) {
      return entry.id === id;
    });
    return item ? item.name : id;
  }
  function hasScope(scope) {
    return (
      !!scope.company ||
      !!(scope.offices.length || scope.groups.length || scope.users.length)
    );
  }
  function inScope(scope, viewer) {
    return (
      !!scope.company ||
      scope.offices.includes(viewer.office) ||
      scope.users.includes(viewer.id) ||
      scope.groups.some(function (id) {
        return viewer.groups.includes(id);
      })
    );
  }
  function canUse(doc, viewer) {
    return accessDecision(doc, viewer).allowed;
  }
  function audienceCount(scope) {
    return people.filter(function (viewer) {
      return inScope(scope, viewer);
    }).length;
  }
  function scopeLabel(scope) {
    if (scope.company) return "Entire company";
    const parts = [];
    if (scope.offices.length)
      parts.push(
        scope.offices.length === 1
          ? officeName(scope.offices[0]) + " office"
          : scope.offices.length + " offices",
      );
    if (scope.groups.length)
      parts.push(
        scope.groups.length === 1
          ? groupName(scope.groups[0])
          : scope.groups.length + " groups",
      );
    if (scope.users.length)
      parts.push(
        scope.users.length === 1
          ? person(scope.users[0]).name
          : scope.users.length + " users",
      );
    return parts.join(", ") || "No access selected";
  }
  function sourceName(doc) {
    return doc.source === "upload"
      ? "Uploaded"
      : (providerById(doc.source) || { name: doc.source }).name;
  }
  function statusName(status) {
    return (
      {
        published: "Published",
        uploaded: "Upload complete",
        processing: "Processing",
        failed: "Failed",
        paused: "Paused",
      }[status] || status
    );
  }
  function statusChip(status) {
    return (
      '<span class="status-chip ' +
      esc(status) +
      '">' +
      esc(statusName(status)) +
      "</span>"
    );
  }
  function scopeMatchReason(scope, viewer) {
    if (scope.company) return "Entire company, including future members";
    const matches = [];
    if (scope.offices.includes(viewer.office))
      matches.push(officeName(viewer.office) + " office");
    viewer.groups.forEach(function (id) {
      if (scope.groups.includes(id)) matches.push(groupName(id) + " calling group");
    });
    if (scope.users.includes(viewer.id))
      matches.push("Named person: " + viewer.name);
    return matches.length
      ? "Included through " + matches.join(" and ")
      : "This person is outside the selected audience";
  }
  function accessDecision(doc, viewer) {
    if (!doc || !viewer) return { allowed: false, checks: [] };
    const checks = [
      {
        label: "Document status",
        passed: doc.status === "published",
        detail:
          doc.status === "published"
            ? "Published and available in Test Copilot"
            : doc.status === "uploaded"
              ? "Upload complete; this prototype has not indexed the file"
              : statusName(doc.status) + " documents cannot answer in Copilot",
      },
      {
        label: "Searchable text in this prototype",
        passed: !!String(doc.content || "").trim(),
        detail: String(doc.content || "").trim()
          ? "Text is available for Test Copilot"
          : "This local prototype cannot extract PDF or DOCX text. Add test text to try an answer.",
      },
      {
        label: "Document audience",
        passed: inScope(doc.scope, viewer),
        detail: scopeMatchReason(doc.scope, viewer),
      },
    ];
    if (doc.source !== "upload") {
      const connector = connectorById(doc.source);
      checks.push({
        label: "Source audience",
        passed: !!connector && inScope(connector.scope, viewer),
        detail: connector
          ? scopeMatchReason(connector.scope, viewer)
          : "This source is not configured",
      });
      checks.push({
        label: "Provider permission",
        passed:
          Array.isArray(doc.providerAllowed) &&
          doc.providerAllowed.includes(viewer.id),
        detail:
          Array.isArray(doc.providerAllowed) &&
          doc.providerAllowed.includes(viewer.id)
            ? "The source provider grants this person access"
            : "The source provider does not grant this person access",
      });
    }
    return {
      allowed: checks.every(function (check) {
        return check.passed;
      }),
      checks: checks,
    };
  }
  function finishProcessing(id, attempt) {
    window.setTimeout(function () {
      const doc = documentById(id);
      if (!doc || doc.status !== "processing" || doc.attempt !== attempt) return;
      if (!doc.simulateFailure && String(doc.content || "").trim()) {
        doc.status = "published";
        doc.failureReason = "";
        showToast(doc.title + " is published for its selected audience.");
      } else if (doc.simulateFailure) {
        doc.status = "failed";
        doc.failureReason =
          "Simulated processing failure. Use Retry to review searchable text and try again.";
        showToast(doc.title + " shows the simulated processing failure.");
      } else {
        doc.status = "uploaded";
        showToast(doc.title + " was added. Add test text to demonstrate indexing.");
      }
      const editingThisDocument =
        state.drawer === "document" && state.draft && state.draft.id === id;
      if (editingThisDocument)
        state.draft.status = doc.status;
      renderSection();
      if (editingThisDocument) renderDrawer();
      if (state.modal && state.modal.type === "access" && state.modal.id === id)
        renderModal();
    }, PROCESSING_DELAY_MS);
  }
  function sourceLogo(provider) {
    return (
      '<span class="source-logo ' +
      esc(provider.id) +
      '" aria-hidden="true">' +
      esc(provider.logo) +
      "</span>"
    );
  }
  function showToast(message) {
    const node = document.getElementById("toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      node.classList.remove("show");
    }, 3500);
  }
  function optionList(items, selected, label) {
    return items
      .map(function (item) {
        return (
          '<option value="' +
          esc(item.id) +
          '"' +
          (selected === item.id ? " selected" : "") +
          ">" +
          esc(label(item)) +
          "</option>"
        );
      })
      .join("");
  }
  function orbitSvg() {
    return '<svg class="empty-orbit" viewBox="0 0 180 180" role="img" aria-label="Empty knowledge library illustration"><defs><linearGradient id="orbitGradient" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#7d37fc"/><stop offset=".5" stop-color="#fa3c8d"/><stop offset="1" stop-color="#ff703c"/></linearGradient></defs><circle cx="90" cy="90" r="67" fill="none" stroke="#aaa6ad" stroke-dasharray="1 3"/><circle cx="90" cy="90" r="7" fill="url(#orbitGradient)"/><circle cx="89" cy="23" r="4" fill="url(#orbitGradient)"/><circle cx="39" cy="132" r="4" fill="url(#orbitGradient)"/><circle cx="53" cy="73" r="3" fill="#29262b"/><circle cx="121" cy="75" r="4" fill="#29262b"/><circle cx="135" cy="39" r="5" fill="#29262b"/><path d="M81 63v20M71 73h20M74 66l14 14M88 66L74 80M122 128v22M111 139h22M114 131l16 16M130 131l-16 16" stroke="#29262b" stroke-width="1.3"/><path d="m75 154 10 10-10 10-10-10z" fill="#29262b"/><path d="m148 94 4 4-4 4-4-4z" fill="none" stroke="#77727b"/><circle cx="42" cy="96" r="2" fill="none" stroke="#8b8790"/></svg>';
  }
  function accessList(label, items, limit, className) {
    if (!items.length) return "";
    const visible = items.slice(0, limit);
    return (
      '<div class="access-group"><strong>' +
      esc(label) +
      " (" +
      items.length +
      ')</strong><ul class="access-list ' +
      esc(className || "") +
      '">' +
      visible
        .map(function (item) {
          return "<li>" + esc(item) + "</li>";
        })
        .join("") +
      "</ul>" +
      (items.length > visible.length
        ? '<p class="access-more">+' +
          (items.length - visible.length) +
          " more · Open Access details to search the full selection</p>"
        : "") +
      "</div>"
    );
  }
  function accessScopeDetails(scope, limit) {
    if (scope.company)
      return '<div class="access-group"><strong>Entire company</strong><p>Everyone in this company, including future members</p></div>';
    const officeItems = scope.offices.map(officeName);
    const groupItems = scope.groups.map(function (id) {
      const group = groups.find(function (item) {
        return item.id === id;
      });
      return group
        ? group.name + " · " + group.type + " · " + group.office
        : id;
    });
    const userItems = scope.users.map(function (id) {
      const user = person(id);
      return user
        ? user.name + " · " + (user.email || officeName(user.office))
        : id;
    });
    return (
      accessList("Offices", officeItems, limit, "offices") +
      accessList("Calling groups", groupItems, limit) +
      accessList("Individual users", userItems, limit)
    );
  }
  function accessDetailMarkup(doc, limit) {
    const effective = people.filter(function (viewer) {
      return canUse(doc, viewer);
    });
    const connector =
      doc.source === "upload" ? null : connectorById(doc.source);
    const providerGrants = (doc.providerAllowed || []).map(function (id) {
      const user = person(id);
      return user
        ? user.name + " · " + (user.email || officeName(user.office))
        : id;
    });
    return (
      '<div class="access-detail-section"><h4>Configured document audience</h4>' +
      accessScopeDetails(doc.scope, limit) +
      "</div>" +
      (connector
        ? '<div class="access-detail-section"><h4>Source audience ceiling</h4>' +
          accessScopeDetails(connector.scope, limit) +
          accessList("Provider grants", providerGrants, limit) +
          "</div>"
        : "") +
      '<div class="access-effective"><strong>Effective access now</strong><span>' +
      effective.length +
      " of " +
      people.length +
      " demo users can use this document now.</span>" +
      (doc.status === "published"
        ? ""
        : doc.status === "uploaded"
          ? "<small>The file was added, but this prototype has not indexed its text. Add test text before trying Copilot.</small>"
        : "<small>The document is " +
          esc(statusName(doc.status).toLowerCase()) +
          "; its configured audience cannot use it yet.</small>") +
      (connector
        ? "<small>Document scope, source scope, and provider grants must all allow a user.</small>"
        : "") +
      "</div>"
    );
  }
  function configuredAccessEntries(doc) {
    const entries = [];
    function addScope(scope, layer) {
      if (scope.company) {
        entries.push({ layer: layer, name: "Entire company", detail: "All current and future members" });
        return;
      }
      scope.offices.forEach(function (id) {
        entries.push({ layer: layer, name: officeName(id), detail: "Office" });
      });
      scope.groups.forEach(function (id) {
        const group = groups.find(function (item) { return item.id === id; });
        entries.push({
          layer: layer,
          name: group ? group.name : id,
          detail: group ? group.type + " · " + group.office : "Calling group",
        });
      });
      scope.users.forEach(function (id) {
        const user = person(id);
        entries.push({
          layer: layer,
          name: user ? user.name : id,
          detail: user ? user.email : "Individual user",
        });
      });
    }
    addScope(doc.scope, "Document audience");
    if (doc.source !== "upload") {
      const connector = connectorById(doc.source);
      if (connector) addScope(connector.scope, "Source audience");
      (doc.providerAllowed || []).forEach(function (id) {
        const user = person(id);
        entries.push({
          layer: "Provider grant",
          name: user ? user.name : id,
          detail: user ? user.email : "Individual user",
        });
      });
    }
    return entries;
  }
  function selectedAccessMarkup(doc) {
    const entries = configuredAccessEntries(doc);
    const query = searchText(state.accessUi.listQuery.trim());
    const matches = entries.filter(function (item) {
      return !query || searchText(item.layer + " " + item.name + " " + item.detail).includes(query);
    });
    const pageSize = 8;
    const pageCount = Math.max(1, Math.ceil(matches.length / pageSize));
    state.accessUi.page = Math.min(state.accessUi.page, pageCount - 1);
    const start = state.accessUi.page * pageSize;
    const visible = matches.slice(start, start + pageSize);
    const connector = doc.source === "upload" ? null : connectorById(doc.source);
    return (
      '<section class="access-modal-section"><h3>Configured access</h3><div class="access-layer-summary"><span><strong>Document</strong>' +
      esc(scopeLabel(doc.scope)) +
      "</span>" +
      (doc.source === "upload"
        ? ""
        : '<span><strong>Source ceiling</strong>' +
          esc(connector ? scopeLabel(connector.scope) : "Not configured") +
          '</span><span><strong>Provider grants</strong>' +
          (doc.providerAllowed || []).length +
          " people</span>") +
      '</div><label class="drawer-label" for="access-list-search">Search selected offices, groups, or people</label><input class="drawer-field" id="access-list-search" type="search" autocomplete="off" placeholder="Search selected access" value="' +
      esc(state.accessUi.listQuery) +
      '"><p class="access-results-count" tabindex="-1" aria-live="polite">' +
      (matches.length
        ? "Showing " + (start + 1) + "–" + (start + visible.length) + " of " + matches.length
        : "No matching selections") +
      '</p><ul class="access-selected-list">' +
      (visible.length
        ? visible
            .map(function (item) {
              return '<li><span class="access-selected-layer">' +
                esc(item.layer) +
                '</span><strong>' +
                esc(item.name) +
                '</strong><small>' +
                esc(item.detail) +
                "</small></li>";
            })
            .join("")
        : '<li class="access-empty-result">Try another name or audience type.</li>') +
      '</ul><div class="access-pagination"><button type="button" class="secondary-button" data-action="access-page-prev"' +
      (state.accessUi.page === 0 ? " disabled" : "") +
      '>Previous</button><span>Page ' +
      (state.accessUi.page + 1) +
      " of " +
      pageCount +
      '</span><button type="button" class="secondary-button" data-action="access-page-next"' +
      (state.accessUi.page >= pageCount - 1 ? " disabled" : "") +
      ">Next</button></div></section>"
    );
  }
  function personCheckMarkup(doc) {
    const ui = state.accessUi;
    const query = searchText(ui.personQuery.trim());
    const matches = query.length >= 2
      ? people.filter(function (item) {
          return searchText(item.name + " " + item.email).includes(query);
        })
      : [];
    const selected = ui.personId ? person(ui.personId) : null;
    const decision = selected ? accessDecision(doc, selected) : null;
    return (
      '<section class="access-modal-section access-person-section"><h3>Check a person’s access</h3><p>Search by name or email to see which rule allows or blocks this document.</p><label class="drawer-label" for="access-person-search">Person</label><input class="drawer-field" id="access-person-search" type="search" autocomplete="off" aria-controls="access-person-results" aria-expanded="' +
      (ui.personOpen && query.length >= 2) +
      '" placeholder="Search name or email" value="' +
      esc(ui.personQuery) +
      '"><div class="access-person-results" id="access-person-results"' +
      (ui.personOpen && query.length >= 2 ? "" : " hidden") +
      ">" +
      (matches.length
        ? matches.slice(0, 8).map(function (item) {
            return '<button type="button" data-action="select-access-person" data-id="' +
              esc(item.id) +
              '"><strong>' +
              esc(item.name) +
              '</strong><small>' +
              esc(item.email) +
              "</small></button>";
          }).join("") +
          (matches.length > 8
            ? '<div class="access-person-more">Keep typing to narrow ' + matches.length + ' matches.</div>'
            : "")
        : '<div class="access-person-more">No matching people. Try a name or email.</div>') +
      "</div>" +
      (decision
        ? '<div class="access-person-verdict ' +
          (decision.allowed ? "allowed" : "denied") +
          '" role="status" aria-live="polite"><strong>' +
          esc(selected.name) +
          (decision.allowed ? " can use this document" : " cannot use this document") +
          '</strong><button type="button" class="text-button" data-action="clear-access-person">Check another</button></div><ul class="access-checks">' +
          decision.checks.map(function (check) {
            return '<li class="' +
              (check.passed ? "passed" : "blocked") +
              '"><span aria-hidden="true">' +
              (check.passed ? "✓" : "×") +
              '</span><div><strong>' +
              esc(check.label) +
              '</strong><small>' +
              esc(check.detail) +
              "</small></div></li>";
          }).join("") +
          "</ul>"
        : '<p class="access-person-prompt">Enter at least 2 characters, then choose a person.</p>') +
      "</section>"
    );
  }

  function renderDocuments() {
    const query = state.search.trim().toLowerCase();
    const docs = state.documents.filter(function (doc) {
      return (
        (state.statusFilter === "all" || doc.status === state.statusFilter) &&
        (state.sourceFilter === "all" || doc.source === state.sourceFilter) &&
        (state.labelFilter === "all" || doc.label === state.labelFilter) &&
        (state.scopeFilter === "all" ||
          (state.scopeFilter === "company"
            ? doc.scope.company
            : !doc.scope.company)) &&
        (!query ||
          (doc.title + " " + sourceName(doc) + " " + scopeLabel(doc.scope))
            .toLowerCase()
            .includes(query))
      );
    });
    const labels = Array.from(
      new Set(
        state.documents
          .map(function (doc) {
            return doc.label;
          })
          .filter(Boolean),
      ),
    );
    const sources = [{ id: "upload", name: "Uploaded" }].concat(
      providers.filter(function (item) {
        return state.documents.some(function (doc) {
          return doc.source === item.id;
        });
      }),
    );
    let body;
    if (!state.documents.length) {
      body =
        '<div class="empty-state">' +
        orbitSvg() +
        '<h3>No documents</h3><p><button type="button" data-action="configure-sources">Connect a content source</button> or <button type="button" data-action="upload">upload documents</button></p><div class="sample-link">Want to test access controls? <button type="button" data-action="load-samples">Load example documents</button></div></div>';
    } else if (!docs.length) {
      body =
        '<div class="empty-state">' +
        orbitSvg() +
        '<h3>No matching documents</h3><p>Try another search or filter.</p><div class="sample-link"><button type="button" data-action="clear-filters">Clear filters</button></div></div>';
    } else {
      body =
        '<div class="document-table-wrap"><table class="document-table"><thead><tr><th scope="col">Document</th><th scope="col">Source</th><th scope="col">Access</th><th scope="col">Status</th></tr></thead><tbody>' +
        docs
          .map(function (doc) {
            return (
              '<tr><td><div class="document-name"><span class="doc-icon ' +
              (doc.kind === "import" ? "imported" : "") +
              '">▤</span><div><button type="button" class="doc-name-button" data-action="edit-document" data-id="' +
              esc(doc.id) +
              '">' +
              esc(doc.title) +
              '</button><span class="doc-name-meta">' +
              esc(doc.fileName || "Text context") +
              "</span></div></div></td><td>" +
              esc(sourceName(doc)) +
              '</td><td class="scope-cell"><button type="button" class="access-trigger" data-action="access-details" data-id="' +
              esc(doc.id) +
              '" aria-label="View access details for ' +
              esc(doc.title) +
              '"><span>' +
              esc(scopeLabel(doc.scope)) +
              '</span><span class="access-info" aria-hidden="true">ⓘ</span></button><small>' +
              (doc.status === "uploaded"
                ? "Selected audience: " +
                  audienceCount(doc.scope) +
                  " of " +
                  people.length +
                  " demo people · Add test text to try Copilot"
                : "Demo preview: " +
                  people.filter(function (viewer) {
                    return canUse(doc, viewer);
                  }).length +
                  " of " +
                  people.length +
                  " people can use it" +
                  (doc.source === "upload" ? "" : " · Source rules also apply")) +
              "</small>" +
              "</td><td>" +
              statusChip(doc.status) +
              (doc.status === "failed"
                ? '<small class="status-reason">Processing failed in this demo</small><button type="button" class="status-retry" data-action="retry-document" data-id="' +
                  esc(doc.id) +
                  '">Retry</button>'
                : doc.status === "uploaded"
                  ? '<small class="status-reason">File text is not searchable in this prototype</small><button type="button" class="status-retry" data-action="retry-document" data-id="' +
                    esc(doc.id) +
                    '">Add test text</button>'
                  : "") +
              "</td></tr>"
            );
          })
          .join("") +
        '</tbody></table><div class="document-foot">' +
        docs.length +
        " document" +
        (docs.length === 1 ? "" : "s") +
        " shown · Select a document to review or change access" +
        (state.demoLoaded
          ? ""
          : ' · <button type="button" class="text-button" data-action="load-samples">Load example documents</button>') +
        "</div></div>";
    }
    return (
      '<div class="section-heading-row"><div><h2>Documents</h2><p>Your imported documents and uploaded context appear on this page.</p></div><div class="section-actions"><button type="button" class="add-document-button" data-action="upload"><span aria-hidden="true">＋</span>Add document</button><button type="button" class="configure-sources-button" data-action="configure-sources"><span aria-hidden="true">⚙</span>Configure sources</button></div></div><div class="filters"><label class="search-control"><span aria-hidden="true">⌕</span><input id="document-search" data-input="search" aria-label="Search documents" placeholder="Search documents" value="' +
      esc(state.search) +
      '"></label><select class="filter-select status-filter" data-filter="statusFilter" aria-label="Filter by status"><option value="published"' +
      (state.statusFilter === "published" ? " selected" : "") +
      '>Published</option><option value="all"' +
      (state.statusFilter === "all" ? " selected" : "") +
      '>All statuses</option><option value="uploaded"' +
      (state.statusFilter === "uploaded" ? " selected" : "") +
      '>Upload complete</option><option value="processing"' +
      (state.statusFilter === "processing" ? " selected" : "") +
      '>Processing</option><option value="failed"' +
      (state.statusFilter === "failed" ? " selected" : "") +
      '>Failed</option><option value="paused"' +
      (state.statusFilter === "paused" ? " selected" : "") +
      '>Paused</option></select><select class="filter-select" data-filter="sourceFilter" aria-label="Filter by source"><option value="all">All sources</option>' +
      optionList(sources, state.sourceFilter, function (item) {
        return item.name;
      }) +
      '</select><select class="filter-select" data-filter="labelFilter" aria-label="Filter by label"><option value="all">All labels</option>' +
      labels
        .map(function (label) {
          return (
            '<option value="' +
            esc(label) +
            '"' +
            (state.labelFilter === label ? " selected" : "") +
            ">" +
            esc(label) +
            "</option>"
          );
        })
        .join("") +
      '</select><select class="filter-select" data-filter="scopeFilter" aria-label="Filter by access scope"><option value="all">All scopes</option><option value="company"' +
      (state.scopeFilter === "company" ? " selected" : "") +
      '>Entire company</option><option value="targeted"' +
      (state.scopeFilter === "targeted" ? " selected" : "") +
      ">Targeted</option></select></div>" +
      body
    );
  }
  function renderPlaceholder(section) {
    if (section === "analytics")
      return '<div class="placeholder-page"><h2>Analytics</h2><p>Review how Copilot uses approved company knowledge.</p><div class="placeholder-panel"><strong>Analytics is the next part of this concept</strong><span>Document questions, unanswered questions, and source health can live here. No usage data is collected by this local prototype.</span></div></div>';
    return '<div class="placeholder-page"><h2>MCPs</h2><p>Configure approved tools for the one Dialpad Copilot.</p><div class="placeholder-panel"><strong>MCP configuration is planned for a later prototype</strong><span>MCP tools are separate from the document content sources configured in Documents.</span></div></div>';
  }
  function renderSection() {
    hideAccessPreview();
    document.querySelectorAll("[data-section]").forEach(function (button) {
      const active = button.dataset.section === state.section;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    document.getElementById("section-content").innerHTML =
      state.section === "documents"
        ? renderDocuments()
        : renderPlaceholder(state.section);
  }

  function scopeCandidates() {
    return offices
      .map(function (item) {
        return {
          kind: "offices",
          id: item.id,
          name: item.name,
          detail: "Office · Everyone in this office",
          chipDetail: "Office",
        };
      })
      .concat(
        groups.map(function (item) {
          return {
            kind: "groups",
            id: item.id,
            name: item.name,
            detail: item.type + " · " + item.office,
            chipDetail: item.type + " · " + item.office,
          };
        }),
        people.map(function (item) {
          return {
            kind: "users",
            id: item.id,
            name: item.name,
            detail:
              "Person · " +
              (item.email ? item.email + " · " : "") +
              officeName(item.office),
            chipDetail: item.email || "Person · " + officeName(item.office),
          };
        }),
      );
  }
  function scopeSelectedItems(scope) {
    return scopeCandidates().filter(function (item) {
      return scope[item.kind].includes(item.id);
    });
  }
  function preferredScopeType(scope) {
    if (scope.groups.length) return "groups";
    if (scope.users.length) return "users";
    return "offices";
  }
  function scopePicker(scope) {
    const type = state.scopeUi.type;
    const query = searchText(state.scopeUi.query.trim());
    const matches = scopeCandidates().filter(function (item) {
      return (
        item.kind === type &&
        (!query || searchText(item.name + " " + item.detail).includes(query))
      );
    });
    const visible = matches.slice(0, 8);
    const selected = scopeSelectedItems(scope);
    const results = visible.length
      ? visible
          .map(function (item) {
            const checked = scope[item.kind].includes(item.id);
            return (
              '<button type="button" class="scope-result" aria-pressed="' +
              checked +
              '" data-action="toggle-scope-result" data-kind="' +
              item.kind +
              '" data-id="' +
              esc(item.id) +
              '"><span class="scope-result-check" aria-hidden="true">' +
              (checked ? "✓" : "") +
              "</span><span><strong>" +
              esc(item.name) +
              "</strong><small>" +
              esc(item.detail) +
              "</small></span></button>"
            );
          })
          .join("")
      : '<div class="scope-no-results">' +
        (type === "groups"
          ? "No matching calling groups. Try a department or contact center name."
          : type === "users"
            ? "No matching users. Try a name or email."
            : "No matching offices. Try another office name.") +
        "</div>";
    const chips = scope.company
      ? '<span class="scope-chip company">Entire company <button type="button" data-action="clear-company-scope" aria-label="Remove entire company access">×</button></span>'
      : selected.length
        ? selected
            .slice(0, 6)
            .map(function (item) {
              return (
                '<span class="scope-chip">' +
                esc(item.name) +
                ' <span class="scope-chip-detail">· ' +
                esc(item.chipDetail) +
                "</span>" +
                '<button type="button" data-action="remove-scope-item" data-kind="' +
                item.kind +
                '" data-id="' +
                esc(item.id) +
                '" aria-label="Remove ' +
                esc(item.name + ", " + item.detail) +
                '">×</button></span>'
              );
            })
            .join("") +
          (selected.length > 6
            ? '<span class="scope-chip-more">+' +
              (selected.length - 6) +
              " more selected · Search to review or remove</span>"
            : "")
        : '<span class="scope-empty-selection">No audience selected · Required to continue</span>';
    const audienceTypes = [
      { id: "offices", label: "Offices" },
      { id: "groups", label: "Calling groups" },
      { id: "users", label: "Individual users" },
    ];
    const placeholders = {
      offices: "Search offices",
      groups: "Search departments or contact centers",
      users: "Search individual users",
    };
    return (
      '<div class="scope-picker" id="scope-picker"><div class="drawer-section-title">Who can access this in Copilot?</div><p class="drawer-help">Required. Choose offices, calling groups, and/or individual users. Selections from all three are combined.</p>' +
      '<div class="scope-type-buttons" role="group" aria-label="Audience type">' +
      audienceTypes
        .map(function (item) {
          return (
            '<button type="button" class="scope-type-button' +
            (type === item.id ? " active" : "") +
            '" data-action="scope-type" data-type="' +
            item.id +
            '"' +
            (scope.company ? " disabled" : "") +
            ' aria-pressed="' +
            (type === item.id) +
            '">' +
            item.label +
            (scope[item.id].length
              ? '<span class="scope-type-count">' +
                scope[item.id].length +
                "</span>"
              : "") +
            "</button>"
          );
        })
        .join("") +
      '</div><p class="scope-type-hint">' +
      (type === "groups"
        ? "Calling groups include Departments and Contact Centers."
        : type === "users"
          ? "Choose named users even if they are outside the selected offices or groups."
          : "An office selection includes everyone in that office.") +
      '</p><div class="scope-control-row"><div class="scope-search-wrap"><span class="scope-search-icon" aria-hidden="true">⌕</span><input id="scope-search" type="search" aria-label="' +
      esc(placeholders[type]) +
      '" aria-controls="scope-results" aria-expanded="' +
      state.scopeUi.open +
      '"' +
      (scope.company ? " disabled" : "") +
      ' placeholder="' +
      esc(placeholders[type]) +
      '" autocomplete="off" value="' +
      esc(state.scopeUi.query) +
      '"><div class="scope-results" id="scope-results" aria-label="Matching audiences"' +
      (state.scopeUi.open && !scope.company ? "" : " hidden") +
      '><div class="scope-results-meta">' +
      (query ? matches.length + " matches" : "Suggestions") +
      " · Showing up to 8</div>" +
      results +
      (matches.length > 8
        ? '<div class="scope-results-more">Keep typing to narrow the results.</div>'
        : "") +
      '</div></div><button type="button" class="scope-all-button' +
      (scope.company ? " active" : "") +
      '" id="scope-all" data-action="select-all-scope" aria-pressed="' +
      scope.company +
      '" aria-label="' +
      (scope.company
        ? "Restore your selected audiences"
        : "Give access to the entire company") +
      '">Entire company</button></div><p class="scope-all-hint">Includes everyone now and future company members. Source provider permissions still apply.</p>' +
      '<div class="scope-selected-heading">Selected access' +
      (scope.company ? "" : selected.length ? " · " + selected.length : "") +
      '</div><div class="scope-chips" aria-live="polite">' +
      chips +
      '</div><div class="scope-summary">' +
      (scope.company
        ? "Entire company is selected. Turn it off to restore your earlier selections."
        : selected.length
          ? "Preview: " +
            audienceCount(scope) +
            " of " +
            people.length +
            " demo users match these selections."
          : "Select at least one audience before saving.") +
      "</div></div>"
    );
  }

  function drawerShell(title, body, footer, wide) {
    return (
      '<div class="drawer-frame"><div class="drawer-scrim" data-action="close-drawer"></div><section class="drawer ' +
      (wide ? "wide" : "") +
      '" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><div class="drawer-header"><h2 id="drawer-title" tabindex="-1">' +
      esc(title) +
      '</h2><button type="button" class="drawer-close" data-action="close-drawer" aria-label="Close drawer">×</button></div><div class="drawer-body">' +
      body +
      "</div>" +
      (footer ? '<div class="drawer-footer">' + footer + "</div>" : "") +
      "</section></div>"
    );
  }
  function errorMessage() {
    return state.error
      ? '<div class="inline-error" role="alert">' + esc(state.error) + "</div>"
      : "";
  }
  function renderUploadDrawer() {
    const draft = state.draft;
    let upload;
    if (draft.mode === "file") {
      upload =
        '<p class="drawer-intro">This knowledge base is in <strong>English US</strong>. Documents in other languages may affect search results.</p><label class="upload-box" id="upload-box"><input id="document-file-input" type="file" accept=".pdf,.docx" multiple aria-label="Choose PDF or DOCX documents"><span><span class="upload-cloud" aria-hidden="true">⇧</span><strong>Click to upload</strong> documents<small>DOCX, PDF (max 20 MB each)</small></span></label>' +
        draft.files
          .map(function (file, index) {
            return (
              '<div class="uploaded-file"><span>▤ ' +
              esc(file.name) +
              '</span><button type="button" data-action="remove-upload-file" data-index="' +
              index +
              '" aria-label="Remove ' +
              esc(file.name) +
              '">×</button></div><details class="demo-text-details"' +
              (draft.demoTexts[index] ? " open" : "") +
              '><summary>Optional: add text to use this file in Test Copilot</summary><label for="demo-text-' +
              index +
              '">Paste text from ' +
              esc(file.name) +
              '</label><textarea id="demo-text-' +
              index +
              '" data-demo-text-index="' +
              index +
              '" placeholder="Paste an excerpt from this document">' +
              esc(draft.demoTexts[index] || "") +
              '</textarea></details>'
            );
          })
          .join("") +
        (draft.files.length
          ? '<p class="upload-demo-note">Files without test text show Upload complete. This page cannot read PDF or DOCX content, so add text above to demonstrate Processing → Published and test an answer.</p><details class="demo-text-details"><summary>Preview a processing error</summary><label class="demo-error-toggle"><input id="simulate-upload-failure" type="checkbox"' +
            (draft.simulateFailure ? " checked" : "") +
            '> Simulate failed indexing for this upload</label></details>'
          : "") +
        '<button type="button" class="drawer-link" data-action="switch-upload-mode" data-mode="text">Add text context instead</button>';
    } else {
      upload =
        '<p class="drawer-intro muted">Paste a short note that Copilot can use as company context.</p><div class="drawer-field-row"><label class="drawer-label" for="text-title">Name</label><input class="drawer-field" id="text-title" data-draft="title" value="' +
        esc(draft.title) +
        '" placeholder="e.g. Renewal guidance"></div><div class="drawer-field-row"><label class="drawer-label" for="context-text">Context</label><textarea class="drawer-field" id="context-text" data-draft="text" placeholder="Enter approved context">' +
        esc(draft.text) +
        '</textarea></div><button type="button" class="drawer-link" data-action="switch-upload-mode" data-mode="file">Upload documents instead</button>';
    }
    const body =
      upload +
      '<hr class="drawer-divider"><div class="drawer-field-row"><label class="drawer-label" for="upload-label">Label</label><select class="drawer-field" id="upload-label" data-draft-select="label"><option value="Other"' +
      (draft.label === "Other" ? " selected" : "") +
      '>Other</option><option value="Product"' +
      (draft.label === "Product" ? " selected" : "") +
      '>Product</option><option value="Policy"' +
      (draft.label === "Policy" ? " selected" : "") +
      '>Policy</option><option value="Support"' +
      (draft.label === "Support" ? " selected" : "") +
      ">Support</option></select></div>" +
      scopePicker(draft.scope) +
      '<div class="scope-readonly">This scope applies to every file in this upload. This local demo keeps each filename, scope, and optional pasted text until refresh. It does not read or send the file.</div>' +
      errorMessage();
    const footer =
      '<button type="button" class="secondary-button" data-action="close-drawer">Cancel</button><button type="button" class="primary-button" data-action="save-upload">' +
      (draft.mode === "file" ? "Add documents" : "Add context") +
      "</button>";
    return drawerShell("Upload documents", body, footer, false);
  }
  function renderSourceListDrawer() {
    const rows = providers
      .map(function (provider) {
        const config = connectorById(provider.id);
        return (
          '<div class="source-item">' +
          sourceLogo(provider) +
          '<div class="source-name"><strong>' +
          esc(provider.name) +
          (provider.new
            ? ' <span style="background:#c9dfff;font-size:10px;padding:2px 5px;border-radius:3px">New</span>'
            : "") +
          "</strong><small>" +
          (config ? "Configured for this demo · No sync" : "Not connected") +
          '</small></div><button type="button" data-action="configure-provider" data-provider="' +
          esc(provider.id) +
          '">' +
          (config ? "Edit access" : "Connect") +
          "</button></div>"
        );
      })
      .join("");
    const body =
      '<h3 class="drawer-section-title">External sources</h3><p class="drawer-intro muted">Connect an external content source to import approved documents.</p>' +
      rows +
      '<div class="source-note"><strong>Webcrawler</strong>Set up a webcrawler to import an online help center. Imported content would still need an access scope in Copilot.</div><button type="button" class="secondary-button" data-action="configure-provider" data-provider="webcrawler" style="margin-top:12px">Connect content source</button><div class="scope-readonly">These actions configure a local concept only. No external account is authorized or synchronized.</div>';
    return drawerShell("Configure sources", body, "", true);
  }
  function renderConnectorDrawer() {
    const draft = state.draft;
    const provider = providerById(draft.providerId) || { name: "Webcrawler" };
    const body =
      '<p class="drawer-intro">Choose the broadest Dialpad audience that may use documents from <strong>' +
      esc(provider.name) +
      '</strong>.</p><div class="scope-readonly">A real connection would also keep the source provider’s own permissions. Copilot can use a document only when both the provider and this Dialpad audience allow it.</div>' +
      scopePicker(draft.scope) +
      errorMessage() +
      (draft.existing
        ? '<div class="danger-row"><span>Remove this demo setup</span><button type="button" data-action="remove-connector">Remove</button></div>'
        : "");
    const footer =
      '<button type="button" class="secondary-button" data-action="configure-sources">Back</button><button type="button" class="primary-button" data-action="save-connector">Save demo setup</button>';
    return drawerShell(
      (draft.existing ? "Edit " : "Set up ") + provider.name + " · Demo",
      body,
      footer,
      true,
    );
  }
  function renderDocumentDrawer() {
    const draft = state.draft;
    const doc = documentById(draft.id);
    const changedDoc = copy(doc);
    changedDoc.scope = draft.scope;
    changedDoc.status = draft.status;
    const imported = doc.source !== "upload";
    const statusHelp =
      doc.status === "processing"
        ? '<div class="scope-readonly">Processing this file for the local demo. Copilot cannot use it until it is published.</div>'
        : doc.status === "failed"
          ? '<div class="scope-readonly"><strong>Processing failed.</strong> ' +
            esc(doc.failureReason || "The file could not be prepared.") +
            ' Save any access changes, then choose Retry from the document list.</div>'
          : doc.status === "uploaded"
            ? '<div class="scope-readonly"><strong>Upload complete in this prototype.</strong> PDF and DOCX text was not extracted, so Test Copilot cannot answer from this file yet. Save any access changes, then choose Add test text from the document list.</div>'
          : "";
    const body =
      '<p class="drawer-intro muted">' +
      esc(doc.fileName || "Text context") +
      " · " +
      esc(sourceName(doc)) +
      " · " +
      statusName(draft.status) +
      "</p>" +
      statusHelp +
      '<hr class="drawer-divider">' +
      scopePicker(draft.scope) +
      (imported
        ? '<div class="scope-readonly">Effective access is the intersection of this document scope, the content source audience, and source-provider permissions.</div>'
        : "") +
      personCheckMarkup(changedDoc) +
      errorMessage() +
      '<div class="danger-row"><span>' +
      (draft.status === "paused"
        ? "Restore this document"
        : "Pause this document") +
      '</span><button type="button" data-action="toggle-document-status"' +
      (["processing", "failed", "uploaded"].includes(draft.status) ? " disabled" : "") +
      ">" +
      (draft.status === "paused" ? "Resume" : "Pause") +
      '</button></div><div class="danger-row"><span>Remove from Copilot</span><button type="button" data-action="remove-document">Remove</button></div>';
    const footer =
      '<button type="button" class="secondary-button" data-action="close-drawer">Cancel</button><button type="button" class="primary-button" data-action="save-document">Save changes</button>';
    return drawerShell(doc.title, body, footer, true);
  }
  function renderRetryDrawer() {
    const doc = documentById(state.draft.id);
    if (!doc) return "";
    const retrying = doc.status === "failed";
    const body =
      '<p class="drawer-intro">This local prototype cannot read PDF or DOCX bytes. Paste text from <strong>' +
      esc(doc.fileName) +
      '</strong> to make it searchable in Test Copilot. Copilot will use only the text you paste here.</p><div class="drawer-field-row"><label class="drawer-label" for="retry-text">Searchable document text</label><textarea class="drawer-field retry-text" id="retry-text" data-draft="text" placeholder="Paste text from the document">' +
      esc(state.draft.text) +
      '</textarea></div>' +
      errorMessage();
    const footer =
      '<button type="button" class="secondary-button" data-action="close-drawer">Cancel</button><button type="button" class="primary-button" data-action="save-retry">' +
      (retrying ? "Retry processing" : "Add test text") +
      "</button>";
    return drawerShell((retrying ? "Retry " : "Add text to ") + doc.title, body, footer, false);
  }
  function renderTestDrawer() {
    const viewer = person(state.viewer);
    const prompts = [
      "How do I handle an urgent customer incident?",
      "What discount needs manager approval?",
      "What is included in the Advanced plan?",
    ];
    let answer = "";
    if (state.answer) {
      const source = documentById(state.answer.sourceId);
      const current = !state.answer.sourceId || canUse(source, viewer);
      answer =
        '<div class="test-answer"><div class="user-query">' +
        esc(state.answer.question) +
        '</div><p class="answer-text">' +
        (current
          ? esc(state.answer.text)
          : "This answer is no longer available because source access changed. Ask again for a current answer.") +
        "</p>" +
        (current && source
          ? '<button type="button" class="citation-button" data-action="open-citation" data-id="' +
            esc(source.id) +
            '">Source: ' +
            esc(source.title) +
            " · Open source</button>"
          : "") +
        "</div>";
    }
    const body =
      '<p class="drawer-intro muted">Ask the single Copilot about company knowledge as a demo user. This test uses example content or text pasted into the prototype; uploaded PDF and DOCX bytes are not read.</p><div class="drawer-field-row"><label class="drawer-label" for="test-viewer">Ask as</label><select class="drawer-field" id="test-viewer" data-viewer="true">' +
      optionList(people, state.viewer, function (item) {
        return item.name;
      }) +
      '</select></div><label class="drawer-label" for="test-question">Question</label><textarea class="test-question" id="test-question" placeholder="Ask about company knowledge">' +
      esc(state.question) +
      '</textarea><div class="prompt-list">' +
      prompts
        .map(function (question) {
          return (
            '<button type="button" data-action="ask-prompt" data-question="' +
            esc(question) +
            '">' +
            esc(question) +
            "</button>"
          );
        })
        .join("") +
      '</div><button type="button" class="primary-button" data-action="ask-copilot">Ask Copilot</button>' +
      answer +
      (!state.documents.some(function (doc) {
        return doc.status === "published" && !!String(doc.content || "").trim();
      }) && !state.demoLoaded
        ? '<div class="scope-readonly">There is no searchable text yet. Add test text to an uploaded file, or <button type="button" class="text-button" data-action="load-samples">load example documents</button> to try the access controls.</div>'
        : "");
    return drawerShell("Test Copilot", body, "", true);
  }
  function renderDrawer() {
    const root = document.getElementById("drawer-root");
    if (!state.drawer) {
      root.innerHTML = "";
      return;
    }
    root.innerHTML =
      state.drawer === "upload"
        ? renderUploadDrawer()
        : state.drawer === "sources"
          ? renderSourceListDrawer()
          : state.drawer === "connector"
            ? renderConnectorDrawer()
          : state.drawer === "document"
              ? renderDocumentDrawer()
              : state.drawer === "retry"
                ? renderRetryDrawer()
                : renderTestDrawer();
  }
  function refreshScopePicker(focusSelector, selection) {
    const body = document.querySelector(".drawer-body");
    const scrollTop = body ? body.scrollTop : 0;
    renderDrawer();
    const nextBody = document.querySelector(".drawer-body");
    if (nextBody) nextBody.scrollTop = scrollTop;
    if (focusSelector) {
      const target = document.querySelector(focusSelector);
      if (target) {
        suppressScopeOpenOnFocus = target.id === "scope-search";
        target.focus();
        if (target.id === "scope-search") {
          const start = selection ? selection.start : target.value.length;
          const end = selection ? selection.end : target.value.length;
          target.setSelectionRange(start, end);
        }
        suppressScopeOpenOnFocus = false;
      }
    }
  }
  function refreshAccessUi(focusSelector, selection) {
    const inModal = !!(state.modal && state.modal.type === "access");
    const scrollable = document.querySelector(inModal ? ".access-modal" : ".drawer-body");
    const scrollTop = scrollable ? scrollable.scrollTop : 0;
    if (inModal) renderModal();
    else renderDrawer();
    const nextScrollable = document.querySelector(inModal ? ".access-modal" : ".drawer-body");
    if (nextScrollable) nextScrollable.scrollTop = scrollTop;
    if (focusSelector) {
      const target = document.querySelector(focusSelector);
      if (target) {
        target.focus();
        if (selection && target.setSelectionRange) {
          const start = selection.start == null ? target.value.length : selection.start;
          const end = selection.end == null ? target.value.length : selection.end;
          target.setSelectionRange(start, end);
        }
      }
    }
  }
  function closeScopeResults() {
    if (!state.scopeUi.open) return;
    state.scopeUi.open = false;
    const input = document.getElementById("scope-search");
    const results = document.getElementById("scope-results");
    if (input && input.setAttribute)
      input.setAttribute("aria-expanded", "false");
    if (results) results.hidden = true;
  }
  function hideAccessPreview() {
    if (accessPreviewTrigger && accessPreviewTrigger.removeAttribute)
      accessPreviewTrigger.removeAttribute("aria-describedby");
    accessPreviewTrigger = null;
    const root = document.getElementById("access-preview-root");
    if (root) root.innerHTML = "";
  }
  function showAccessPreview(trigger) {
    if (!trigger || state.drawer || state.modal) return;
    const doc = documentById(trigger.dataset.id);
    if (!doc) return;
    hideAccessPreview();
    const root = document.getElementById("access-preview-root");
    root.innerHTML =
      '<div class="access-preview" id="access-preview" role="tooltip"><strong class="access-preview-title">' +
      esc(doc.title) +
      '</strong><p class="access-preview-intro">Select Access to search the full selection</p>' +
      accessDetailMarkup(doc, 8) +
      "</div>";
    accessPreviewTrigger = trigger;
    trigger.setAttribute("aria-describedby", "access-preview");
    const panel = document.getElementById("access-preview");
    const anchor = trigger.getBoundingClientRect();
    const bounds = panel.getBoundingClientRect();
    const left = Math.min(
      Math.max(12, anchor.left),
      Math.max(12, window.innerWidth - bounds.width - 12),
    );
    const below = window.innerHeight - anchor.bottom - 10;
    const preferredTop =
      below >= bounds.height
        ? anchor.bottom + 8
        : anchor.top - bounds.height - 8;
    const top = Math.max(
      12,
      Math.min(preferredTop, window.innerHeight - bounds.height - 12),
    );
    panel.style.left = left + "px";
    panel.style.top = top + "px";
  }
  function renderModal() {
    const root = document.getElementById("modal-root");
    if (!state.modal) {
      root.innerHTML = "";
      return;
    }
    if (state.modal.type === "access") {
      const doc = documentById(state.modal.id);
      if (!doc) {
        state.modal = null;
        root.innerHTML = "";
        return;
      }
      root.innerHTML =
        '<div class="modal-scrim"><section class="modal access-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title" tabindex="-1">Access to ' +
        esc(doc.title) +
        "</h2><p>Review selected audiences and check access for a specific person.</p><div class=\"access-modal-current\"><strong>Current status</strong>" +
        statusChip(doc.status) +
        "</div>" +
        selectedAccessMarkup(doc) +
        personCheckMarkup(doc) +
        '<div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Close</button><button type="button" class="primary-button" data-action="edit-access-document" data-id="' +
        esc(doc.id) +
        '">Edit access</button></div></section></div>';
      return;
    }
    if (state.modal.type === "citation") {
      const doc = documentById(state.modal.id);
      const allowed = canUse(doc, person(state.viewer));
      root.innerHTML =
        '<div class="modal-scrim"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">' +
        (allowed ? esc(doc.title) : "Source unavailable") +
        "</h2><p>" +
        (allowed
          ? "Access checked again for " + esc(person(state.viewer).name) + "."
          : "This document is no longer available to this user. Ask Copilot again for a current answer.") +
        "</p>" +
        (allowed
          ? '<div class="excerpt">' + esc(doc.content.slice(0, 550)) + "</div>"
          : "") +
        '<div class="modal-actions"><button type="button" class="primary-button" data-action="close-modal">Close</button></div></section></div>';
      return;
    }
    if (state.modal.type === "confirm-company-scope") {
      const before = state.draft ? scopeLabel(state.draft.scope) : "No access selected";
      root.innerHTML =
        '<div class="modal-scrim"><section class="modal" role="alertdialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title" tabindex="-1">Give access to the entire company?</h2><p>This changes the selected audience from <strong>' +
        esc(before) +
        '</strong> to everyone in the company, including future members.</p>' +
        (state.drawer === "connector"
          ? '<p>Source provider permissions will still limit imported documents.</p>'
          : "") +
        '<div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Keep selected audience</button><button type="button" class="primary-button" data-action="confirm-company-scope">Use entire company</button></div></section></div>';
      return;
    }
    const item =
      state.modal.type === "remove-document"
        ? documentById(state.modal.id)
        : providerById(state.modal.id);
    root.innerHTML =
      '<div class="modal-scrim"><section class="modal" role="alertdialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">Remove ' +
      (state.modal.type === "remove-document" ? "document" : "source setup") +
      "?</h2><p>“" +
      esc(item ? item.title || item.name : "This item") +
      "” will be removed from this browser session." +
      (state.modal.type === "remove-connector"
        ? " Imported demo documents from this source will also be removed."
        : "") +
      '</p><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button><button type="button" class="secondary-button" data-action="confirm-remove">Remove</button></div></section></div>';
  }
  function render() {
    renderSection();
    renderDrawer();
    renderModal();
  }
  function openDrawer(type, detail) {
    hideAccessPreview();
    if (!state.drawer) previousFocus = document.activeElement;
    state.drawer = type;
    state.error = "";
    state.scopeUi = { query: "", open: false, type: "offices" };
    state.accessUi = emptyAccessUi();
    if (type === "upload")
      state.draft = {
        mode: "file",
        files: [],
        demoTexts: [],
        simulateFailure: false,
        title: "",
        text: "",
        label: "Other",
        scope: emptyScope(),
      };
    if (type === "connector") {
      const existing = connectorById(detail);
      state.draft = {
        providerId: detail,
        existing: !!existing,
        scope: existing ? copy(existing.scope) : emptyScope(),
      };
    }
    if (type === "document") {
      const doc = documentById(detail);
      if (!doc) return;
      state.draft = { id: doc.id, status: doc.status, scope: copy(doc.scope) };
    }
    if (type === "retry") {
      const doc = documentById(detail);
      if (!doc || (doc.status !== "failed" && doc.status !== "uploaded"))
        return;
      state.draft = { id: doc.id, text: doc.content || "" };
    }
    if (state.draft && state.draft.scope)
      state.scopeUi.type = preferredScopeType(state.draft.scope);
    if (state.draft && state.draft.scope)
      state.draft.targetedBackup = state.draft.scope.company
        ? emptyScope()
        : copy(state.draft.scope);
    renderDrawer();
    const title = document.getElementById("drawer-title");
    if (title) title.focus();
  }
  function closeDrawer() {
    state.drawer = null;
    state.draft = null;
    state.scopeUi = { query: "", open: false, type: "offices" };
    state.error = "";
    renderDrawer();
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }
  function loadSamples() {
    if (state.demoLoaded) {
      showToast("Example documents are already loaded.");
      return;
    }
    state.documents = state.documents.concat(copy(sampleDocuments));
    if (!connectorById("drive"))
      state.connectors.push({
        id: "drive",
        scope: {
          company: false,
          offices: ["aus"],
          groups: ["support"],
          users: [],
        },
      });
    state.demoLoaded = true;
    state.statusFilter = "all";
    state.section = "documents";
    render();
    showToast("Example documents loaded for this browser session.");
  }
  function clearFilters() {
    state.search = "";
    state.statusFilter = "all";
    state.sourceFilter = "all";
    state.labelFilter = "all";
    state.scopeFilter = "all";
    renderSection();
  }
  function ask(question) {
    const q = (question || "").trim();
    if (!q) {
      showToast("Enter a question first.");
      return;
    }
    const viewer = person(state.viewer);
    const tokens = q.toLowerCase().match(/[a-z0-9]+/g) || [];
    const ranked = state.documents
      .filter(function (doc) {
        return canUse(doc, viewer);
      })
      .map(function (doc) {
        const text = (
          doc.title +
          " " +
          doc.keywords +
          " " +
          doc.content
        ).toLowerCase();
        const score = tokens.reduce(function (total, token) {
          return (
            total +
            (token.length > 3 && text.includes(token)
              ? doc.keywords.includes(token)
                ? 3
                : 1
              : 0)
          );
        }, 0);
        return { doc: doc, score: score };
      })
      .sort(function (a, b) {
        return b.score - a.score;
      });
    const match = ranked[0];
    state.answer =
      match && match.score >= 3
        ? { question: q, text: match.doc.content, sourceId: match.doc.id }
        : {
            question: q,
            text: "I couldn’t find an approved document to answer that question. Ask an admin which sources are available to you.",
            sourceId: null,
          };
    state.question = "";
    renderDrawer();
  }
  function saveUpload() {
    const draft = state.draft;
    if (!hasScope(draft.scope)) {
      state.error = "Select who can access this content.";
      renderDrawer();
      const scopeSearch = document.getElementById("scope-search");
      if (scopeSearch && scopeSearch.scrollIntoView)
        scopeSearch.scrollIntoView({ block: "center" });
      if (scopeSearch && scopeSearch.focus) scopeSearch.focus();
      return;
    }
    if (draft.mode === "file") {
      if (!draft.files.length) {
        state.error = "Choose at least one document.";
        renderDrawer();
        return;
      }
      const invalid = draft.files.find(function (file) {
        return !/\.(pdf|docx)$/i.test(file.name) || file.size > MAX_FILE_BYTES;
      });
      if (invalid) {
        state.error = "Each file must be a PDF or DOCX and 20 MB or smaller.";
        renderDrawer();
        return;
      }
      draft.files.forEach(function (file, index) {
        const content = String(draft.demoTexts[index] || "").trim();
        const doc = {
          id: "local-" + Date.now().toString(36) + "-" + index,
          title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          kind: "file",
          source: "upload",
          fileName: file.name,
          label: draft.label,
          status: content || draft.simulateFailure ? "processing" : "uploaded",
          scope: copy(draft.scope),
          content: content,
          keywords: (file.name + " " + content).toLowerCase().slice(0, 300),
          simulateFailure: draft.simulateFailure,
          attempt: 1,
          failureReason: "",
        };
        state.documents.unshift(doc);
        if (doc.status === "processing") finishProcessing(doc.id, doc.attempt);
      });
      state.statusFilter = "all";
      closeDrawer();
      renderSection();
      showToast(
        draft.simulateFailure || draft.demoTexts.some(function (value) { return !!String(value).trim(); })
          ? "Documents added. Processing is simulated in this local prototype."
          : "Upload complete in this demo. Add test text to demonstrate indexing.",
      );
      return;
    }
    if (!draft.title.trim() || !draft.text.trim()) {
      state.error = "Add a name and context text.";
      renderDrawer();
      return;
    }
    state.documents.unshift({
      id: "note-" + Date.now().toString(36),
      title: draft.title.trim(),
      kind: "text",
      source: "upload",
      fileName: "",
      label: draft.label,
      status: "published",
      scope: copy(draft.scope),
      content: draft.text.trim(),
      keywords: (draft.title + " " + draft.text).toLowerCase().slice(0, 300),
    });
    state.statusFilter = "all";
    closeDrawer();
    renderSection();
    showToast("Text context added for the selected audience in this demo.");
  }
  function saveRetry() {
    const doc = documentById(state.draft.id);
    if (!doc || (doc.status !== "failed" && doc.status !== "uploaded"))
      return;
    const content = state.draft.text.trim();
    if (!content) {
      state.error = "Paste searchable text from this document to continue.";
      renderDrawer();
      return;
    }
    doc.content = content;
    doc.keywords = (doc.title + " " + content).toLowerCase().slice(0, 300);
    doc.status = "processing";
    doc.simulateFailure = false;
    doc.failureReason = "";
    doc.attempt = (doc.attempt || 0) + 1;
    state.statusFilter = "all";
    closeDrawer();
    renderSection();
    finishProcessing(doc.id, doc.attempt);
    showToast(doc.title + " is processing again.");
  }
  function saveConnector() {
    const draft = state.draft;
    if (!hasScope(draft.scope)) {
      state.error = "Select the maximum Dialpad audience for this source.";
      renderDrawer();
      return;
    }
    const existing = connectorById(draft.providerId);
    if (existing) existing.scope = copy(draft.scope);
    else
      state.connectors.push({ id: draft.providerId, scope: copy(draft.scope) });
    state.drawer = "sources";
    state.draft = null;
    renderDrawer();
    renderSection();
    showToast("Demo source setup saved. No external service was connected.");
  }
  function saveDocument() {
    const draft = state.draft;
    if (!hasScope(draft.scope)) {
      state.error = "Select who can access this document.";
      renderDrawer();
      return;
    }
    const doc = documentById(draft.id);
    if (!doc) return;
    doc.scope = copy(draft.scope);
    doc.status = draft.status;
    closeDrawer();
    renderSection();
    showToast("Document access saved for this demo.");
  }

  document.addEventListener("click", function (event) {
    if (
      state.scopeUi.open &&
      state.drawer &&
      !event.target.closest("#scope-picker")
    )
      closeScopeResults();
    if (event.target.classList.contains("modal-scrim")) {
      const wasCompanyConfirmation =
        state.modal && state.modal.type === "confirm-company-scope";
      state.modal = null;
      renderModal();
      if (wasCompanyConfirmation) refreshScopePicker("#scope-all");
      return;
    }
    const section = event.target.closest("[data-section]");
    if (section) {
      state.section = section.dataset.section;
      if (state.drawer) closeDrawer();
      renderSection();
      return;
    }
    const inert = event.target.closest("[data-inert]");
    if (inert) {
      event.preventDefault();
      showToast(inert.dataset.inert + " is outside this Copilot concept.");
      return;
    }
    const button = event.target.closest("[data-action]");
    if (!button) return;
    event.preventDefault();
    const action = button.dataset.action;
    if (action === "upload") openDrawer("upload");
    if (action === "configure-sources") {
      state.drawer = "sources";
      state.error = "";
      state.draft = null;
      renderDrawer();
    }
    if (action === "test-copilot") openDrawer("test");
    if (action === "access-details") {
      hideAccessPreview();
      state.accessUi = emptyAccessUi();
      state.modal = { type: "access", id: button.dataset.id };
      renderModal();
      const title = document.getElementById("modal-title");
      if (title) title.focus();
    }
    if (action === "edit-access-document") {
      const id = button.dataset.id;
      state.modal = null;
      renderModal();
      openDrawer("document", id);
    }
    if (action === "select-access-person") {
      const selected = person(button.dataset.id);
      if (!selected) return;
      state.accessUi.personId = selected.id;
      state.accessUi.personQuery = selected.name;
      state.accessUi.personOpen = false;
      refreshAccessUi("#access-person-search");
    }
    if (action === "clear-access-person") {
      state.accessUi.personId = null;
      state.accessUi.personQuery = "";
      state.accessUi.personOpen = false;
      refreshAccessUi("#access-person-search");
    }
    if (action === "access-page-prev" || action === "access-page-next") {
      state.accessUi.page += action === "access-page-next" ? 1 : -1;
      refreshAccessUi(".access-results-count");
    }
    if (action === "scope-type" && state.draft) {
      if (state.draft.scope.company) return;
      const type = button.dataset.type;
      if (!["offices", "groups", "users"].includes(type)) return;
      state.scopeUi.type = type;
      state.scopeUi.query = "";
      state.scopeUi.open = true;
      refreshScopePicker("#scope-search");
    }
    if (action === "select-all-scope" && state.draft) {
      if (state.draft.scope.company) {
        state.draft.scope = copy(state.draft.targetedBackup || emptyScope());
        state.error = "";
        refreshScopePicker("#scope-all");
      } else {
        state.modal = { type: "confirm-company-scope" };
        renderModal();
        const title = document.getElementById("modal-title");
        if (title) title.focus();
      }
    }
    if (action === "clear-company-scope" && state.draft) {
      state.draft.scope = copy(state.draft.targetedBackup || emptyScope());
      state.scopeUi.open = true;
      state.error = "";
      refreshScopePicker("#scope-search");
    }
    if (action === "toggle-scope-result" && state.draft) {
      if (state.draft.scope.company) return;
      const kind = button.dataset.kind;
      const id = button.dataset.id;
      if (!["offices", "groups", "users"].includes(kind)) return;
      const list = state.draft.scope[kind];
      state.draft.scope[kind] = list.includes(id)
        ? list.filter(function (item) {
            return item !== id;
          })
        : list.concat(id);
      state.scopeUi.open = true;
      state.error = "";
      refreshScopePicker("#scope-search");
    }
    if (action === "remove-scope-item" && state.draft) {
      if (state.draft.scope.company) return;
      const kind = button.dataset.kind;
      const id = button.dataset.id;
      if (!["offices", "groups", "users"].includes(kind)) return;
      state.draft.scope[kind] = state.draft.scope[kind].filter(function (item) {
        return item !== id;
      });
      state.scopeUi.open = true;
      state.error = "";
      refreshScopePicker("#scope-search");
    }
    if (action === "close-drawer") closeDrawer();
    if (action === "edit-document") openDrawer("document", button.dataset.id);
    if (action === "retry-document") openDrawer("retry", button.dataset.id);
    if (action === "configure-provider")
      openDrawer("connector", button.dataset.provider);
    if (action === "switch-upload-mode") {
      state.draft.mode = button.dataset.mode;
      state.error = "";
      renderDrawer();
    }
    if (action === "remove-upload-file") {
      state.draft.files.splice(Number(button.dataset.index), 1);
      state.draft.demoTexts.splice(Number(button.dataset.index), 1);
      renderDrawer();
    }
    if (action === "save-upload") saveUpload();
    if (action === "save-retry") saveRetry();
    if (action === "save-connector") saveConnector();
    if (action === "save-document") saveDocument();
    if (action === "toggle-document-status") {
      if (["published", "paused"].includes(state.draft.status)) {
        state.draft.status =
          state.draft.status === "paused" ? "published" : "paused";
        renderDrawer();
      }
    }
    if (action === "remove-document") {
      state.modal = { type: "remove-document", id: state.draft.id };
      renderModal();
    }
    if (action === "remove-connector") {
      state.modal = { type: "remove-connector", id: state.draft.providerId };
      renderModal();
    }
    if (action === "close-modal") {
      const wasCompanyConfirmation =
        state.modal && state.modal.type === "confirm-company-scope";
      state.modal = null;
      renderModal();
      if (wasCompanyConfirmation) refreshScopePicker("#scope-all");
    }
    if (action === "confirm-company-scope" && state.draft) {
      state.draft.targetedBackup = copy(state.draft.scope);
      state.draft.scope = { company: true, offices: [], groups: [], users: [] };
      state.scopeUi = { query: "", open: false, type: state.scopeUi.type };
      state.error = "";
      state.modal = null;
      renderModal();
      refreshScopePicker("#scope-all");
    }
    if (action === "confirm-remove") {
      if (state.modal.type === "remove-document")
        state.documents = state.documents.filter(function (doc) {
          return doc.id !== state.modal.id;
        });
      else {
        state.connectors = state.connectors.filter(function (item) {
          return item.id !== state.modal.id;
        });
        state.documents = state.documents.filter(function (doc) {
          return doc.source !== state.modal.id;
        });
      }
      state.modal = null;
      closeDrawer();
      render();
      showToast("Removed from this browser session.");
    }
    if (action === "load-samples") loadSamples();
    if (action === "clear-filters") clearFilters();
    if (action === "ask-prompt") ask(button.dataset.question);
    if (action === "ask-copilot") ask(state.question);
    if (action === "open-citation") {
      state.modal = { type: "citation", id: button.dataset.id };
      renderModal();
    }
  });
  document.addEventListener("change", function (event) {
    const target = event.target;
    if (target.dataset.filter) {
      state[target.dataset.filter] = target.value;
      renderSection();
    }
    if (target.dataset.viewer) {
      state.viewer = target.value;
      state.answer = null;
      renderDrawer();
    }
    if (target.dataset.draftSelect && state.draft)
      state.draft[target.dataset.draftSelect] = target.value;
    if (target.id === "simulate-upload-failure" && state.draft)
      state.draft.simulateFailure = target.checked;
    if (target.id === "document-file-input" && state.draft) {
      const files = Array.from(target.files || []);
      state.draft.files = state.draft.files.concat(files);
      state.draft.demoTexts = state.draft.demoTexts.concat(files.map(function () { return ""; }));
      state.error = "";
      renderDrawer();
    }
  });
  document.addEventListener("input", function (event) {
    const target = event.target;
    if (target.dataset.demoTextIndex != null && state.draft) {
      state.draft.demoTexts[Number(target.dataset.demoTextIndex)] = target.value;
    }
    if (target.id === "access-list-search") {
      state.accessUi.listQuery = target.value;
      state.accessUi.page = 0;
      refreshAccessUi("#access-list-search", {
        start: target.selectionStart,
        end: target.selectionEnd,
      });
    }
    if (target.id === "access-person-search") {
      state.accessUi.personQuery = target.value;
      state.accessUi.personId = null;
      state.accessUi.personOpen = target.value.trim().length >= 2;
      refreshAccessUi("#access-person-search", {
        start: target.selectionStart,
        end: target.selectionEnd,
      });
    }
    if (target.id === "scope-search" && state.draft) {
      state.scopeUi.query = target.value;
      state.scopeUi.open = true;
      if (!scopeComposing)
        refreshScopePicker("#scope-search", {
          start:
            target.selectionStart == null
              ? target.value.length
              : target.selectionStart,
          end:
            target.selectionEnd == null
              ? target.value.length
              : target.selectionEnd,
        });
    }
    if (target.dataset.draft && state.draft) {
      state.draft[target.dataset.draft] = target.value;
      state.error = "";
    }
    if (target.id === "test-question") state.question = target.value;
    if (target.dataset.input === "search") {
      state.search = target.value;
      const selection = target.selectionStart;
      renderSection();
      const input = document.getElementById("document-search");
      if (input) {
        input.focus();
        input.setSelectionRange(selection, selection);
      }
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown" && event.target.id === "access-person-search") {
      const first = document.querySelector('#access-person-results [data-action="select-access-person"]');
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "ArrowDown" && event.target.id === "scope-search") {
      const first = document.querySelector(
        '#scope-results [data-action="toggle-scope-result"]',
      );
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
    if (
      event.key === "Escape" &&
      state.scopeUi.open &&
      event.target.closest("#scope-picker")
    ) {
      event.preventDefault();
      closeScopeResults();
      if (event.target.id !== "scope-search") {
        const input = document.getElementById("scope-search");
        if (input) {
          suppressScopeOpenOnFocus = true;
          input.focus();
          suppressScopeOpenOnFocus = false;
        }
      }
      return;
    }
    if (event.key === "Escape") {
      if (state.accessUi.personOpen && event.target.id === "access-person-search") {
        state.accessUi.personOpen = false;
        refreshAccessUi("#access-person-search");
        return;
      }
      if (accessPreviewTrigger) {
        hideAccessPreview();
        return;
      }
      if (state.modal) {
        const wasCompanyConfirmation = state.modal.type === "confirm-company-scope";
        state.modal = null;
        renderModal();
        if (wasCompanyConfirmation) refreshScopePicker("#scope-all");
      } else if (state.drawer) closeDrawer();
    }
    if (
      event.key === "Enter" &&
      event.target.id === "test-question" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      ask(state.question);
    }
    if (event.key === "Tab" && state.modal) {
      const modal = document.querySelector(".modal");
      if (!modal) return;
      const focusable = Array.from(
        modal.querySelectorAll('[tabindex="-1"], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'),
      ).filter(function (item) { return item.offsetParent !== null; });
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
        event.preventDefault();
        focusable[0].focus();
      }
      return;
    }
    if (event.key === "Tab" && state.drawer && !state.modal) {
      const drawer = document.querySelector(".drawer");
      if (!drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
        ),
      ).filter(function (item) {
        return item.offsetParent !== null;
      });
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === focusable[focusable.length - 1]
      ) {
        event.preventDefault();
        focusable[0].focus();
      }
    }
  });
  document.addEventListener("dragover", function (event) {
    const zone = event.target.closest("#upload-box");
    if (zone) {
      event.preventDefault();
      zone.classList.add("dragging");
    }
  });
  document.addEventListener("dragleave", function (event) {
    const zone = event.target.closest("#upload-box");
    if (zone) zone.classList.remove("dragging");
  });
  document.addEventListener("drop", function (event) {
    const zone = event.target.closest("#upload-box");
    if (!zone || !state.draft) return;
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files || []);
    state.draft.files = state.draft.files.concat(files);
    state.draft.demoTexts = state.draft.demoTexts.concat(files.map(function () { return ""; }));
    state.error = "";
    renderDrawer();
  });
  document.addEventListener("focusin", function (event) {
    const accessTrigger = event.target.closest(".access-trigger");
    if (accessTrigger) showAccessPreview(accessTrigger);
    if (state.scopeUi.open && !event.target.closest("#scope-picker"))
      closeScopeResults();
    if (
      event.target.id === "scope-search" &&
      !state.scopeUi.open &&
      !suppressScopeOpenOnFocus
    ) {
      state.scopeUi.open = true;
      refreshScopePicker("#scope-search");
    }
  });
  document.addEventListener("compositionstart", function (event) {
    if (event.target.id === "scope-search") scopeComposing = true;
  });
  document.addEventListener("compositionend", function (event) {
    if (event.target.id !== "scope-search") return;
    scopeComposing = false;
    state.scopeUi.query = event.target.value;
    state.scopeUi.open = true;
    refreshScopePicker("#scope-search", {
      start: event.target.selectionStart,
      end: event.target.selectionEnd,
    });
  });
  document.addEventListener("focusout", function (event) {
    if (event.target.closest(".access-trigger")) hideAccessPreview();
  });
  document.addEventListener("mouseover", function (event) {
    const trigger = event.target.closest(".access-trigger");
    if (trigger && !trigger.contains(event.relatedTarget))
      showAccessPreview(trigger);
  });
  document.addEventListener("mouseout", function (event) {
    const trigger = event.target.closest(".access-trigger");
    if (trigger && !trigger.contains(event.relatedTarget)) hideAccessPreview();
  });
  document.addEventListener(
    "scroll",
    function (event) {
      if (!event.target.closest || !event.target.closest(".access-preview"))
        hideAccessPreview();
    },
    true,
  );
  document
    .getElementById("mobile-nav-button")
    .addEventListener("click", function () {
      document.getElementById("admin-nav").classList.toggle("open");
    });
  if (
    window.location &&
    /(?:^|[?&])demo=1(?:&|$)/.test(window.location.search || "")
  )
    loadSamples();
  else render();
})();
