"use strict";

const container = document.querySelector(".toast-container");

export const showToast = function (
  message,
  type = "success",
  icon = "check-circle",
) {
  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  toast.innerHTML = `
      <i data-lucide="${icon}"></i>
      <span>${message}</span>
  `;

  container.appendChild(toast);

  lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => toast.remove(), 350);
  }, 2500);
};
