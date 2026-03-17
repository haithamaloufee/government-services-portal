document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.service;
    window.location.href = `lookup.html?service=${encodeURIComponent(key)}`;
  });
});
