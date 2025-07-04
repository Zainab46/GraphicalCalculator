
// Number of terms for Taylor approximation
const TAYLOR_TERMS = 20;

// Factorial helper
function factorial(n) {
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Power helper
function power(x, n) {
  let res = 1;
  for (let i = 0; i < n; i++) res *= x;
  return res;
}

// atan(x) using Taylor series
 function atan(x) {
  let result = 0;
  let sign = 1;
  for (let n = 1; n < TAYLOR_TERMS * 2; n += 2) {
    result += sign * power(x, n) / n;
    sign *= -1;
  }
  return result;
}

// atan2(y, x) using atan and quadrant check
function atan2(y, x) {
  if (x > 0) return atan(y / x);
  if (x < 0 && y >= 0) return atan(y / x) + Math.PI;
  if (x < 0 && y < 0) return atan(y / x) - Math.PI;
  if (x === 0 && y > 0) return Math.PI / 2;
  if (x === 0 && y < 0) return -Math.PI / 2;
  return 0;
}

// sin(x) using Taylor
function sin(x) {
  let result = 0;
  for (let n = 0; n < TAYLOR_TERMS; n++) {
    let term = power(-1, n) * power(x, 2 * n + 1) / factorial(2 * n + 1);
    result += term;
  }
  return result;
}

// cos(x) using Taylor
function cos(x) {
  let result = 0;
  for (let n = 0; n < TAYLOR_TERMS; n++) {
    let term = power(-1, n) * power(x, 2 * n) / factorial(2 * n);
    result += term;
  }
  return result;
}

// 1. Arg(z)
export function computeArg(z) {
  const [a, b] = parseComplex(z);
  return atan2(b, a); // result in radians
}

// 2. Conjugate
export function computecongj(z) {
  const [a, b] = parseComplex(z);
  return `${a}${b < 0 ? '+' : '-'}${Math.abs(b)}i`;
}

// 3. Polar to Rectangular ▶a+bi
export function compute_abi(varName) {
  const polar = getPolarByName(varName); // { r, theta (degrees) }
  const thetaRad = polar.theta * Math.PI / 180;
  const real = polar.r * cos(thetaRad);
  const imag = polar.r * sin(thetaRad);
  return `${real.toFixed(4)}${imag < 0 ? '-' : '+'}${Math.abs(imag).toFixed(4)}i`;
}

// 4. Rectangular to Polar ▶r∠θ
export function computePolar(varName) {
  const [a, b] = parseComplex(getComplexByName(varName));
  const r = Math.sqrt(a * a + b * b);
  const theta = atan2(b, a) * 180 / Math.PI;
  return { r: r.toFixed(4), theta: theta.toFixed(4) }; // in degrees
}
