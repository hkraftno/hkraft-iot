export function round(num, digits) {
  digits = isNaN(digits) ? 2 : digits;
  return (+(Math.round(num + "e+" + digits)  + "e-" + digits)).toFixed(digits);
}
