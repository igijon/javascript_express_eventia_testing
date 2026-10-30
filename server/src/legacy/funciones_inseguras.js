// 1. Ejecución dinámica de código
export function calcularOperacion(expresion) {
  return eval(expresion);
}

// 2. Construcción insegura de una consulta SQL
export function buscarUsuario(nombre) {
  const sql = "SELECT * FROM usuarios WHERE nombre = '" + nombre + "'";
  return sql;
}

// 3. Secreto hardcodeado (valor ficticio)
export const API_KEY = "eventia-demo-secret-123456";