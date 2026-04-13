navocBtn.addEventListener("click", (a) => {
  for (const v of navocBtn.children) {
    v.classList.toggle("open");
    v.classList.toggle("close");
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
const emailInput = document.getElementById("email");
const contactForm = document.getElementById("ContactForm");

if (cardHub) {
  cardHub.addEventListener("click", function () {
    const emailText = this.querySelector(".hub").textContent;
    if (emailInput) {
      emailInput.value = emailText;
      emailInput.focus();

      setTimeout(() => {
        contactForm.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

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

    const emailBody = `
Nama: ${nama}
Email: ${email}
Subjek: ${tipe}

Pesan:
${pesan}
        `.trim();

    const mailtoLink = `mailto:maulanaramadhan3010@gmail.com?subject=Pesan Dari ${nama} - ${tipe}&body=${encodeURIComponent(emailBody)}`;

    setTimeout(() => {
      window.location.href = mailtoLink;

      showFormStatus(
        "Aplikasi email akan terbuka untuk mengirim pesan. Klik Send di aplikasi email Anda.",
        "success",
      );

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Pesan";
        formStatus.style.display = "none";
      }, 3000);
    }, 500);
  });
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