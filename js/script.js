// Personalize the tracks, photo count, and form link here.
const CONFIG = {
  tracks: [
    { name: "Ser feliz é tão simples", src: "music/music1.mp3" },
    { name: "Beautiful things", src: "music/music2.mp3" },
    
  ],
  // Browsers cannot list files in a static folder; increase this number as photos are added.
  photos: Array.from({ length: 8 }, (_, index) => ({
    src: `images/${index + 1}.jpg`,
    caption: [
      "Se ambos gostamos de salgados, de RIr e de SOL... pareceu-me um bom ponto de partida",
      "Queres vir ordenhar comigo? (não sei se me conheces bem ou se eu é que ia estragando isto) :P",
      "Uma amizade cheia de boas memórias.",
      "Que venham mais aventuras no próximo ano.",
    ][index % 4],
  })),
  googleFormUrl: "GOOGLE_FORM_URL",
};

const playlist = document.querySelector("#playlist");
const player = document.querySelector("#audio-player");
const playButton = document.querySelector("#play-button");
const pauseButton = document.querySelector("#pause-button");
const musicStatus = document.querySelector("#music-status");
const welcome = document.querySelector("#welcome");
const gallery = document.querySelector("#gallery");
const photoImage = document.querySelector("#photo-image");
const photoBackdrop = document.querySelector("#photo-backdrop");
const photoCaption = document.querySelector("#photo-caption");
const toast = document.querySelector("#toast");

let selectedTrack = -1;
let currentPhoto = 0;
let touchStartX = null;
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 4000);
}

function renderPlaylist() {
  CONFIG.tracks.forEach((track, index) => {
    const button = document.createElement("button");
    button.className = "track-button";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.dataset.trackIndex = String(index);

    const number = document.createElement("span");
    number.className = "track-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const name = document.createElement("span");
    name.textContent = track.name;
    button.append(number, name);
    button.addEventListener("click", () => selectTrack(index));
    playlist.append(button);
  });
}

function selectTrack(index) {
  if (index === selectedTrack) {
    playTrack();
    return;
  }

  if (selectedTrack !== -1) {
    player.pause();
    player.currentTime = 0;
  }

  selectedTrack = index;
  const track = CONFIG.tracks[index];
  player.src = track.src;
  player.load();

  playlist.querySelectorAll(".track-button").forEach((button, buttonIndex) => {
    const isActive = buttonIndex === index;
    button.setAttribute("aria-pressed", String(isActive));
  });

  playButton.disabled = false;
  pauseButton.disabled = true;
  musicStatus.textContent = `${track.name} selecionada · a iniciar`;
  welcome.hidden = true;
  gallery.hidden = false;
  showPhoto(currentPhoto);
  playTrack();
}

async function playTrack() {
  if (selectedTrack === -1) {
    showToast("Escolhe primeiro uma música.");
    return;
  }

  try {
    await player.play();
    pauseButton.disabled = false;
    musicStatus.textContent = `a tocar em loop · ${CONFIG.tracks[selectedTrack].name}`;
  } catch (error) {
    musicStatus.textContent = "não foi possível reproduzir esta faixa";
    showToast("Não foi possível reproduzir o ficheiro. Confirma o caminho e o formato do áudio.");
    console.error("Audio playback failed:", error);
  }
}

function pauseTrack() {
  player.pause();
}

function photoFallback(index) {
  const palettes = [
    ["#d9b8a8", "#8d7276", "#514d63"],
    ["#eed6b4", "#bc8d82", "#685b71"],
    ["#d9d4c2", "#a47775", "#594b62"],
    ["#edc9b9", "#a66f78", "#5a5068"],
  ];
  const colors = palettes[index % palettes.length];
  const sunX = 180 + ((index * 67) % 540);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient><linearGradient id="hill" x2="0" y2="1"><stop stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient><filter id="blur"><feGaussianBlur stdDeviation="30"/></filter></defs><rect width="1200" height="800" fill="url(#sky)"/><circle cx="${sunX}" cy="290" r="118" fill="#f8e7c7" opacity=".8" filter="url(#blur)"/><circle cx="${sunX}" cy="290" r="71" fill="#f8e7c7" opacity=".86"/><path d="M0 520 Q220 360 440 505 T850 470 T1200 440 V800 H0Z" fill="${colors[2]}" opacity=".45"/><path d="M0 600 Q250 420 520 580 T1000 530 T1400 590 V800 H0Z" fill="url(#hill)"/><path d="M0 690 Q270 550 570 675 T1150 620 T1400 690 V800 H0Z" fill="${colors[2]}" opacity=".78"/><g fill="#f5ded0" opacity=".58"><circle cx="210" cy="170" r="2"/><circle cx="365" cy="115" r="2"/><circle cx="760" cy="185" r="2"/><circle cx="930" cy="115" r="2"/><circle cx="1040" cy="245" r="2"/></g><text x="600" y="750" text-anchor="middle" fill="#fff5ec" fill-opacity=".72" font-family="Georgia,serif" font-size="24" letter-spacing="8">BOAS FESTAS</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function showPhoto(index) {
  if (CONFIG.photos.length === 0) return;
  currentPhoto = (index + CONFIG.photos.length) % CONFIG.photos.length;
  const selectedPhoto = CONFIG.photos[currentPhoto];
  photoImage.classList.remove("is-visible");
  photoImage.alt = selectedPhoto.caption;
  photoCaption.textContent = selectedPhoto.caption;

  photoImage.onload = () => {
    photoBackdrop.style.backgroundImage = `url("${photoImage.src}")`;
    photoImage.classList.add("is-visible");
  };
  photoImage.onerror = () => {
    photoImage.onerror = null;
    photoImage.src = photoFallback(currentPhoto);
  };
  photoImage.src = selectedPhoto.src;
}

function changePhoto(direction) {
  if (CONFIG.photos.length < 2) return;
  showPhoto(currentPhoto + direction);
}

document.querySelector("#previous-button").addEventListener("click", () => changePhoto(-1));
document.querySelector("#next-button").addEventListener("click", () => changePhoto(1));
playButton.addEventListener("click", playTrack);
pauseButton.addEventListener("click", pauseTrack);

player.addEventListener("pause", () => {
  if (selectedTrack === -1 || !musicStatus.textContent.startsWith("a tocar em loop")) return;
  pauseButton.disabled = true;
  musicStatus.textContent = `em pausa · ${CONFIG.tracks[selectedTrack].name}`;
});

document.querySelector("#accept-button").addEventListener("click", () => {
  if (CONFIG.googleFormUrl === "GOOGLE_FORM_URL") {
    showToast("Adiciona o link real do formulário em CONFIG.googleFormUrl no js/script.js.");
    return;
  }

  let formUrl;
  try {
    formUrl = new URL(CONFIG.googleFormUrl, window.location.href);
  } catch (error) {
    showToast("O endereço do formulário não é válido.");
    console.error("Invalid Google Forms URL:", error);
    return;
  }
  if (formUrl.protocol !== "https:" && formUrl.protocol !== "http:") {
    showToast("O link do formulário deve começar por https:// ou http://.");
    return;
  }
  window.open(formUrl.href, "_blank", "noopener,noreferrer");
});

document.querySelector("#gallery").addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

document.querySelector("#gallery").addEventListener("touchend", (event) => {
  if (touchStartX === null) return;
  const deltaX = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(deltaX) > 45) changePhoto(deltaX < 0 ? 1 : -1);
  touchStartX = null;
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (gallery.hidden || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.target instanceof HTMLElement && (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) || event.target.isContentEditable)) return;
  if (event.key === "ArrowLeft") changePhoto(-1);
  if (event.key === "ArrowRight") changePhoto(1);
});

document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  if (selectedTrack === -1) return;
  gallery.hidden = true;
  welcome.hidden = false;
});

renderPlaylist();
