export const formatDate = (date) => {
  const dateOptions = { year: "numeric", month: "short", day: "numeric" };
  const fecha = new Date(date).toLocaleDateString("es-MX", dateOptions);
  return fecha;
};
