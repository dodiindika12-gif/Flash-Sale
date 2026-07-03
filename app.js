const schedule = [
  {
    id: 1,
    start: "10:00",
    end: "12:00",
    brands: [{ name: "Skintific", discount: "35%", note: "Semua Produk" }],
  },
  {
    id: 2,
    start: "15:00",
    end: "17:00",
    brands: [
      { name: "Loreal", discount: "35%" },
      { name: "Garnier", discount: "35%" },
    ],
  },
  {
    id: 3,
    start: "19:00",
    end: "21:00",
    brands: [
      { name: "Maybelline", discount: "35%" },
      { name: "Glad2 Glow", discount: "35%" },
    ],
  },
];

const currentDayEl = document.getElementById("currentDay");
const currentTimeEl = document.getElementById("currentTime");
const activeCardEl = document.getElementById("activeCard");
const activeStatusEl = document.getElementById("activeStatus");
const activeTimeRangeEl = document.getElementById("activeTimeRange");
const activeUrgencyEl = document.getElementById("activeUrgency");
const activeBrandsEl = document.getElementById("activeBrands");
const countdownNoteEl = document.getElementById("countdownNote");
const comingSoonContentEl = document.getElementById("comingSoonContent");
const scheduleGridEl = document.getElementById("scheduleGrid");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function parseTimeToDate(time, baseDate = new Date()) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatClock(date) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDay(date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function getSlotState(slot, now) {
  const start = parseTimeToDate(slot.start, now);
  const end = parseTimeToDate(slot.end, now);

  if (now >= start && now < end) return "active";
  if (now >= end) return "past";
  return "upcoming";
}

function getActiveSlot(now) {
  return schedule.find((slot) => getSlotState(slot, now) === "active") || null;
}

function getNextSlot(now) {
  const upcoming = schedule.find((slot) => getSlotState(slot, now) === "upcoming");
  return upcoming || schedule[0];
}

function createBrandTile(brand) {
  return `
    <div class="brand-tile">
      <div class="brand-name">${brand.name}</div>
      <div class="discount-badge">
        <small>DISKON</small>
        <strong>${brand.discount}</strong>
        ${brand.note ? `<small>${brand.note}</small>` : ""}
      </div>
    </div>
  `;
}

function renderActive(now) {
  const activeSlot = getActiveSlot(now);
  const slot = activeSlot || getNextSlot(now);
  const targetTime = activeSlot ? parseTimeToDate(slot.end, now) : parseTimeToDate(slot.start, now);
  const remaining = formatDuration(targetTime - now);

  hoursEl.textContent = remaining.hours;
  minutesEl.textContent = remaining.minutes;
  secondsEl.textContent = remaining.seconds;

  activeTimeRangeEl.textContent = `${slot.start} - ${slot.end}`;
  activeBrandsEl.innerHTML = slot.brands.map(createBrandTile).join("");

  if (activeSlot) {
    activeCardEl.classList.remove("no-active");
    activeStatusEl.textContent = "SEDANG BERLANGSUNG";
    activeUrgencyEl.textContent = "Jangan sampai kelewatan! Belanja sekarang sebelum waktunya habis.";
    countdownNoteEl.textContent = `Promo berakhir pukul ${slot.end}. Ambil produknya sekarang.`;
  } else {
    activeCardEl.classList.add("no-active");
    activeStatusEl.textContent = "SEGERA MULAI";
    activeUrgencyEl.textContent = "Siapkan keranjangmu. Flash sale berikutnya segera dimulai.";
    countdownNoteEl.textContent = `Flash sale berikutnya mulai pukul ${slot.start}.`;
  }
}

function renderComingSoon(now) {
  const activeSlot = getActiveSlot(now);
  let comingSlot = null;

  if (activeSlot) {
    comingSlot = schedule.find((slot) => parseTimeToDate(slot.start, now) > now) || schedule[0];
  } else {
    comingSlot = getNextSlot(now);
  }

  const comingTime = `${comingSlot.start} - ${comingSlot.end}`;
  const comingItems = comingSlot.brands
    .map(
      (brand) => `
        <div class="coming-item">
          <strong>${brand.name}</strong>
          <span>${brand.discount}</span>
        </div>
      `
    )
    .join("");

  comingSoonContentEl.innerHTML = `
    <div class="coming-time">${comingTime}</div>
    <div class="coming-list">${comingItems}</div>
    <p class="next-note">⚡ Siapkan keranjangmu dari sekarang.</p>
  `;
}

function renderSchedule(now) {
  scheduleGridEl.innerHTML = schedule
    .map((slot) => {
      const state = getSlotState(slot, now);
      const statusLabel =
        state === "active" ? "Sedang Berlangsung" : state === "past" ? "Selesai" : "Akan Datang";
      const chips = slot.brands
        .map(
          (brand) => `<span class="brand-chip">${brand.name} <small>${brand.discount}${brand.note ? ` · ${brand.note}` : ""}</small></span>`
        )
        .join("");

      return `
        <article class="schedule-card ${state}">
          <div class="schedule-meta">
            <span class="slot-badge">${slot.id}</span>
            <span class="slot-status">${statusLabel}</span>
          </div>
          <h3 class="schedule-time">${slot.start} - ${slot.end}</h3>
          <div class="schedule-brands">${chips}</div>
        </article>
      `;
    })
    .join("");
}

function tick() {
  const now = new Date();
  currentDayEl.textContent = formatDay(now);
  currentTimeEl.textContent = formatClock(now);
  renderActive(now);
  renderComingSoon(now);
  renderSchedule(now);
}

tick();
setInterval(tick, 1000);
