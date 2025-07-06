
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

export function parseComplex(str) {
  str = String(str).replace(/\s+/g, '');
  // Pure imaginary numbers (e.g., "i", "-i", "2i", "-2.5i")
  if (/^[+-]?\d*\.?\d*i$/.test(str)) {
    const b = parseFloat(str.replace('i', '')) || (str === '-i' ? -1 : str === 'i' ? 1 : 0);
    return [0, b];
  }
  // Real numbers (e.g., "25", "-3.14")
  if (/^[+-]?\d*\.?\d*$/.test(str)) {
    const a = parseFloat(str) || 0;
    return [a, 0];
  }
  // Full complex numbers (e.g., "3+4i", "-2.5-1.1i", "2+3i")
  const match = str.match(/^([+-]?\d*\.?\d*)([+-]\d*\.?\d*)i$/);
  if (!match) throw new Error("Invalid complex format");
  return [parseFloat(match[1]) || 0, parseFloat(match[2]) || 0];
}

export function computeArg(z) {
  try {
    const [a, b] = parseComplex(z);
    return Math.atan2(b, a);
  } catch (error) {
    throw new Error("Invalid complex number format for arg()");
  }
}

// 2. Conjugate
export function computecongj(z) {
  const [a, b] = parseComplex(z);
  return `${a}${b < 0 ? '+' : '-'}${Math.abs(b)}i`;
}



// Existing compute_abi function
export function compute_abi(inputNumber) {
  const str = inputNumber.toString();

  let a, b;

  if (str.includes('i')) {
    // It is a complex number represented as a string-number, e.g. "3+4i" becomes NaN normally, but passed as 34i
    const parsed = parseComplex(str);
    a = parsed[0];
    b = parsed[1];
  } else {
    // It's just a real number like 25 → 25 + 0i
    a = parseFloat(str);
    b = 0;
  }

  const r = Math.sqrt(a * a + b * b);
  const theta = Math.atan2(b, a) * 180 / Math.PI;
  const thetaRad = theta * Math.PI / 180;
  const real = r * Math.cos(thetaRad);
  const imag = r * Math.sin(thetaRad);

  return `${real.toFixed(4)}${imag < 0 ? '-' : '+'}${Math.abs(imag).toFixed(4)}i`;
}

// 4. Rectangular to Polar ▶r∠θ
export function computePolar(inputNumber) {
  const inputStr = inputNumber.toString();           // Convert number to string
  const [a, b] = parseComplex(inputStr);             // Parse complex components
  const r = Math.sqrt(a * a + b * b);                // Magnitude
  const theta = Math.atan2(b, a) * 180 / Math.PI;    // Angle in degrees

  return { r: r.toFixed(4), theta: theta.toFixed(4) };
}

export function computeRectangular(r, thetaDegrees = 0) {
  const thetaRad = thetaDegrees * Math.PI / 180;
  const a = r * Math.cos(thetaRad);
  const b = r * Math.sin(thetaRad);

  return `${a.toFixed(4)}${b < 0 ? '-' : '+'}${Math.abs(b).toFixed(4)}i`;
}
