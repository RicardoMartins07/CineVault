const themeBtn = document.querySelector(".icon-btn");
const logo = document.querySelector(".brand__logo");

export const initTheme = function () {
  const theme = localStorage.getItem("theme") || "dark";

  document.body.classList.toggle("light", theme === "light");

  updateTheme(theme);

  themeBtn.addEventListener("click", toggleTheme);
};

const toggleTheme = function () {
  const light = document.body.classList.toggle("light");

  const theme = light ? "light" : "dark";

  localStorage.setItem("theme", theme);

  updateTheme(theme);
};

const updateTheme = function (theme) {
  const logo = document.querySelector(".brand__logo");
  const themeBtn = document.querySelector(".icon-btn");

  if (logo) {
    logo.src = theme === "light" ? "assets/logo2.png" : "assets/logo.png";
  }

  if (themeBtn) {
    themeBtn.innerHTML = `
      <i data-lucide="${theme === "light" ? "sun" : "moon-star"}"></i>
    `;

    lucide.createIcons();
  }
};
