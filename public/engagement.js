(function () {
  "use strict";

  var root = document.querySelector('[data-static-component="engagement"]');
  if (!root || window.location.protocol === "file:") return;

  var apiUrl = String(root.dataset.apiUrl || "").replace(/\/+$/, "");
  try {
    var parsedApiUrl = new URL(apiUrl);
    if (parsedApiUrl.protocol !== "https:" && parsedApiUrl.protocol !== "http:") return;
  } catch {
    return;
  }

  var siteVisits = root.querySelector("[data-engagement-site-visits]");
  var pageViews = root.querySelector("[data-engagement-page-views]");
  var helpfulButton = root.querySelector("[data-engagement-helpful]");
  var helpfulCount = root.querySelector("[data-engagement-helpful-count]");
  var engagementStatus = root.querySelector("[data-engagement-status]");
  var feedbackDialog = root.querySelector("[data-feedback-dialog]");
  var feedbackForm = root.querySelector("[data-feedback-form]");
  var feedbackStatus = root.querySelector("[data-feedback-status]");
  var feedbackPage = root.querySelector("[data-feedback-page]");
  var feedbackSubmit = root.querySelector("[data-feedback-submit]");
  var feedbackCopy = root.querySelector("[data-feedback-copy]");
  var liked = false;
  var likeBusy = false;

  function canonicalPath() {
    var value = document.documentElement.dataset.staticRoute || window.location.pathname || "/";
    try { value = decodeURIComponent(value); } catch {}
    value = String(value).split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
    return value.startsWith("/") ? value : "/" + value;
  }

  var pagePath = canonicalPath();

  function randomToken() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      var bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 15) | 64;
      bytes[8] = (bytes[8] & 63) | 128;
      var hex = Array.prototype.map.call(bytes, function (value) { return value.toString(16).padStart(2, "0"); });
      return hex.slice(0, 4).join("") + "-" + hex.slice(4, 6).join("") + "-" + hex.slice(6, 8).join("") + "-" + hex.slice(8, 10).join("") + "-" + hex.slice(10).join("");
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (character) {
      var random = Math.floor(Math.random() * 16);
      return (character === "x" ? random : (random & 3) | 8).toString(16);
    });
  }

  function storageToken(key, initialValue) {
    try {
      var stored = window.localStorage.getItem(key);
      if (stored && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(stored)) return stored;
      var value = initialValue || randomToken();
      window.localStorage.setItem(key, value);
      return value;
    } catch {
      return initialValue || randomToken();
    }
  }

  function localDay() {
    var now = new Date();
    var local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  var day = localDay();
  var dailyToken = storageToken("iml:visit:" + day);
  var voteToken = storageToken("iml:helpful:" + pagePath);

  function formatCount(value) {
    var number = Number(value);
    if (!Number.isFinite(number) || number < 0) return "—";
    return Math.round(number).toLocaleString(document.documentElement.dataset.language === "en" ? "en-US" : "zh-CN");
  }

  function setBilingualStatus(node, zh, en) {
    if (!node) return;
    node.replaceChildren();
    if (!zh && !en) return;
    var chinese = document.createElement("span");
    chinese.className = "lang-zh";
    chinese.textContent = zh;
    var english = document.createElement("span");
    english.className = "lang-en";
    english.textContent = en;
    node.append(chinese, english);
  }

  function endpoint(path) {
    return apiUrl + path;
  }

  async function request(path, options) {
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, 8000) : null;
    try {
      var response = await fetch(endpoint(path), Object.assign({
        mode: "cors",
        cache: "no-store",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        signal: controller ? controller.signal : undefined,
      }, options || {}));
      var body = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        var error = new Error(body && body.message ? String(body.message) : "Request failed");
        error.code = body && body.code ? String(body.code) : "request_failed";
        error.status = response.status;
        throw error;
      }
      return body;
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  function updateStats(data) {
    if (!data || typeof data !== "object") return;
    if (siteVisits) siteVisits.textContent = formatCount(data.siteVisits);
    if (pageViews) pageViews.textContent = formatCount(data.pageViews);
    if (helpfulCount) helpfulCount.textContent = formatCount(data.likes);
    if (typeof data.liked === "boolean") liked = data.liked;
    if (helpfulButton) {
      helpfulButton.setAttribute("aria-pressed", liked ? "true" : "false");
      helpfulButton.classList.toggle("active", liked);
    }
  }

  async function loadStats() {
    root.hidden = false;
    root.dataset.state = "loading";
    try {
      await request("/v1/view", {
        method: "POST",
        body: JSON.stringify({ path: pagePath, visitorId: dailyToken }),
      });
      var query = new URLSearchParams({ path: pagePath, visitorId: voteToken });
      var data = await request("/v1/stats?" + query.toString(), { method: "GET", headers: {} });
      updateStats(data);
      root.dataset.state = "ready";
    } catch {
      root.dataset.state = "unavailable";
    }
  }

  if (helpfulButton) helpfulButton.addEventListener("click", async function () {
    if (likeBusy) return;
    var nextLiked = !liked;
    likeBusy = true;
    helpfulButton.disabled = true;
    helpfulButton.setAttribute("aria-busy", "true");
    setBilingualStatus(engagementStatus, "", "");
    try {
      var data = await request("/v1/like", {
        method: "POST",
        body: JSON.stringify({ path: pagePath, visitorId: voteToken, active: nextLiked }),
      });
      updateStats(data);
      setBilingualStatus(
        engagementStatus,
        data.liked ? "已标记为有用。" : "已取消标记。",
        data.liked ? "Marked as useful." : "Mark removed.",
      );
    } catch {
      setBilingualStatus(engagementStatus, "暂时无法提交，请稍后再试。", "Unable to submit right now. Please try again later.");
    } finally {
      likeBusy = false;
      helpfulButton.disabled = false;
      helpfulButton.removeAttribute("aria-busy");
    }
  });

  function openFeedback() {
    if (!feedbackDialog || !feedbackForm) return;
    if (feedbackPage) feedbackPage.textContent = pagePath;
    feedbackForm.dataset.submissionId = feedbackForm.dataset.submissionId || randomToken();
    if (feedbackCopy) feedbackCopy.hidden = true;
    setBilingualStatus(feedbackStatus, "", "");
    if (typeof feedbackDialog.showModal === "function") feedbackDialog.showModal();
    else feedbackDialog.setAttribute("open", "");
    var firstField = feedbackForm.querySelector("select, textarea, input");
    if (firstField) firstField.focus();
  }

  function closeFeedback() {
    if (!feedbackDialog) return;
    if (typeof feedbackDialog.close === "function") feedbackDialog.close();
    else feedbackDialog.removeAttribute("open");
  }

  root.querySelectorAll("[data-feedback-open]").forEach(function (button) { button.addEventListener("click", openFeedback); });
  root.querySelectorAll("[data-feedback-close]").forEach(function (button) { button.addEventListener("click", closeFeedback); });

  if (feedbackCopy) feedbackCopy.addEventListener("click", async function () {
    var textarea = feedbackForm && feedbackForm.elements.namedItem("message");
    var message = textarea && "value" in textarea ? String(textarea.value) : "";
    try {
      await navigator.clipboard.writeText(message);
      setBilingualStatus(feedbackStatus, "留言已复制。", "Message copied.");
    } catch {
      if (textarea && typeof textarea.select === "function") textarea.select();
      setBilingualStatus(feedbackStatus, "请使用系统复制命令。", "Use your system copy command.");
    }
  });

  if (feedbackForm) feedbackForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!feedbackForm.checkValidity()) {
      feedbackForm.reportValidity();
      return;
    }
    var formData = new FormData(feedbackForm);
    var message = String(formData.get("message") || "").trim();
    var links = message.match(/https?:\/\/\S+/gi) || [];
    if (links.length > 2) {
      setBilingualStatus(feedbackStatus, "留言最多附两个链接。", "Please include no more than two links.");
      return;
    }
    feedbackSubmit.disabled = true;
    feedbackSubmit.setAttribute("aria-busy", "true");
    if (feedbackCopy) feedbackCopy.hidden = true;
    setBilingualStatus(feedbackStatus, "正在提交…", "Submitting…");
    try {
      var data = await request("/v1/feedback", {
        method: "POST",
        body: JSON.stringify({
          path: pagePath,
          visitorId: dailyToken,
          submissionId: feedbackForm.dataset.submissionId || randomToken(),
          category: String(formData.get("category") || "other"),
          message: message,
          contact: String(formData.get("contact") || "").trim(),
          website: String(formData.get("website") || ""),
          language: document.documentElement.dataset.language === "en" ? "en" : "zh-CN",
        }),
      });
      feedbackForm.reset();
      feedbackForm.dataset.submissionId = "";
      setBilingualStatus(feedbackStatus, "已收到，编号 " + data.receiptId + "。", "Received. Reference " + data.receiptId + ".");
    } catch (error) {
      if (feedbackCopy) feedbackCopy.hidden = false;
      if (error && error.status === 429) {
        setBilingualStatus(feedbackStatus, "提交次数过多，请稍后再试。", "Too many submissions. Please try again later.");
      } else {
        setBilingualStatus(feedbackStatus, "暂时无法提交，留言内容已保留。", "Unable to submit right now. Your message has been kept in the form.");
      }
    } finally {
      feedbackSubmit.disabled = false;
      feedbackSubmit.removeAttribute("aria-busy");
    }
  });

  loadStats();
})();
