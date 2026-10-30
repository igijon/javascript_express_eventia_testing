export const users = [
  {
    id: 1,
    name: "Ana López",
    email: "ana@eventia.local",
    password: "usuario123",
    role: "user",
  },
  {
    id: 2,
    name: "Admin Eventia",
    email: "admin@eventia.local",
    password: "admin123",
    role: "admin",
  },
  {
    id: 3,
    name: "Luis Martín",
    email: "luis@eventia.local",
    password: "usuario456",
    role: "user",
  },
];
export const events = [
  {
    id: 1,
    title: "Jornada de desarrollo web",
    description: "Frontend moderno, APIs y buenas prácticas.",
    date: "2026-11-20",
    venue: "Centro Cultural",
    capacity: 100,
    availableSeats: 35,
  },
  {
    id: 2,
    title: "Introducción a la ciberseguridad",
    description: "Amenazas, pruebas y desarrollo seguro.",
    date: "2026-11-27",
    venue: "Aula Magna",
    capacity: 60,
    availableSeats: 12,
  },
  {
    id: 3,
    title: "Encuentro de tecnología creativa",
    description: "Ideas y proyectos digitales.",
    date: "2026-12-04",
    venue: "Espacio Joven",
    capacity: 80,
    availableSeats: 80,
  },
];
export const reservations = [
  { id: 101, userId: 1, eventId: 1, seats: 2, status: "confirmed" },
  { id: 102, userId: 3, eventId: 2, seats: 1, status: "confirmed" },
];
export const sessions = new Map();
let nextId = 103;
export const getNextReservationId = () => nextId++;
