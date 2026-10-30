import "./style.css";
import { apiRequest } from "./api.js";
const list = document.querySelector("#event-list");
let events = [];
let user = JSON.parse(localStorage.getItem("eventia_user") || "null");
function updateSession() {
  document.querySelector("#session").textContent = user
    ? `Sesión: ${user.name} (${user.role})`
    : "No has iniciado sesión";
}
function render(items) {
  list.innerHTML = items
    .map(
      (e) =>
        `<article class="card"><small>${e.date} · ${e.venue}</small><h3>${e.title}</h3><p>${e.description}</p><small>${e.availableSeats} plazas disponibles</small><br><button data-id="${e.id}">Reservar plaza</button></article>`,
    )
    .join("");
}
async function load() {
  const r = await apiRequest("/events");
  events = r.data;
  render(events);
}
document.querySelector("#login-form").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  try {
    const r = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
      }),
    });
    localStorage.setItem("eventia_token", r.token);
    localStorage.setItem("eventia_user", JSON.stringify(r.user));
    user = r.user;
    updateSession();
    document.querySelector("#login-message").textContent = "Sesión iniciada.";
  } catch (e) {
    document.querySelector("#login-message").textContent = e.message;
  }
});
list.addEventListener("click", async (ev) => {
  const b = ev.target.closest("button[data-id]");
  if (!b) return;
  if (!user) return alert("Inicia sesión antes de reservar.");
  try {
    const r = await apiRequest("/reservations", {
      method: "POST",
      body: JSON.stringify({ eventId: Number(b.dataset.id), seats: 1 }),
    });
    alert(`Reserva creada: ${r.data.id}`);
    await load();
  } catch (e) {
    alert(e.message);
  }
});
document
  .querySelector("#load-reservations")
  .addEventListener("click", async () => {
    try {
      const r = await apiRequest("/reservations");
      document.querySelector("#reservation-list").innerHTML = r.data
        .map(
          (x) =>
            `<p>Reserva #${x.id} · Usuario ${x.userId} · Evento ${x.eventId} · ${x.seats} entrada(s)</p>`,
        )
        .join("");
    } catch (e) {
      document.querySelector("#reservation-list").textContent = e.message;
    }
  });
document.querySelector("#event-form").addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const form = ev.currentTarget;
  const body = Object.fromEntries(new FormData(form));

  try {
    await apiRequest("/admin/events", {
      method: "POST",
      body: JSON.stringify(body),
    });

    document.querySelector("#admin-message").textContent = "Evento publicado.";

    form.reset();

    await load();
  } catch (e) {
    document.querySelector("#admin-message").textContent = e.message;
  }
});
document.querySelector("#search").addEventListener("input", (ev) => {
  const q = ev.target.value.toLowerCase();
  render(
    events.filter((e) =>
      `${e.title} ${e.description}`.toLowerCase().includes(q),
    ),
  );
});
updateSession();
load().catch((e) => (list.textContent = e.message));
