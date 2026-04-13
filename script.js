navocBtn.addEventListener("click", a => {
    for (const v of navocBtn.children) {
        v.classList.toggle("open");
        v.classList.toggle("close");
    }
});

document.querySelectorAll(".skillFrag").forEach(e => {
    e.children[1].children[0].style.width = e.children[2].textContent;
})