const works = [
  {
    type: "video",
    title: "F",
    subtitle: "Sonic Art / Moving Image",
    year: "2026",
    cover: "assets/covers/f.jpg",
    videoUrl: "https://kris041555.github.io/portfolio/assets/videos/f.mp4",
    description: "Sonic art film F.",
  },
  {
    type: "video",
    title: "I",
    subtitle: "Sonic Art / Moving Image",
    year: "2025",
    cover: "assets/covers/i.jpg",
    videoUrl: "https://kris041555.github.io/portfolio/assets/videos/i.mp4",
    description: "Sonic art film I.",
  },
  {
    type: "video",
    title: "L",
    subtitle: "Sonic Art / Moving Image",
    year: "2025",
    cover: "assets/covers/l.jpg",
    videoUrl: "https://kris041555.github.io/portfolio/assets/videos/l.mp4",
    description: "Sonic art film L.",
  },
  {
    type: "video",
    title: "M",
    subtitle: "Sonic Art / Moving Image",
    year: "2024",
    cover: "assets/covers/m.jpg",
    videoUrl: "https://kris041555.github.io/portfolio/assets/videos/m.mp4",
    description: "Sonic art film M.",
  },
  {
    type: "song",
    title: "Alarm",
    subtitle: "Electronic / Single",
    year: "Single",
    cover: "assets/covers/alarm.jpg",
    audioUrl: "assets/audio/alarm.m4a",
    duration: "3:14",
  },
  {
    type: "song",
    title: "echelon",
    subtitle: "Alternative / Single",
    year: "Single",
    cover: "assets/covers/echelon.jpg",
    audioUrl: "assets/audio/echelon.m4a",
    duration: "2:56",
  },
  {
    type: "song",
    title: "No One Helps Me Now",
    subtitle: "Electronic / Vocal",
    year: "Single",
    cover: "assets/covers/no-one-helps-me-now.jpg",
    audioUrl: "assets/audio/no-one-helps-me-now.m4a",
    duration: "3:19",
  },
  {
    type: "song",
    title: "alone",
    subtitle: "Ambient / Single",
    year: "Single",
    cover: "assets/covers/alone.jpg",
    audioUrl: "assets/audio/alone.m4a",
    duration: "3:29",
  },
  {
    type: "song",
    title: "beside",
    subtitle: "Alternative / Single",
    year: "Single",
    cover: "assets/covers/beside.jpg",
    audioUrl: "assets/audio/beside.m4a",
    duration: "3:51",
  },
  {
    type: "song",
    title: "go no clue",
    subtitle: "Indie / Single",
    year: "Single",
    cover: "assets/covers/go-no-clue.jpg",
    audioUrl: "assets/audio/go-no-clue.m4a",
    duration: "2:39",
  },
];

const playIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m8 5 10 7-10 7V5Z" />
  </svg>`;
const filmIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
    <path d="m10 9 5 3-5 3V9Z"></path>
  </svg>`;

const coverGrid = document.querySelector("[data-cover-grid]");
const mediaModal = document.querySelector("[data-media-modal]");
const modalPanel = mediaModal.querySelector(".media-modal__panel");
const modalContent = document.querySelector("[data-modal-content]");
const audio = document.querySelector("[data-audio]");
const player = document.querySelector("[data-player]");
const progress = document.querySelector("[data-player-progress]");
const playerCurrent = document.querySelector("[data-player-current]");
const playerDuration = document.querySelector("[data-player-duration]");
const header = document.querySelector("[data-site-header]");

let currentTrackIndex = 4;
let activeWorkIndex = null;
let lastFocused = null;
let closeTimer = null;
let audioAnimationFrame = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(value) {
  const inverse = 1 - value;
  return 1 - inverse * inverse * inverse;
}

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderWorks() {
  const videoGroup = coverGrid.querySelector('[data-work-group="video"]');
  const songGroup = coverGrid.querySelector('[data-work-group="song"]');

  const renderCard = (work, index) => `
    <button
      class="work-card"
      type="button"
      data-work-index="${index}"
      aria-label="${work.type === "song" ? "播放" : "播放视频"}：${escapeHtml(work.title)}"
      style="--card-index:${index}"
    >
      <span class="work-card__media">
        <img
          src="${escapeHtml(work.cover)}"
          alt=""
          ${index < 4 ? 'fetchpriority="high"' : 'loading="lazy"'}
          decoding="async"
        />
        <span class="work-card__type">
          ${work.type === "song" ? playIcon : filmIcon}
          ${work.type === "song" ? "Music" : "Film"}
        </span>
      </span>
      <span class="work-card__caption">
        <span class="work-card__index">${String(index + 1).padStart(2, "0")}</span>
      </span>
    </button>
  `;

  videoGroup.innerHTML = works
    .map((work, index) => ({ work, index }))
    .filter(({ work }) => work.type === "video")
    .map(({ work, index }) => renderCard(work, index))
    .join("");

  songGroup.innerHTML = works
    .map((work, index) => ({ work, index }))
    .filter(({ work }) => work.type === "song")
    .map(({ work, index }) => renderCard(work, index))
    .join("");

  coverGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-work-index]");
    if (!card) return;
    openWork(Number(card.dataset.workIndex));
  });
}

function buildWaveformBars(title, count = 74) {
  let seed = 0;
  for (const character of title) seed = (seed * 31 + character.charCodeAt(0)) % 9973;
  return Array.from({ length: count }, (_, index) => {
    seed = (seed * 9301 + 49297) % 233280;
    const noise = seed / 233280;
    const envelope = 0.42 + Math.sin((index / count) * Math.PI) * 0.58;
    return Math.round(18 + noise * 74 * envelope);
  });
}

function renderAudioModal(work) {
  const bars = buildWaveformBars(work.title);
  return `
    <div class="media-view audio-view" data-audio-view>
      <div class="media-view__art">
        <img src="${escapeHtml(work.cover)}" alt="${escapeHtml(work.title)} 封面" />
      </div>
      <div class="media-view__body">
        <div class="media-view__meta">
          <p>${escapeHtml(work.subtitle)}</p>
          <p>${escapeHtml(work.year)}</p>
        </div>
        <h2 class="sr-only" id="media-title">${escapeHtml(work.title)}</h2>
        <p class="media-view__subtitle">Produced, arranged and mixed by RAM</p>
        <div class="audio-view__player">
          <div class="waveform" data-waveform aria-hidden="true">
            ${bars
              .map(
                (height, index) => `
                  <span
                    style="--bar-height:${height}%;--bar-index:${index}"
                    data-wave-bar
                  ></span>
                `,
              )
              .join("")}
          </div>
          <div class="audio-view__controls">
            <span class="audio-view__time" data-audio-time>${escapeHtml(work.duration || "0:12")}</span>
            <div class="audio-view__buttons">
              <button class="icon-button" type="button" data-track-prev aria-label="上一首">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 20 9 12l10-8v16ZM5 19V5" />
                </svg>
              </button>
              <button class="icon-button icon-button--solid" type="button" data-audio-toggle aria-label="播放">
                <svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m7 4 13 8-13 8V4Z" />
                </svg>
                <svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14M16 5v14" />
                </svg>
              </button>
              <button class="icon-button" type="button" data-track-next aria-label="下一首">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m5 4 10 8-10 8V4ZM19 5v14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderVideoModal(work) {
  return `
    <div class="media-view media-view--video">
      <div class="media-view__art">
        <video
          data-modal-video
          src="${escapeHtml(work.videoUrl)}"
          poster="${escapeHtml(work.cover)}"
          controls
          autoplay
          playsinline
          preload="auto"
        ></video>
        <div class="video-fallback" data-video-fallback>
          <img src="${escapeHtml(work.cover)}" alt="" />
        </div>
      </div>
      <h2 class="sr-only" id="media-title">${escapeHtml(work.title)}</h2>
      <div class="media-view__footer">
        <p>${escapeHtml(work.subtitle)}</p>
        <p>${escapeHtml(work.year)}</p>
      </div>
      <div class="media-view__footer">
        <p>${escapeHtml(work.description)}</p>
        <p>${escapeHtml(work.year)}</p>
      </div>
    </div>
  `;
}

function openWork(index, autoplay = true) {
  const work = works[index];
  if (!work) return;

  if (closeTimer) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }

  activeWorkIndex = index;
  lastFocused = document.activeElement;
  modalContent.innerHTML =
    work.type === "song" ? renderAudioModal(work) : renderVideoModal(work);

  mediaModal.classList.add("is-open");
  mediaModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalPanel.scrollTop = 0;

  if (work.type === "song") {
    bindAudioModal();
    if (autoplay) playTrack(index);
    updateAudioModal();
  } else {
    bindVideoModal();
  }

  window.requestAnimationFrame(() => modalPanel.focus());
}

function closeModal() {
  if (!mediaModal.classList.contains("is-open")) return;

  const video = modalContent.querySelector("[data-modal-video]");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  mediaModal.classList.remove("is-open");
  mediaModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeWorkIndex = null;

  closeTimer = window.setTimeout(() => {
    modalContent.innerHTML = "";
  }, 430);

  if (lastFocused instanceof HTMLElement) lastFocused.focus();
}

function bindAudioModal() {
  const view = modalContent.querySelector("[data-audio-view]");
  const toggle = view.querySelector("[data-audio-toggle]");
  const previous = view.querySelector("[data-track-prev]");
  const next = view.querySelector("[data-track-next]");

  toggle.addEventListener("click", () => {
    if (audio.src) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      playTrack(currentTrackIndex);
    }
  });
  previous.addEventListener("click", () => stepTrack(-1));
  next.addEventListener("click", () => stepTrack(1));
}

function bindVideoModal() {
  const video = modalContent.querySelector("[data-modal-video]");
  const fallback = modalContent.querySelector("[data-video-fallback]");
  if (!video || !fallback) return;

  video.addEventListener("loadeddata", () => fallback.classList.remove("is-visible"));
  video.addEventListener("error", () => fallback.classList.add("is-visible"));
  video.load();
  video.play().catch(() => {
    fallback.classList.add("is-visible");
  });
}

function loadTrack(index, autoplay = true) {
  const bounded = (index + works.length) % works.length;
  const work = works[bounded];
  if (!work || work.type !== "song") return;

  currentTrackIndex = bounded;
  audio.src = work.audioUrl;
  audio.load();
  updatePlayerTrack();
  player.classList.add("is-visible");

  if (autoplay) {
    audio.play().catch(() => {
      player.classList.remove("is-playing");
    });
  }
}

function playTrack(index) {
  const work = works[index];
  if (!work || work.type !== "song") return;

  if (currentTrackIndex === index && audio.src) {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    return;
  }

  loadTrack(index, true);
}

function stepTrack(direction) {
  let nextIndex = currentTrackIndex;
  do {
    nextIndex = (nextIndex + direction + works.length) % works.length;
  } while (works[nextIndex].type !== "song");

  if (activeWorkIndex !== null && works[activeWorkIndex]?.type === "song") {
    openWork(nextIndex, true);
  } else {
    loadTrack(nextIndex, true);
  }
}

function updatePlayerTrack() {
  const work = works[currentTrackIndex];
  if (!work) return;
  player.querySelector("[data-player-cover]").src = work.cover;
  player.querySelector("[data-player-title]").textContent = work.title;
  player.querySelector("[data-player-type]").textContent = work.subtitle;
  playerDuration.textContent = work.duration || "0:12";
}

function updateAudioModal() {
  const view = modalContent.querySelector("[data-audio-view]");
  if (!view) return;
  const work = works[currentTrackIndex];
  view.classList.toggle("is-playing", !audio.paused);
  view.querySelector("[data-audio-time]").textContent = work?.duration || "0:12";
  updateWaveform();
}

function updateWaveform() {
  const bars = modalContent.querySelectorAll("[data-wave-bar]");
  if (!bars.length) return;
  const duration = Number.isFinite(audio.duration) ? audio.duration : 12;
  const progressValue = duration ? clamp(audio.currentTime / duration) : 0;
  bars.forEach((bar, index) => {
    bar.classList.toggle("is-active", index / bars.length <= progressValue);
  });
}

function syncAudioState() {
  const isPlaying = !audio.paused && !audio.ended;
  player.classList.toggle("is-playing", isPlaying);
  player.setAttribute("aria-hidden", String(!player.classList.contains("is-visible")));

  const view = modalContent.querySelector("[data-audio-view]");
  if (view) {
    view.classList.toggle("is-playing", isPlaying);
  }

  if (!isPlaying && audioAnimationFrame) {
    window.cancelAnimationFrame(audioAnimationFrame);
    audioAnimationFrame = null;
  }
  if (isPlaying && !audioAnimationFrame) {
    const animate = () => {
      updateWaveform();
      audioAnimationFrame = window.requestAnimationFrame(animate);
    };
    audioAnimationFrame = window.requestAnimationFrame(animate);
  }
}

function syncTimeline() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 12;
  const value = duration ? (audio.currentTime / duration) * 1000 : 0;
  progress.value = String(Math.round(value));
  playerCurrent.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration)) {
    playerDuration.textContent = formatTime(audio.duration);
  }
}

function setupAudio() {
  audio.volume = 1;
  updatePlayerTrack();

  audio.addEventListener("play", syncAudioState);
  audio.addEventListener("pause", syncAudioState);
  audio.addEventListener("ended", () => stepTrack(1));
  audio.addEventListener("timeupdate", syncTimeline);
  audio.addEventListener("loadedmetadata", syncTimeline);
  audio.addEventListener("durationchange", syncTimeline);

  document.querySelector("[data-player-toggle]").addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });
  document.querySelector("[data-player-prev]").addEventListener("click", () => stepTrack(-1));
  document.querySelector("[data-player-next]").addEventListener("click", () => stepTrack(1));
  document.querySelector("[data-player-open]").addEventListener("click", () => {
    openWork(currentTrackIndex, true);
  });
  document.querySelector("[data-player-mute]").addEventListener("click", (event) => {
    audio.muted = !audio.muted;
    player.classList.toggle("is-muted", audio.muted);
    event.currentTarget.setAttribute("aria-label", audio.muted ? "取消静音" : "静音");
  });

  progress.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
    syncTimeline();
    updateWaveform();
  });
}

function setupModal() {
  mediaModal.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key !== "Tab" || !mediaModal.classList.contains("is-open")) return;

    const focusable = [
      ...modalPanel.querySelectorAll(
        'button, [href], input, select, textarea, video[controls], [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((element) => !element.hasAttribute("disabled"));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function setupConvergence() {
  const section = document.querySelector(".convergence");
  const stage = document.querySelector(".convergence__stage");
  const grid = document.querySelector("[data-cover-grid]");
  const hero = document.querySelector("[data-hero-copy]");
  const counter = document.querySelector(".convergence__counter");
  const cards = [...grid.querySelectorAll(".work-card")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let desktop = window.matchMedia("(min-width: 981px)").matches;
  let metrics = [];
  let frame = 0;
  let scrollRange = 1;
  let lastProgress = -1;

  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  const scatterAnchors = [
    [0.30, 0.08],
    [0.50, 0.08],
    [0.70, 0.08],
    [0.965, 0.34],
    [0.965, 0.66],
    [0.70, 0.93],
    [0.50, 0.93],
    [0.30, 0.93],
    [0.035, 0.66],
    [0.035, 0.34],
  ];
  const rotations = [-5, 3, -4, 6, -5, 4, -6, 5, -4, 6];

  function clearMotion() {
    grid.classList.remove("motion-ready");
    grid.style.removeProperty("--caption-opacity");
    lastProgress = -1;
    cards.forEach((card) => {
      card.style.removeProperty("transform");
      card.style.removeProperty("opacity");
      card.classList.remove("is-visible");
    });
  }

  function measureMotion() {
    const stageRect = stage.getBoundingClientRect();
    scrollRange = Math.max(1, section.offsetHeight - stage.offsetHeight);
    metrics = cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      const currentCenterX = rect.left - stageRect.left + rect.width / 2;
      const currentCenterY = rect.top - stageRect.top + rect.height / 2;
      const anchor = scatterAnchors[index];
      const startX = stageRect.width * anchor[0];
      const startY = stageRect.height * anchor[1];
      const dx = startX - currentCenterX;
      const dy = startY - currentCenterY;
      return {
        card,
        dx,
        dy,
        rotation: rotations[index],
        scale: 0.78,
        bowX: (anchor[0] - 0.5) * 120,
        bowY: (anchor[1] - 0.5) * 90,
        delay: (index % 5) * 0.018 + Math.floor(index / 5) * 0.025,
      };
    });
    grid.classList.add("motion-ready");
  }

  function paintDesktop() {
    const rect = section.getBoundingClientRect();
    const progressValue = clamp(-rect.top / scrollRange);
    if (Math.abs(progressValue - lastProgress) < 0.0005) {
      frame = 0;
      return;
    }
    lastProgress = progressValue;
    const heroOpacity = clamp(1 - progressValue * 2.55);
    const heroScale = 1 + progressValue * 0.06;

    hero.style.opacity = String(heroOpacity);
    hero.style.transform = `translate(-50%, -50%) scale(${heroScale})`;
    counter.style.opacity = String(clamp((progressValue - 0.68) / 0.24));
    grid.style.setProperty(
      "--caption-opacity",
      clamp((progressValue - 0.42) / 0.34).toFixed(3),
    );

    metrics.forEach((metric) => {
      const local = easeOutCubic(clamp((progressValue - metric.delay) / (1 - metric.delay)));
      const bow = Math.sin(Math.PI * local);
      const tx = metric.dx * (1 - local) + metric.bowX * bow;
      const ty = metric.dy * (1 - local) + metric.bowY * bow;
      const rotation = metric.rotation * (1 - local);
      const scale = metric.scale + (1 - metric.scale) * local;
      const cardOpacity = 0.90 + local * 0.10;

      metric.card.style.transform =
        `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) ` +
        `rotate(${rotation.toFixed(3)}deg) scale(${scale.toFixed(3)})`;
      metric.card.style.opacity = cardOpacity.toFixed(3);
    });

    frame = 0;
  }

  function schedulePaint() {
    if (!desktop || frame) return;
    frame = window.requestAnimationFrame(paintDesktop);
  }

  function setupMobileReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );

    cards.forEach((card, index) => {
      card.style.setProperty("--mobile-dx", `${index % 2 === 0 ? -18 : 18}px`);
      card.style.setProperty("--mobile-rot", `${index % 3 === 0 ? -2.5 : index % 3 === 1 ? 1.5 : -1}deg`);
      observer.observe(card);
    });
    return observer;
  }

  clearMotion();
  measureMotion();
  schedulePaint();
  let mobileObserver = !desktop && !reduceMotion ? setupMobileReveal() : null;

  const refreshLayout = () => {
    if (!desktop) return;
    clearMotion();
    measureMotion();
    schedulePaint();
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => window.requestAnimationFrame(refreshLayout));
  }
  window.addEventListener("load", refreshLayout, { once: true });

  window.addEventListener("scroll", schedulePaint, { passive: true });
  const stageObserver = new ResizeObserver(() => {
    window.requestAnimationFrame(refreshLayout);
  });
  stageObserver.observe(stage);
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const nextDesktop = window.matchMedia("(min-width: 981px)").matches;
      if (nextDesktop !== desktop) {
        desktop = nextDesktop;
        mobileObserver?.disconnect();
        mobileObserver = null;
        clearMotion();
        if (!desktop && !reduceMotion) mobileObserver = setupMobileReveal();
      }
      if (desktop) {
        measureMotion();
        schedulePaint();
      }
    }, 160);
  });
}

function setupHeader() {
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 22);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupCursorTrail() {
  const cursorDot = document.querySelector("[data-cursor-dot]");
  const trail = document.querySelector("[data-guitar-trail]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!cursorDot || !trail || !finePointer.matches) return;

  const moveTrail = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    const { clientX, clientY } = event;
    cursorDot.style.transform =
      `translate3d(${clientX}px, ${clientY}px, 0) ` +
      `translate(-50%, -50%) scale(var(--cursor-press-scale, 1))`;
    trail.style.transform =
      `translate3d(${clientX}px, ${clientY}px, 0) ` +
      `translateX(-50%) rotate(var(--cursor-tilt, 0deg))`;
    trail.style.opacity = "0.3";
    document.body.classList.add("dot-cursor-active");
  };

  document.addEventListener("pointermove", moveTrail, { passive: true });
  document.addEventListener("pointerdown", () => {
    document.body.classList.add("cursor-pressed");
    cursorDot.style.setProperty("--cursor-press-scale", "0.78");
  });
  document.addEventListener("pointerup", () => {
    document.body.classList.remove("cursor-pressed");
    cursorDot.style.removeProperty("--cursor-press-scale");
  });
  document.documentElement.addEventListener("mouseleave", () => {
    trail.style.opacity = "0";
    document.body.classList.remove("dot-cursor-active", "cursor-pressed");
    cursorDot.style.removeProperty("--cursor-press-scale");
  });
}

function setupMisc() {
  document.querySelector("[data-year]").textContent = new Date().getFullYear();
}

renderWorks();
setupAudio();
setupModal();
setupConvergence();
setupHeader();
setupCursorTrail();
setupMisc();
