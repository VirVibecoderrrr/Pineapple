/* =====================================================
   GLOBAL SCRIPT (ALL PAGES)
===================================================== */

/* -----------------------------
   Helpers
----------------------------- */

function qs(id) {
    return document.getElementById(id);
}

/* =====================================================
   INDEX PAGE (PROPOSAL)
===================================================== */

const yesBtn = qs("yesBtn");
const noBtn = qs("noBtn");
const loader = qs("loader");
const heartContainer = qs("heart-container");
const bgMusic = qs("bgMusic");

/* Loader */

window.addEventListener("load", () => {

    if (loader) {
        setTimeout(() => {
            loader.classList.add("loader-hide");
        }, 2500);
    }

});

/* Music Autoplay */

function startMusic() {

    if (!bgMusic) return;

    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});

    document.removeEventListener("click", startMusic);
    document.removeEventListener("touchstart", startMusic);
}

document.addEventListener("click", startMusic);
document.addEventListener("touchstart", startMusic);

/* Yes Button */

/* Yes Button */

if (yesBtn) {

    yesBtn.addEventListener("click", () => {

        // Change button text
        yesBtn.innerText = "YAYYY ❤️";
        yesBtn.disabled = true;

        // Start background music
        if (bgMusic) {
            bgMusic.volume = 0.4;

            bgMusic.play().then(() => {

                // Tell the next pages to keep playing music
                sessionStorage.setItem("playMusic", "true");

                // Save music position every 500ms
                setInterval(() => {
                    if (!bgMusic.paused) {
                        sessionStorage.setItem(
                            "musicTime",
                            bgMusic.currentTime
                        );
                    }
                }, 500);

            }).catch(err => {
                console.log("Music couldn't start:", err);
            });
        }

        // Wait before transitioning
        setTimeout(() => {

            document.body.classList.add("fade-out");

            setTimeout(() => {
                window.location.href = "movie.html";
            }, 800);

        }, 1200);

    });

}

/* No Button Escape */

const funnyTexts = [
    "Nope 😜",
    "Try Again 😂",
    "Think again 🥺",
    "Only YES ❤️",
    "Hehe 😆"
];

function moveNoBtn() {

    if (!noBtn) return;

    const x = Math.random() * (window.innerWidth - 120);
    const y = Math.random() * (window.innerHeight - 60);

    noBtn.style.position = "fixed";
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";

    noBtn.innerText = funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
}

if (noBtn) {
    noBtn.addEventListener("mouseenter", moveNoBtn);
    noBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        moveNoBtn();
    });
}

/* Floating Hearts */

const hearts = ["❤️", "💖", "💕", "💗", "💘"];

function createHeart() {

    if (!heartContainer) return;

    const heart = document.createElement("div");

    heart.className = "heart";
    heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (18 + Math.random() * 25) + "px";
    heart.style.animationDuration = (5 + Math.random() * 4) + "s";

    heartContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 9000);
}

setInterval(createHeart, 300);

/* =====================================================
   MOVIE PAGE
===================================================== */

const cards = document.querySelectorAll(".movie-card");
const continueBtn = qs("continueBtn");

let selectedMovie = "";

if (cards.length > 0) {

    cards.forEach(card => {

        card.addEventListener("click", () => {

            cards.forEach(c => c.classList.remove("selected"));

            card.classList.add("selected");

            selectedMovie = card.dataset.movie;

            localStorage.setItem("movie", selectedMovie);

        });

    });

}

if (continueBtn) {

    continueBtn.addEventListener("click", () => {

        if (!selectedMovie) {
            alert("Please select a movie ❤️");
            return;
        }

        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = "success.html";
        }, 800);

    });

}

/* =====================================================
   SUCCESS PAGE
===================================================== */

const movieName = qs("movieName");
const restartBtn = qs("restart");
const surpriseBtn = qs("surpriseBtn");
const overlay = qs("videoOverlay");
const video = qs("surpriseVideo");
const closeBtn = qs("closeVideo");

if (movieName) {
    const movie = localStorage.getItem("movie");
    movieName.innerText = movie || "A Surprise Movie ❤️";
}

/* Confetti */

function launchConfetti() {

    if (!document.body) return;

    const emojis = ["🎉", "✨", "💖", "🎊"];

    for (let i = 0; i < 80; i++) {

        const el = document.createElement("div");

        el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.position = "fixed";
        el.style.left = Math.random() * 100 + "vw";
        el.style.top = "-20px";
        el.style.fontSize = (16 + Math.random() * 20) + "px";
        el.style.pointerEvents = "none";
        el.style.transition = "3s linear";
        el.style.zIndex = "9999";

        document.body.appendChild(el);

        setTimeout(() => {
            el.style.top = "110vh";
            el.style.transform = "rotate(720deg)";
            el.style.opacity = "0";
        }, 50);

        setTimeout(() => el.remove(), 4000);
    }
}

if (movieName) {
    setTimeout(launchConfetti, 600);
}

/* Video Popup FIXED */

if (surpriseBtn && overlay && video && closeBtn) {

    surpriseBtn.addEventListener("click", () => {

        overlay.classList.add("active");

        video.currentTime = 0;

        video.play().catch(() => {
            console.log("Video play blocked by browser");
        });

    });

    function closeVideo() {

        video.pause();
        video.currentTime = 0;
        overlay.classList.remove("active");

    }

    closeBtn.addEventListener("click", closeVideo);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeVideo();
        }
    });

}

/* Restart */

if (restartBtn) {

    restartBtn.addEventListener("click", () => {

        localStorage.removeItem("movie");

        document.body.classList.add("fade-out");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 800);

    });

}