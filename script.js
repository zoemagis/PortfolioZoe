/* HOMECTION — interacciones y validación */
document.addEventListener("DOMContentLoaded", () => {
  const yearNode = document.getElementById("currentYear");
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  // Cerrar el menú móvil después de seleccionar una sección.
  const navCollapse = document.getElementById("navPrincipal");
  document.querySelectorAll("#navPrincipal .nav-link, #navPrincipal .btn").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.bootstrap && navCollapse && navCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  // Marcar el enlace de navegación correspondiente a la sección visible.
  const navLinks = [...document.querySelectorAll('.navbar-nav .nav-link[href^="#"]')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((section) => observer.observe(section));
  }

  // Modal reutilizable para detalles de soluciones y productos.
  const modalElement = document.getElementById("detailModal");
  const detailModal = modalElement && window.bootstrap ? new bootstrap.Modal(modalElement) : null;
  const modalTitle = document.getElementById("detailModalTitle");
  const modalDescription = document.getElementById("detailModalDescription");
  const modalMeta = document.getElementById("detailModalMeta");

  function showDetails(title, description, metaItems = []) {
    if (!detailModal) return;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalMeta.replaceChildren();
    metaItems.filter(Boolean).forEach((item) => {
      const badge = document.createElement("span");
      const icon = document.createElement("i");
      icon.className = "bi bi-check-circle";
      icon.setAttribute("aria-hidden", "true");
      badge.append(icon, document.createTextNode(item));
      modalMeta.appendChild(badge);
    });
    detailModal.show();
  }

  document.querySelectorAll(".solution-detail").forEach((button) => {
    button.addEventListener("click", () => {
      showDetails(button.dataset.title, button.dataset.detail, ["Asesoramiento personalizado", "Compatibilidad a verificar"]);
    });
  });

  document.querySelectorAll(".product-detail").forEach((button) => {
    button.addEventListener("click", () => {
      showDetails(button.dataset.product, button.dataset.description, [button.dataset.price, button.dataset.compat]);
    });
  });

  // Los botones de los planes completan el interés en el formulario.
  document.querySelectorAll(".plan-cta").forEach((button) => {
    button.addEventListener("click", () => {
      const commentField = document.getElementById("comentarios");
      if (commentField && button.dataset.plan) {
        commentField.value = `Me interesa recibir información sobre el Plan ${button.dataset.plan}.`;
      }
    });
  });

  // Validación del formulario. No envía datos: para eso hace falta conectar un servicio.
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.classList.add("was-validated");
      if (!form.checkValidity()) {
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        success.classList.add("d-none");
        return;
      }
      success.classList.remove("d-none");
      success.focus();
      success.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    });
  }
});
