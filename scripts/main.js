// Minimal JS: wire form endpoint from config, AJAX-submit to keep user on page.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const cfg = window.METRIC_CONFIG || {};
  if (cfg.formEndpoint && !form.getAttribute("action")) {
    form.setAttribute("action", cfg.formEndpoint);
  }

  form.addEventListener("submit", async (e) => {
    // Honeypot — silently drop if filled
    if (form.elements["website"] && form.elements["website"].value) {
      e.preventDefault();
      return;
    }

    if (!cfg.formEndpoint || cfg.formEndpoint.includes("REPLACE_WITH_FORM_ID")) {
      // Not configured — let native submit/mailto handle it.
      return;
    }

    e.preventDefault();
    const status = document.getElementById("form-status");
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        form.reset();
        if (status) status.textContent = "Thanks — we'll be in touch shortly.";
        btn.textContent = "Sent ✓";
      } else {
        if (status) status.textContent = "Something went wrong. Please email founders@metricbio.tech directly.";
        btn.textContent = "Send";
        btn.disabled = false;
      }
    } catch (err) {
      if (status) status.textContent = "Network error. Please email founders@metricbio.tech directly.";
      btn.textContent = "Send";
      btn.disabled = false;
    }
  });
});
