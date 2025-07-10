
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

/**
 * Converts a complex number from polar form (e.g., "20∠5") to rectangular form (a + bi)
 * @param {string} polarString - Complex number in polar form (e.g., "20∠5", "15.5∠30")
 * @returns {string} - Rectangular form as a string (e.g., "19.92389396183+1.743114i")
 */
export function polarToRectangularangle(polarString) {
  // Remove spaces and ensure consistent angle symbol
  const cleanInput = polarString.replace(/\s+/g, '').replace(/∠/g, '∠').trim();
  
  // Regex to match magnitude∠angle (e.g., "20∠5", "15.5∠30")
  const polarRegex = /^(\d*\.?\d*)∠(\d*\.?\d*)$/;
  const match = cleanInput.match(polarRegex);
  
  if (!match) {
    throw new Error(`Invalid polar form: ${polarString}. Expected format: r∠θ (e.g., 20∠5)`);
  }
  
  const magnitude = parseFloat(match[1]);
  const angleDegrees = parseFloat(match[2]);
  
  // Validate inputs
  if (isNaN(magnitude) || isNaN(angleDegrees)) {
    throw new Error(`Invalid magnitude or angle: ${match[1]}∠${match[2]}`);
  }
  
  // Convert angle to radians
  const angleRadians = angleDegrees * Math.PI / 180;
  
  // Calculate real and imaginary parts
  const realPart = magnitude * Math.cos(angleRadians);
  const imagPart = magnitude * Math.sin(angleRadians);
  
  // Format the result as "a+bi" or "a-bi"
  const sign = imagPart >= 0 ? '+' : '';
  return `${realPart.toFixed(11)}${sign}${imagPart.toFixed(6)}i`;
}


/**
 * Converts between decimal degrees and DMS (Degrees, Minutes, Seconds) formats
 * @param {string} input - Input string in decimal degrees (e.g., "10°", "2.55°") or DMS (e.g., "10°30'45\"")
 * @returns {string} - Converted result (DMS if input is decimal, decimal if input is DMS)
 */
export function convertDMS(input) {
  // Remove spaces and standardize symbols
  const cleanInput = input.replace(/\s+/g, '').trim();
  
  // Regex for decimal degrees (e.g., "10°", "2.55°")
  const decimalRegex = /^(\d*\.?\d*)°$/;
  // Regex for DMS (e.g., "10°30'45"", "10°30'", "10°")
  const dmsRegex = /^(\d*)°(?:(\d*)'(?:(\d*\.?\d*)"))?$/;
  
  // Check if input is decimal degrees
  if (decimalRegex.test(cleanInput)) {
    const decimalDegrees = parseFloat(cleanInput.replace('°', ''));
    if (isNaN(decimalDegrees)) {
      throw new Error(`Invalid decimal degrees: ${input}`);
    }
    
    // Convert decimal degrees to DMS
    const degrees = Math.floor(decimalDegrees);
    const minutesDecimal = (decimalDegrees - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;
    
    // Format DMS output
    return `${degrees}°${minutes}'${seconds.toFixed(2)}"`;
  }
  
  // Check if input is DMS
  if (dmsRegex.test(cleanInput)) {
    const match = cleanInput.match(dmsRegex);
    const degrees = parseFloat(match[1]) || 0;
    const minutes = parseFloat(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    
    if (isNaN(degrees) || isNaN(minutes) || isNaN(seconds)) {
      throw new Error(`Invalid DMS format: ${input}`);
    }
    
    // Convert DMS to decimal degrees
    const decimalDegrees = degrees + (minutes / 60) + (seconds / 3600);
    
    // Format decimal output
    return `${decimalDegrees.toFixed(4)}°`;
  }
  
  throw new Error(`Invalid input format: ${input}. Expected formats: "10°", "2.55°", or "10°30'45\""`);
}