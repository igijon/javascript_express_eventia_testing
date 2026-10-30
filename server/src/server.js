import express from "express";
import cors from "cors";
import {
  users,
  events,
  reservations,
  sessions,
  getNextReservationId,
} from "./data.js";
const app = express();
app.use(cors());
app.use(express.json());
function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  req.user = users.find((u) => u.id === sessions.get(token));
  next();
}
function requireLogin(req, res, next) {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Debes iniciar sesión" });
  next();
}
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "Eventia API" }),
);
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Credenciales incorrectas" });
  const token = `eventia-${user.id}-${Date.now()}`;
  sessions.set(token, user.id);
  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});
app.get("/api/events", (req, res) => res.json({ success: true, data: events }));
app.get("/api/events/:id", (req, res) => {
  const e = events.find((x) => x.id === Number(req.params.id));
  if (!e)
    return res
      .status(404)
      .json({ success: false, message: "Evento no encontrado" });
  res.json({ success: true, data: e });
});
app.get("/api/me", authenticate, requireLogin, (req, res) =>
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  }),
);
app.get("/api/reservations", authenticate, requireLogin, (req, res) =>
  res.json({ success: true, data: reservations }),
);
app.get("/api/reservations/:id", authenticate, requireLogin, (req, res) => {
  const r = reservations.find((x) => x.id === Number(req.params.id));
  if (!r)
    return res
      .status(404)
      .json({ success: false, message: "Reserva no encontrada" });
  res.json({ success: true, data: r });
});
app.post("/api/reservations", authenticate, requireLogin, (req, res) => {
  const { eventId, seats } = req.body;
  const e = events.find((x) => x.id === Number(eventId));
  if (!e)
    return res
      .status(404)
      .json({ success: false, message: "Evento no encontrado" });
  e.availableSeats -= Number(seats);
  const r = {
    id: getNextReservationId(),
    userId: req.user.id,
    eventId: e.id,
    seats: Number(seats),
    status: "confirmed",
  };
  reservations.push(r);
  res.status(201).json({ success: true, data: r });
});
app.delete("/api/reservations/:id", authenticate, requireLogin, (req, res) => {
  const i = reservations.findIndex((x) => x.id === Number(req.params.id));
  if (i < 0)
    return res
      .status(404)
      .json({ success: false, message: "Reserva no encontrada" });
  const [r] = reservations.splice(i, 1);
  res.json({ success: true, data: r });
});
app.post("/api/admin/events", authenticate, requireLogin, (req, res) => {
  const { title, description, date, venue, capacity } = req.body;
  const e = {
    id: Math.max(...events.map((x) => x.id)) + 1,
    title,
    description,
    date,
    venue,
    capacity: Number(capacity),
    availableSeats: Number(capacity),
  };
  events.push(e);
  res.status(201).json({ success: true, data: e });
});
app.get("/api/admin/reservations", authenticate, requireLogin, (req, res) => {
  if (req.user.role !== "admin")
    return res
      .status(403)
      .json({ success: false, message: "Acceso restringido" });
  res.json({ success: true, data: reservations });
});
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Ruta no encontrada" }),
);
app.listen(3000, () => console.log("Eventia API: http://localhost:3000"));
