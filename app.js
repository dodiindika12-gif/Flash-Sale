const schedule = [
  {
    time: "10:00 - 12:00",
    start: "10:00",
    end: "12:00",
    brands: ["SKINTIFIC"],
    discount: "35%",
    note: "SEMUA PRODUK"
  },
  {
    time: "15:00 - 17:00",
    start: "15:00",
    end: "17:00",
    brands: ["L'ORÉAL", "GARNIER"],
    discount: "35%",
    note: ""
  },
  {
    time: "19:00 - 21:00",
    start: "19:00",
    end: "21:00",
    brands: ["MAYBELLINE NEW YORK", "Glad2Glow"],
    discount: "35%",
    note: ""
  }
];

const byId = (id) => document.getElementById(id);

function brandClass(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("garnier")) return "garnier";
  if (normalized.includes("maybelline")) return "maybelline";
  if (normalized.includes("glad")) return "glad2glow";
  if (normalized.includes("skintific")) return "skintific";
  return "loreal";
}

function brandMarkup(name) {
  return `<div class="wordmark ${brandClass(name)}">${name}</div>`;
}

function discountMarkup(discount) {
  return `
    <div class="discount-block">
      <span>DISKON</span>
      <strong>${discount.replace("%", "<small>%</small>")}</strong>
    </div>
  `;
}

function timeToDate(time, base = new Date()) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(base);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function getStatus(item, now) {
  const start = timeToDate(item.start, now);
  const end = timeToDate(item.end, now);
  if (now >= start && now < end) return "active";
  if (now < start) return "upcoming";
  return "ended";
}

function getDisplayItems(now) {
  const enriched = schedule.map((item) => ({
    ...item,
    status: getStatus(item, now),
    startDate: timeToDate(item.start, now),
    endDate: timeToDate(item.end, now)
  }));

  const active = enriched.find((item) => item.status === "active");
  const nextToday = enriched.find((item) => item.status === "upcoming");
  const fallback = { ...enriched[0] };
  fallback.startDate = timeToDate(fallback.start, new Date(now.getTime() + 86400000));
  fallback.endDate = timeToDate(fallback.end, new Date(now.getTime() + 86400000));
  fallback.status = "upcoming";

  return {
    enriched,
    active: active || nextToday || fallback,
    next: active ? nextToday || fallback : nextToday || fallback,
    hasActive: Boolean(active)
  };
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function renderActive(item, hasActive, now) {
  byId("activeBadge").textContent = hasActive ? "Sedang Berlangsung" : "Akan Datang";
  byId("activeTime").textContent = item.time;
  byId("countdownLabel").textContent = hasActive ? "Berakhir dalam" : "Dimulai dalam";

  const target = hasActive ? item.endDate : item.startDate;
  byId("mainCountdown").textContent = formatDuration(target - now);

  byId("activeBrands").innerHTML = item.brands
    .map((brand) => `
      <div class="deal-card">
        ${brandMarkup(brand)}
        ${discountMarkup(item.discount)}
      </div>
    `)
    .join("");
}

function renderComing(item) {
  byId("nextTime").textContent = item.time;
  byId("nextBrands").innerHTML = item.brands
    .map((brand) => `
      <div class="coming-row">
        ${brandMarkup(brand)}
        <div class="mini-discount"><span>DISKON</span>${item.discount}</div>
      </div>
    `)
    .join("");
}

function renderSchedule(items) {
  byId("scheduleList").innerHTML = items
    .map((item, index) => {
      const statusText = item.status === "active"
        ? "⚡ Sedang Berlangsung"
        : item.status === "upcoming"
          ? "Akan Datang"
          : "Selesai";

      return `
        <article class="schedule-item is-${item.status}">
          <div class="schedule-status">${statusText}</div>
          <div class="schedule-num">${index + 1}</div>
          <div class="schedule-main">
            <div class="schedule-time">◷ ${item.time}</div>
            <div class="schedule-brands">
              ${item.brands.map(brandMarkup).join("")}
            </div>
          </div>
          <div class="schedule-discount">
            <span>DISKON</span>
            ${item.discount}
            ${item.note ? `<small>${item.note}</small>` : ""}
          </div>
        </article>
      `;
    })
    .join("");
}

function tick() {
  const now = new Date();
  const { enriched, active, next, hasActive } = getDisplayItems(now);
  renderActive(active, hasActive, now);
  renderComing(next);
  renderSchedule(enriched);
}

tick();
setInterval(tick, 1000);
