(function () {
  "use strict";

  const API_BASE = (document.querySelector('meta[name="admin-api-base"]')?.content || "/admin/api").replace(/\/$/, "");
  const numberFormat = new Intl.NumberFormat("zh-CN");
  const dateTimeFormat = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const shortDateFormat = new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", month: "numeric", day: "numeric" });

  const categoryLabels = {
    content_error: "内容错误",
    broken_link: "链接失效",
    date_update: "日期更新",
    suggestion: "改进建议",
    question: "问题咨询",
    other: "其他",
  };
  const statusLabels = { new: "新反馈", reviewing: "处理中", resolved: "已解决", archived: "已归档" };
  const rangeLabels = { today: "今日", "7d": "近 7 日", "30d": "近 30 日" };
  const apiErrorLabels = {
    invalid_credentials: "管理员密码不正确。",
    authentication_required: "登录已失效，请重新登录。",
    csrf_failed: "安全校验已失效，请刷新页面后重新登录。",
    cross_site_request: "安全校验未通过，请从本站后台重新操作。",
    feedback_not_found: "这条反馈已不存在或已被移除。",
    invalid_date_range: "结束日期不能早于开始日期。",
    export_too_large: "导出记录超过 10,000 条，请先缩小筛选范围。",
    admin_unavailable: "管理服务暂时不可用，请稍后重试。",
  };

  const state = {
    csrfToken: "",
    currentPanel: "overview",
    range: "7d",
    ranking: "views",
    dashboard: null,
    dashboardRequest: 0,
    feedbackRequest: 0,
    feedback: { items: [], total: 0, page: 1, pageSize: 20, totalPages: 1, filters: {} },
    activeFeedback: null,
    dialogReturnFocus: null,
    toastTimer: 0,
  };

  const elements = {
    loginView: document.getElementById("login-view"),
    adminView: document.getElementById("admin-view"),
    loginForm: document.getElementById("login-form"),
    loginPassword: document.getElementById("login-password"),
    loginError: document.getElementById("login-error"),
    loginSubmit: document.getElementById("login-submit"),
    announcer: document.getElementById("announcer"),
    adminName: document.getElementById("admin-name"),
    logoutButton: document.getElementById("logout-button"),
    sidebar: document.getElementById("sidebar"),
    sidebarBackdrop: document.getElementById("sidebar-backdrop"),
    menuToggle: document.getElementById("menu-toggle"),
    mainContent: document.getElementById("main-content"),
    topbarSection: document.getElementById("topbar-section"),
    dataUpdated: document.getElementById("data-updated"),
    newFeedbackBadge: document.getElementById("new-feedback-badge"),
    dashboardLoading: document.getElementById("dashboard-loading"),
    dashboardError: document.getElementById("dashboard-error"),
    dashboardContent: document.getElementById("dashboard-content"),
    dashboardRetry: document.getElementById("dashboard-retry"),
    trendChart: document.getElementById("trend-chart"),
    trendEmpty: document.getElementById("trend-empty"),
    trendSummary: document.getElementById("trend-summary"),
    rankingBody: document.getElementById("ranking-body"),
    rankingEmpty: document.getElementById("ranking-empty"),
    rankingTableWrap: document.getElementById("ranking-table-wrap"),
    feedbackFilters: document.getElementById("feedback-filters"),
    feedbackFrom: document.getElementById("feedback-from"),
    feedbackTo: document.getElementById("feedback-to"),
    feedbackPageSize: document.getElementById("feedback-page-size"),
    feedbackLoading: document.getElementById("feedback-loading"),
    feedbackError: document.getElementById("feedback-error"),
    feedbackEmpty: document.getElementById("feedback-empty"),
    feedbackContent: document.getElementById("feedback-content"),
    feedbackBody: document.getElementById("feedback-body"),
    feedbackTotal: document.getElementById("feedback-total"),
    feedbackRetry: document.getElementById("feedback-retry"),
    feedbackEmptyReset: document.getElementById("feedback-empty-reset"),
    filterReset: document.getElementById("filter-reset"),
    exportFeedback: document.getElementById("export-feedback"),
    pagePrevious: document.getElementById("page-previous"),
    pageNext: document.getElementById("page-next"),
    pageStatus: document.getElementById("page-status"),
    dialog: document.getElementById("feedback-dialog"),
    dialogClose: document.getElementById("dialog-close"),
    dialogLoading: document.getElementById("dialog-loading"),
    dialogError: document.getElementById("dialog-error"),
    dialogContent: document.getElementById("dialog-content"),
    dialogCategory: document.getElementById("dialog-category"),
    dialogCreated: document.getElementById("dialog-created"),
    dialogMessage: document.getElementById("dialog-message"),
    dialogPath: document.getElementById("dialog-path"),
    dialogContact: document.getElementById("dialog-contact"),
    dialogLanguage: document.getElementById("dialog-language"),
    dialogId: document.getElementById("dialog-id"),
    dialogStatusForm: document.getElementById("dialog-status-form"),
    dialogStatus: document.getElementById("dialog-status"),
    dialogNote: document.getElementById("dialog-note"),
    dialogSave: document.getElementById("dialog-save"),
    dialogSaveError: document.getElementById("dialog-save-error"),
    copyContact: document.getElementById("copy-contact"),
    toast: document.getElementById("toast"),
  };

  class ApiError extends Error {
    constructor(status, code, message) {
      super(message || "请求失败");
      this.name = "ApiError";
      this.status = status;
      this.code = code || "request_failed";
    }
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");
    if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
    if (state.csrfToken && !["GET", "HEAD"].includes((options.method || "GET").toUpperCase())) headers.set("X-CSRF-Token", state.csrfToken);

    let response;
    try {
      response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "same-origin" });
    } catch (error) {
      throw new ApiError(0, "network_error", "无法连接管理服务，请检查网络后重试。");
    }

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json().catch(() => ({})) : {};
    if (!response.ok) {
      if (response.status === 401 && path !== "/login") showLogin("登录已失效，请重新登录。");
      const detail = payload.error && typeof payload.error === "object" ? payload.error : payload;
      throw new ApiError(response.status, detail.code, apiErrorLabels[detail.code] || detail.message || errorMessage(response.status));
    }
    const csrfToken = response.headers.get("x-csrf-token") || payload.csrfToken || payload.data?.csrfToken;
    if (csrfToken) state.csrfToken = csrfToken;
    return payload.data ?? payload;
  }

  function errorMessage(status) {
    if (status === 400) return "提交的信息有误，请检查后重试。";
    if (status === 401) return "管理员密码不正确，或登录已失效。";
    if (status === 403) return "当前账号没有执行此操作的权限。";
    if (status === 429) return "操作过于频繁，请稍后重试。";
    if (status >= 500) return "管理服务暂时不可用，请稍后重试。";
    return "请求未能完成，请重试。";
  }

  const api = {
    session: () => request("/session"),
    login: (credentials) => request("/login", { method: "POST", body: JSON.stringify(credentials) }),
    logout: () => request("/logout", { method: "POST" }),
    dashboard: (range) => request(`/dashboard?${new URLSearchParams({ range })}`),
    feedback: (params) => request(`/feedback?${new URLSearchParams(params)}`),
    feedbackDetail: (id) => request(`/feedback/${encodeURIComponent(id)}`),
    updateFeedback: (id, update) => request(`/feedback/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(update) }),
    feedbackExport: async (params) => {
      const headers = new Headers({ Accept: "text/csv" });
      if (state.csrfToken) headers.set("X-CSRF-Token", state.csrfToken);
      let response;
      try {
        response = await fetch(`${API_BASE}/feedback.csv?${new URLSearchParams(params)}`, { method: "POST", headers, credentials: "same-origin" });
      } catch {
        throw new ApiError(0, "network_error", "无法连接管理服务，请检查网络后重试。");
      }
      if (!response.ok) {
        const payload = (response.headers.get("content-type") || "").includes("application/json") ? await response.json().catch(() => ({})) : {};
        if (response.status === 401) showLogin("登录已失效，请重新登录。");
        const detail = payload.error && typeof payload.error === "object" ? payload.error : payload;
        throw new ApiError(response.status, detail.code, apiErrorLabels[detail.code] || detail.message || errorMessage(response.status));
      }
      return { blob: await response.blob(), disposition: response.headers.get("content-disposition") || "" };
    },
  };

  function coalesceNumber() {
    for (const value of arguments) {
      if (value !== undefined && value !== null && value !== "" && Number.isFinite(Number(value))) return Number(value);
    }
    return 0;
  }

  function normalizeDashboard(raw) {
    const root = raw?.dashboard ?? raw ?? {};
    const summary = root.summary ?? root.totals ?? {};
    const visits = root.visits ?? summary.visits ?? {};
    const rankings = root.rankings ?? {};
    const commonPages = root.topPages ?? root.pages ?? [];
    const normalizePage = (item) => ({
      path: String(item.path ?? item.url ?? "/"),
      title: String(item.title ?? item.pageTitle ?? pageTitle(item.path ?? item.url ?? "/")),
      pageViews: coalesceNumber(item.pageViews, item.page_views, item.views),
      likes: coalesceNumber(item.likes, item.likeCount, item.like_count),
    });
    const viewPages = (rankings.views ?? root.topPageViews ?? commonPages).map(normalizePage);
    const likePages = (rankings.likes ?? root.topLikes ?? commonPages).map(normalizePage);
    const timeline = (root.timeline ?? root.trend ?? root.daily ?? root.series ?? []).map((entry) => ({
      date: String(entry.date ?? entry.day ?? entry.label ?? ""),
      label: String(entry.label ?? ""),
      visits: coalesceNumber(entry.visits, entry.siteVisits, entry.site_visits, entry.visitors, entry.uniqueVisitors, entry.unique_visitors),
      pageViews: coalesceNumber(entry.pageViews, entry.page_views, entry.views),
    }));
    const derivedToday = timeline.slice(-1).reduce((sum, entry) => sum + entry.visits, 0);
    const derivedSeven = timeline.slice(-7).reduce((sum, entry) => sum + entry.visits, 0);
    const derivedThirty = timeline.slice(-30).reduce((sum, entry) => sum + entry.visits, 0);
    return {
      visits: {
        today: coalesceNumber(visits.today, visits.todayVisits, summary.todayVisits, root.todayVisits, derivedToday),
        seven: coalesceNumber(visits.sevenDays, visits.last7Days, visits["7d"], summary.sevenDayVisits, root.sevenDayVisits, derivedSeven),
        thirty: coalesceNumber(visits.thirtyDays, visits.last30Days, visits["30d"], summary.thirtyDayVisits, root.thirtyDayVisits, derivedThirty),
      },
      pageViews: coalesceNumber(summary.pageViews, root.pageViews, root.page_views),
      likes: coalesceNumber(summary.likes, root.likes),
      newFeedback: coalesceNumber(summary.newFeedback, summary.pendingFeedback, root.newFeedback, root.pendingFeedback, root.feedbackByStatus?.new),
      timeline,
      rankings: { views: viewPages, likes: likePages },
      updatedAt: root.updatedAt ?? root.updated_at ?? new Date().toISOString(),
    };
  }

  function normalizeFeedback(raw) {
    const root = raw?.feedback ?? raw ?? {};
    const items = (root.items ?? root.results ?? root.feedback ?? []).map(normalizeFeedbackItem);
    const total = coalesceNumber(root.total, root.totalCount, root.count, items.length);
    const page = Math.max(1, coalesceNumber(root.page, state.feedback.page));
    const pageSize = Math.max(1, coalesceNumber(root.pageSize, root.limit, state.feedback.pageSize));
    return { items, total, page, pageSize, totalPages: Math.max(1, coalesceNumber(root.totalPages, Math.ceil(total / pageSize))) };
  }

  function normalizeFeedbackItem(item) {
    return {
      id: String(item.id ?? item.receiptId ?? item.receipt_id ?? ""),
      category: String(item.category ?? "other"),
      status: String(item.status ?? "new"),
      message: String(item.message ?? ""),
      contact: item.contact ? String(item.contact) : "",
      path: String(item.path ?? "/"),
      language: String(item.language ?? "zh-CN"),
      createdAt: item.createdAt ?? item.created_at ?? "",
      updatedAt: item.updatedAt ?? item.updated_at ?? "",
      internalNote: item.internalNote ? String(item.internalNote) : "",
    };
  }

  function pageTitle(path) {
    const pathname = String(path || "/").split(/[?#]/)[0];
    if (pathname === "/") return "首页";
    const last = pathname.split("/").filter(Boolean).pop() || "页面";
    try { return decodeURIComponent(last).replace(/\.html$/i, "").replace(/[-_]+/g, " "); } catch { return last; }
  }

  function formatNumber(value) { return numberFormat.format(coalesceNumber(value)); }
  function formatDateTime(value) {
    if (!value) return "—";
    const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(String(value)) ? `${String(value).replace(" ", "T")}Z` : value;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? String(value) : dateTimeFormat.format(date).replace(/\//g, "-");
  }
  function shortDate(value) {
    if (!value) return "—";
    const date = new Date(`${String(value).slice(0, 10)}T12:00:00+08:00`);
    return Number.isNaN(date.getTime()) ? String(value).slice(5) : shortDateFormat.format(date);
  }
  function announce(message) { elements.announcer.textContent = ""; window.setTimeout(() => { elements.announcer.textContent = message; }, 20); }

  function showLogin(message = "") {
    state.csrfToken = "";
    closeSidebar();
    if (elements.dialog.open) elements.dialog.close();
    elements.adminView.hidden = true;
    elements.loginView.hidden = false;
    elements.loginError.hidden = !message;
    elements.loginError.textContent = message;
    document.title = "管理后台登录｜国际升学数学资料库";
    window.setTimeout(() => elements.loginPassword.focus(), 0);
  }

  function showAdmin(session = {}) {
    elements.loginView.hidden = true;
    elements.adminView.hidden = false;
    elements.loginForm.reset();
    elements.loginError.hidden = true;
    elements.adminName.textContent = session.user?.displayName || session.user?.name || session.username || "管理员";
    const hashPanel = location.hash === "#feedback" ? "feedback" : "overview";
    switchPanel(hashPanel, false);
  }

  async function boot() {
    elements.loginView.setAttribute("aria-busy", "true");
    try {
      const session = await api.session();
      if (session.authenticated === false) return showLogin();
      showAdmin(session);
    } catch (error) {
      showLogin(error.status === 401 ? "" : error.message);
    } finally {
      elements.loginView.removeAttribute("aria-busy");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (!elements.loginForm.reportValidity()) return;
    setButtonLoading(elements.loginSubmit, true);
    elements.loginError.hidden = true;
    try {
      const session = await api.login({ password: elements.loginPassword.value });
      showAdmin(session);
      announce("登录成功");
    } catch (error) {
      elements.loginError.textContent = error.message;
      elements.loginError.hidden = false;
      elements.loginPassword.select();
    } finally {
      setButtonLoading(elements.loginSubmit, false);
    }
  }

  async function handleLogout() {
    elements.logoutButton.disabled = true;
    try { await api.logout(); } catch (error) { /* The local session is still cleared below. */ }
    elements.logoutButton.disabled = false;
    showLogin("已安全退出后台。");
  }

  function setButtonLoading(button, loading) {
    button.disabled = loading;
    const label = button.querySelector(".button-label");
    const loader = button.querySelector(".button-loading");
    if (label) label.hidden = loading;
    if (loader) loader.hidden = !loading;
  }

  function switchPanel(panel, updateHash = true) {
    if (!['overview', 'feedback'].includes(panel)) panel = "overview";
    state.currentPanel = panel;
    document.querySelectorAll("[data-panel-view]").forEach((view) => { view.hidden = view.dataset.panelView !== panel; });
    document.querySelectorAll("[data-panel]").forEach((button) => {
      const active = button.dataset.panel === panel;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current");
    });
    elements.topbarSection.textContent = panel === "overview" ? "总览" : "反馈管理";
    document.title = `${panel === "overview" ? "数据总览" : "反馈管理"}｜国际升学数学资料库`;
    if (updateHash) history.replaceState(null, "", panel === "feedback" ? "#feedback" : location.pathname + location.search);
    closeSidebar();
    elements.mainContent.focus({ preventScroll: true });
    if (panel === "overview" && !state.dashboard) loadDashboard();
    if (panel === "feedback") loadFeedback();
  }

  function openSidebar() {
    elements.sidebar.classList.add("is-open");
    elements.sidebarBackdrop.hidden = false;
    elements.menuToggle.setAttribute("aria-expanded", "true");
    elements.sidebar.querySelector(".nav-item.is-active")?.focus();
  }
  function closeSidebar() {
    elements.sidebar.classList.remove("is-open");
    elements.sidebarBackdrop.hidden = true;
    elements.menuToggle.setAttribute("aria-expanded", "false");
  }

  async function loadDashboard() {
    const requestId = ++state.dashboardRequest;
    elements.dashboardLoading.hidden = false;
    elements.dashboardError.hidden = true;
    elements.dashboardContent.hidden = true;
    try {
      const data = normalizeDashboard(await api.dashboard("30d"));
      if (requestId !== state.dashboardRequest) return;
      state.dashboard = data;
      renderDashboard(data);
      elements.dashboardLoading.hidden = true;
      elements.dashboardContent.hidden = false;
    } catch (error) {
      if (requestId !== state.dashboardRequest || error.status === 401) return;
      elements.dashboardLoading.hidden = true;
      elements.dashboardError.hidden = false;
      elements.dashboardError.querySelector("p").textContent = error.message;
    }
  }

  function renderDashboard(data) {
    document.getElementById("metric-today").textContent = formatNumber(data.visits.today);
    document.getElementById("metric-seven").textContent = formatNumber(data.visits.seven);
    document.getElementById("metric-thirty").textContent = formatNumber(data.visits.thirty);
    document.getElementById("metric-pageviews").textContent = formatNumber(data.pageViews);
    document.getElementById("metric-pageviews-range").textContent = "累计 · 匿名浏览器／页面／日去重";
    document.getElementById("metric-likes").textContent = formatNumber(data.likes);
    document.getElementById("metric-feedback").textContent = formatNumber(data.newFeedback);
    elements.dataUpdated.textContent = `更新于 ${formatDateTime(data.updatedAt)}`;
    elements.newFeedbackBadge.textContent = formatNumber(data.newFeedback);
    elements.newFeedbackBadge.hidden = data.newFeedback <= 0;
    renderTrend(data.timeline);
    renderRanking();
  }

  function renderTrend(timeline) {
    elements.trendChart.replaceChildren();
    const relevant = state.range === "today" ? timeline.slice(-1) : state.range === "7d" ? timeline.slice(-7) : timeline.slice(-30);
    const max = Math.max(0, ...relevant.map((entry) => entry.visits));
    elements.trendEmpty.hidden = relevant.length > 0 && max > 0;
    elements.trendChart.hidden = !elements.trendEmpty.hidden;
    const total = relevant.reduce((sum, entry) => sum + entry.visits, 0);
    elements.trendSummary.textContent = relevant.length ? `${rangeLabels[state.range]}共 ${formatNumber(total)} 条访问记录（每日去重）` : "—";
    relevant.forEach((entry) => {
      const item = document.createElement("li");
      const bar = document.createElement("span");
      const label = document.createElement("span");
      const accessible = document.createElement("span");
      const heightStep = max > 0 ? Math.max(1, Math.min(20, Math.ceil(entry.visits / max * 20))) : 1;
      bar.className = `chart-column chart-height-${heightStep}`;
      bar.title = `${entry.date || entry.label}：${formatNumber(entry.visits)} 条按日去重访问记录`;
      label.className = "chart-label";
      label.textContent = entry.label || shortDate(entry.date);
      accessible.className = "sr-only";
      accessible.textContent = `${entry.date || entry.label}，${formatNumber(entry.visits)} 条按日去重访问记录，${formatNumber(entry.pageViews)} 条按页面每日去重浏览记录`;
      item.append(bar, label, accessible);
      elements.trendChart.append(item);
    });
  }

  function renderRanking() {
    const source = state.dashboard?.rankings?.[state.ranking] ?? [];
    const pages = [...source].sort((a, b) => state.ranking === "likes" ? b.likes - a.likes : b.pageViews - a.pageViews).slice(0, 10);
    elements.rankingBody.replaceChildren();
    elements.rankingEmpty.hidden = pages.length > 0;
    elements.rankingTableWrap.hidden = pages.length === 0;
    pages.forEach((page, index) => {
      const row = document.createElement("tr");
      const rank = cell();
      const pageCell = cell("page-cell");
      const views = cell();
      const likes = cell();
      const rankNumber = document.createElement("span");
      const title = document.createElement("strong");
      const path = document.createElement("small");
      rankNumber.className = "rank-number";
      rankNumber.textContent = String(index + 1);
      title.textContent = page.title || pageTitle(page.path);
      path.textContent = page.path;
      views.textContent = formatNumber(page.pageViews);
      likes.textContent = formatNumber(page.likes);
      rank.append(rankNumber);
      pageCell.append(title, path);
      row.append(rank, pageCell, views, likes);
      elements.rankingBody.append(row);
    });
  }

  function cell(className = "") {
    const element = document.createElement("td");
    if (className) element.className = className;
    return element;
  }

  function currentFilters() {
    const values = Object.fromEntries(new FormData(elements.feedbackFilters).entries());
    return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value).trim()]).filter(([, value]) => value));
  }

  function validateDateRange() {
    elements.feedbackTo.setCustomValidity("");
    if (elements.feedbackFrom.value && elements.feedbackTo.value && elements.feedbackFrom.value > elements.feedbackTo.value) {
      elements.feedbackTo.setCustomValidity("结束日期不能早于开始日期。")
      elements.feedbackTo.reportValidity();
      return false;
    }
    return true;
  }

  async function loadFeedback() {
    if (!validateDateRange()) return;
    const requestId = ++state.feedbackRequest;
    state.feedback.filters = currentFilters();
    const query = { ...state.feedback.filters, page: String(state.feedback.page), pageSize: String(state.feedback.pageSize) };
    elements.feedbackLoading.hidden = false;
    elements.feedbackError.hidden = true;
    elements.feedbackEmpty.hidden = true;
    elements.feedbackContent.hidden = true;
    updateExportLink();
    try {
      const data = normalizeFeedback(await api.feedback(query));
      if (requestId !== state.feedbackRequest) return;
      Object.assign(state.feedback, data);
      renderFeedback();
      elements.feedbackLoading.hidden = true;
      if (data.items.length === 0) elements.feedbackEmpty.hidden = false;
      else elements.feedbackContent.hidden = false;
    } catch (error) {
      if (requestId !== state.feedbackRequest || error.status === 401) return;
      elements.feedbackLoading.hidden = true;
      elements.feedbackError.hidden = false;
      elements.feedbackError.querySelector("p").textContent = error.message;
    }
  }

  function renderFeedback() {
    elements.feedbackBody.replaceChildren();
    elements.feedbackTotal.textContent = `共 ${formatNumber(state.feedback.total)} 条反馈`;
    elements.pageStatus.textContent = `第 ${state.feedback.page} / ${state.feedback.totalPages} 页`;
    elements.pagePrevious.disabled = state.feedback.page <= 1;
    elements.pageNext.disabled = state.feedback.page >= state.feedback.totalPages;
    state.feedback.items.forEach((item) => elements.feedbackBody.append(feedbackRow(item)));
  }

  function feedbackRow(item) {
    const row = document.createElement("tr");
    row.dataset.feedbackId = item.id;
    const categoryCell = cell();
    const messageCell = cell("feedback-message-cell");
    const pathCell = cell();
    const createdCell = cell();
    const statusCell = cell();
    const actionCell = cell();

    const category = document.createElement("span");
    category.className = "category-badge";
    category.textContent = categoryLabels[item.category] || item.category;
    const message = document.createElement("strong");
    message.textContent = item.message;
    const contact = document.createElement("small");
    contact.textContent = item.contact ? "已提供联系方式" : "未提供联系方式";
    const path = document.createElement("span");
    path.className = "feedback-path";
    path.textContent = item.path;
    path.title = item.path;
    const status = statusSelect(item.status, item.id);
    const action = document.createElement("button");
    action.className = "row-action";
    action.type = "button";
    action.dataset.action = "detail";
    action.dataset.id = item.id;
    action.textContent = "查看";
    action.setAttribute("aria-label", `查看反馈：${item.message.slice(0, 30)}`);

    categoryCell.append(category);
    messageCell.append(message, contact);
    pathCell.append(path);
    createdCell.textContent = formatDateTime(item.createdAt);
    statusCell.append(status);
    actionCell.append(action);
    row.append(categoryCell, messageCell, pathCell, createdCell, statusCell, actionCell);
    return row;
  }

  function statusSelect(selected, id) {
    const select = document.createElement("select");
    select.className = "status-select";
    select.dataset.action = "status";
    select.dataset.id = id;
    select.setAttribute("aria-label", "处理状态");
    Object.entries(statusLabels).forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = selected === value;
      select.append(option);
    });
    return select;
  }

  async function updateInlineStatus(select) {
    const item = state.feedback.items.find((entry) => entry.id === select.dataset.id);
    if (!item || select.value === item.status) return;
    const previous = item.status;
    select.disabled = true;
    try {
      const response = await api.updateFeedback(item.id, { status: select.value });
      const updated = normalizeFeedbackItem(response.item ?? response.feedback ?? response);
      item.status = updated.status || select.value;
      select.value = item.status;
      showToast("处理状态已更新。");
      adjustNewFeedback(previous, item.status);
      if (state.feedback.filters.status && state.feedback.filters.status !== item.status) loadFeedback();
    } catch (error) {
      select.value = previous;
      showToast(error.message, true);
    } finally {
      select.disabled = false;
    }
  }

  async function openFeedback(id) {
    state.activeFeedback = null;
    state.dialogReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    elements.dialogLoading.hidden = false;
    elements.dialogError.hidden = true;
    elements.dialogContent.hidden = true;
    elements.dialogSaveError.hidden = true;
    if (!elements.dialog.open) elements.dialog.showModal();
    try {
      const detail = await api.feedbackDetail(id);
      const item = normalizeFeedbackItem(detail.item ?? detail.feedback ?? detail);
      state.activeFeedback = item;
      renderFeedbackDetail(item);
      elements.dialogLoading.hidden = true;
      elements.dialogContent.hidden = false;
      elements.dialogStatus.focus();
    } catch (error) {
      if (error.status === 401) return;
      elements.dialogLoading.hidden = true;
      elements.dialogError.hidden = false;
      elements.dialogError.querySelector("p").textContent = error.message;
    }
  }

  function renderFeedbackDetail(item) {
    elements.dialogCategory.textContent = categoryLabels[item.category] || item.category;
    elements.dialogCreated.textContent = formatDateTime(item.createdAt);
    elements.dialogMessage.textContent = item.message;
    elements.dialogPath.textContent = item.path;
    elements.dialogContact.textContent = item.contact || "未提供";
    elements.copyContact.hidden = !item.contact;
    elements.dialogLanguage.textContent = item.language === "en" ? "英文" : "中文";
    elements.dialogId.textContent = item.id;
    elements.dialogStatus.value = item.status;
    elements.dialogNote.value = item.internalNote;
  }

  async function saveDialogStatus(event) {
    event.preventDefault();
    const item = state.activeFeedback;
    const nextNote = elements.dialogNote.value.trim();
    if (!item || (elements.dialogStatus.value === item.status && nextNote === item.internalNote)) {
      elements.dialog.close();
      return;
    }
    const previous = item.status;
    elements.dialogSave.disabled = true;
    elements.dialogSave.textContent = "正在保存…";
    elements.dialogSaveError.hidden = true;
    try {
      const response = await api.updateFeedback(item.id, {
        status: elements.dialogStatus.value,
        internalNote: nextNote || null,
      });
      const updated = normalizeFeedbackItem(response.item ?? response.feedback ?? response);
      item.status = updated.status || elements.dialogStatus.value;
      item.internalNote = updated.internalNote;
      const listItem = state.feedback.items.find((entry) => entry.id === item.id);
      if (listItem) listItem.status = item.status;
      renderFeedback();
      elements.dialog.close();
      showToast("处理记录已保存。");
      adjustNewFeedback(previous, item.status);
      if (state.feedback.filters.status && state.feedback.filters.status !== item.status) loadFeedback();
    } catch (error) {
      elements.dialogSaveError.textContent = error.message;
      elements.dialogSaveError.hidden = false;
    } finally {
      elements.dialogSave.disabled = false;
      elements.dialogSave.textContent = "保存处理记录";
    }
  }

  async function copyContact() {
    if (!state.activeFeedback?.contact) return;
    try {
      await navigator.clipboard.writeText(state.activeFeedback.contact);
      showToast("联系方式已复制。");
    } catch {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(elements.dialogContact);
      selection.removeAllRanges();
      selection.addRange(range);
      showToast("已选中联系方式，请手动复制。");
    }
  }

  function resetFilters() {
    elements.feedbackFilters.reset();
    elements.feedbackTo.setCustomValidity("");
    state.feedback.page = 1;
    loadFeedback();
  }

  function adjustNewFeedback(previous, next) {
    if (!state.dashboard || previous === next) return;
    if (previous === "new") state.dashboard.newFeedback = Math.max(0, state.dashboard.newFeedback - 1);
    if (next === "new") state.dashboard.newFeedback += 1;
    renderDashboard(state.dashboard);
  }

  function updateExportLink() {
    elements.exportFeedback.dataset.filters = JSON.stringify(state.feedback.filters);
  }

  async function exportFeedback() {
    const previous = elements.exportFeedback.textContent;
    elements.exportFeedback.disabled = true;
    elements.exportFeedback.textContent = "正在导出…";
    try {
      const result = await api.feedbackExport(state.feedback.filters);
      const match = result.disposition.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i);
      const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
      const filename = match ? decodeURIComponent(match[1].replace(/^\"|\"$/g, "")) : `feedback-${today}.csv`;
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast("CSV 已导出。");
    } catch (error) {
      if (error.status !== 401) showToast(error.message, true);
    } finally {
      elements.exportFeedback.disabled = false;
      elements.exportFeedback.textContent = previous;
    }
  }

  function showToast(message, error = false) {
    window.clearTimeout(state.toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.toggle("is-error", error);
    elements.toast.hidden = false;
    state.toastTimer = window.setTimeout(() => { elements.toast.hidden = true; }, 3600);
  }

  elements.loginForm.addEventListener("submit", handleLogin);
  elements.logoutButton.addEventListener("click", handleLogout);
  elements.menuToggle.addEventListener("click", () => elements.sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar());
  elements.sidebarBackdrop.addEventListener("click", closeSidebar);
  document.querySelectorAll("[data-panel]").forEach((button) => button.addEventListener("click", () => switchPanel(button.dataset.panel)));
  document.querySelectorAll("[data-range]").forEach((button) => button.addEventListener("click", () => {
    state.range = button.dataset.range;
    document.querySelectorAll("[data-range]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    if (state.dashboard) renderDashboard(state.dashboard); else loadDashboard();
  }));
  document.querySelectorAll("[data-ranking]").forEach((button) => button.addEventListener("click", () => {
    state.ranking = button.dataset.ranking;
    document.querySelectorAll("[data-ranking]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderRanking();
  }));
  elements.dashboardRetry.addEventListener("click", loadDashboard);
  elements.feedbackFilters.addEventListener("submit", (event) => { event.preventDefault(); state.feedback.page = 1; loadFeedback(); });
  elements.filterReset.addEventListener("click", resetFilters);
  elements.feedbackEmptyReset.addEventListener("click", resetFilters);
  elements.feedbackRetry.addEventListener("click", loadFeedback);
  elements.feedbackPageSize.addEventListener("change", () => { state.feedback.pageSize = Number(elements.feedbackPageSize.value); state.feedback.page = 1; loadFeedback(); });
  elements.exportFeedback.addEventListener("click", exportFeedback);
  elements.pagePrevious.addEventListener("click", () => { if (state.feedback.page > 1) { state.feedback.page -= 1; loadFeedback(); } });
  elements.pageNext.addEventListener("click", () => { if (state.feedback.page < state.feedback.totalPages) { state.feedback.page += 1; loadFeedback(); } });
  elements.feedbackBody.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="detail"]');
    if (button) openFeedback(button.dataset.id);
  });
  elements.feedbackBody.addEventListener("change", (event) => {
    const select = event.target.closest('[data-action="status"]');
    if (select) updateInlineStatus(select);
  });
  elements.dialogClose.addEventListener("click", () => elements.dialog.close());
  elements.dialog.addEventListener("close", () => {
    if (state.dialogReturnFocus?.isConnected) state.dialogReturnFocus.focus();
    state.dialogReturnFocus = null;
  });
  elements.dialogStatusForm.addEventListener("submit", saveDialogStatus);
  elements.copyContact.addEventListener("click", copyContact);
  window.addEventListener("hashchange", () => { if (!elements.adminView.hidden) switchPanel(location.hash === "#feedback" ? "feedback" : "overview", false); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.sidebar.classList.contains("is-open")) {
      closeSidebar();
      elements.menuToggle.focus();
    }
  });

  boot();
})();
