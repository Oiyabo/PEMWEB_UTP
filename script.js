const navocBtn = document.getElementById("navocBtn");
const navDiamond = document.getElementById("navDiamond");
let deg = 1;
navocBtn.addEventListener("click", (a) => {
  if (navDiamond) {
    navDiamond.style.transform = `rotate(${(++deg * 360)+45}deg)`;
  }

  for (const v of navocBtn.children) {
    if (v.id !== "navDiamond") {
      v.classList.toggle("open");
      v.classList.toggle("close");
    }
  }

  navocBtn.style.transform = "translate(10px, -50%) scale(0.95)";
  setTimeout(() => {
    navocBtn.style.transform = "translate(10px, -50%) scale(1)";
  }, 150);
});

document.querySelectorAll(".navCard a").forEach((link) => {
  link.addEventListener("click", () => {
    setTimeout(() => {
      for (const v of navocBtn.children) {
        if (v.classList.contains("open")) {
          v.classList.toggle("open");
          v.classList.toggle("close");
        }
      }
    }, 200);
  });
});

document.querySelectorAll(".skillFrag").forEach((e) => {
  e.children[1].children[0].style.width = e.children[2].textContent;
});

const cardHub = document.querySelector(".cardHub");
const contactForm = document.getElementById("ContactForm");

if (cardHub) {
  cardHub.addEventListener("click", function () {
    window.open(
      "https://mail.google.com/mail/?view=cm&to=maulanaramadhan3010@gmail.com",
      "_blank",
    );
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Form submitted"); // Debug

    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();
    const tipe = document.getElementById("tipe").value;
    const pesan = document.getElementById("pesan").value.trim();
    const submitBtn = document.getElementById("submitBtn");
    const formStatus = document.getElementById("formStatus");

    if (!nama || !email || !tipe || !pesan) {
      showFormStatus("Harap isi semua field", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormStatus("Format email tidak valid", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";

    const emailBody = `Nama: ${nama}
Email: ${email}
Subjek: ${tipe}

Pesan:
${pesan}`;

    const subject = encodeURIComponent(`Pesan Dari ${nama} - ${tipe}`);
    const body = encodeURIComponent(emailBody);
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&to=maulanaramadhan3010@gmail.com&su=${subject}&body=${body}`;

    console.log("Opening Gmail:", gmailComposeUrl); // Debug

    const gmailTab = window.open(gmailComposeUrl, "_blank");

    if (gmailTab) {
      showFormStatus(
        "Gmail terbuka dengan pesan Anda. Klik Send di Gmail untuk mengirim.",
        "success",
      );

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Pesan";
        formStatus.style.display = "none";
      }, 3000);
    } else {
      showFormStatus(
        "Popup Gmail diblokir. Buka Gmail secara manual.",
        "error",
      );
      submitBtn.disabled = false;
      submitBtn.textContent = "Kirim Pesan";
    }
  });
} else {
  console.log("Form ContactForm tidak ditemukan");
}

function showFormStatus(message, type) {
  const formStatus = document.getElementById("formStatus");
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;

  if (type === "error") {
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 4000);
  }
}

document.querySelectorAll(".navCard.close").forEach((link) => {
  link.addEventListener("click", () => {
    window.open(link.children[0].href, "_self");
  });
});

let vount = 0;
if (document.getElementById("tlt") && document.getElementById("trt")) {
  tlt.addEventListener("click", () => {
    vount++;
    changeGame();
  });
  trt.addEventListener("click", () => {
    vount--;
    changeGame();
  });
  const el = document.querySelectorAll(".conProjek");
  function changeGame() {
    console.log(vount % 2);
    el.forEach((e) => (e.style.display = "none"));
    el[Math.abs(vount % 2)].style.display = "block";
    if (vount % 2 === 0) {
      isPause1 = false;
      isPause2 = true;
      update();
      gameName.textContent = "Letter Walker";
    } else {
      isPause1 = true;
      isPause2 = false;
      loop();
      gameName.textContent = "Code Getter";
    }
  }
}
