import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'base_converter.db';
let db;
// Constants
export const PI = 3.141592653589793;
export const E = 2.718281828459045;


//x⁻¹ function
export const inverse = (x) => {
  let negative = false;
  if (x < 0) {
    negative = true;
    x = -x;
  }
  if (x === 0) {
    throw new Error("Inverse undefined for zero");
  }
  let result = 1 / x;
  return negative ? -result : result;
};

// Function to calculate factorial
export const factorial = (n) => {
  let negative=false
  if (n < 0) {
    negative=true
    n=-n
  }
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return negative?-result:result;
};

// Absolute value function
export const abs = (x) => {
  return x < 0 ? -x : x;
};

// Divide function
export const divide = (x, y) => {
  if (y === 0) {
    throw new Error('Undefined (division by zero)');
  }
  return x / y;
};

// div_mul function: x * (y / z)
export const div_mul = (x, y, z) => {
  return x * divide(y, z);
};


// Function to calculate square root using Babylonian method
export const sqrt = (x) => {
  if (x < 0) return NaN;
  if (x === 0) return 0;
  
  let guess = x / 2;
  let prevGuess = 0;
  const precision = 1e-10;
  
  while (abs(guess - prevGuess) > precision) {
    prevGuess = guess;
    guess = (guess + x / guess) / 2;
  }
  return guess;
};

//cube root 
export const cbrt = (x) => {
  if (x === 0) return 0;

  let guess = x / 3;
  let prevGuess = 0;
  const precision = 1e-10;

  while (abs(guess - prevGuess) > precision) {
    prevGuess = guess;
    guess = (2 * guess + x / (guess * guess)) / 3;
  }

  return guess;
};

//square
 export const square=(x)=>{
  return x*x;
 }

 //cube
 export const cube=(x)=>{
  return x*x*x;
 }

 //x power y 
 export const power = (x, y) => {
  if (y === 0) return 1;
  if (y < 0) return 1 / power(x, -y);

  let result = 1;
  for (let i = 0; i < y; i++) {
    result *= x;
  }
  return result;
};

// x underoot y
export const root = (x, y) => {
  if (y === 0) return NaN;
  if (x === 0) return 0;

  let guess = x / y;
  let prevGuess = 0;
  const precision = 1e-10;

  while (Math.abs(guess - prevGuess) > precision) {
    prevGuess = guess;
    guess = ((y - 1) * guess + x / power(guess, y - 1)) / y;
  }

  return guess;
};

// Reuse power from above
export const x_yrt = (x, y) => {
  if (y === 0) return 1;
  if (y < 0) return 1 / power(x, -y);
  let result = 1;
  for (let i = 0; i < y; i++) {
    result *= x;
  }
  return result;
}; 

//negation 
export const makeNegative=(value)=> {
  return -1 * value;
}

//ln
export const computeLn = (x, terms = 20) => {
    if (x <= 0) return NaN;

    // Transform x to ln(1 + y)
    let y = (x - 1) / (x + 1);
    let y2 = y * y;
    let sum = 0;

    for (let n = 1; n <= terms * 2; n += 2) {
      sum += (1 / n) * Math.pow(y, n);
    }

    return 2 * sum;
  };

  //log
  export const computeLog10 = (x, terms = 20) => {
  const ln10 = computeLn(10, terms);
  const lnX = computeLn(x, terms);
  return lnX / ln10;
};

//LOG BASE 2
export const computeLogBase = (x, base, terms = 20) => {
  const lnX = computeLn(x, terms);
  const lnBase = computeLn(base, terms);
  return lnX / lnBase;
};

//
export const computeSummation = (variable, start, end, expression) => {
  let sum = 0;

  for (let i = Number(start); i <= Number(end); i++) {
    // Replace variable in expression with current value
    const evalExpr = expression.replaceAll(variable, `(${i})`);

    // Evaluate using Function constructor (simple but careful!)
    sum += Function(`return ${evalExpr}`)();
  }

  return sum;
};



// Function to convert degrees to radians
export const toRadians = (degrees) => {
  return degrees * PI / 180;
};

// Function to convert grads to radians
export const toRadiansFromGrads = (grads) => {
  return grads * PI / 200;
};


// Function to normalize angle to [-π, π]
export const normalizeAngle = (radians) => {
  const twoPi = 2 * PI;
  return radians - twoPi * floor((radians + PI) / twoPi);
};

// Floor function
export const floor = (x) => {
  return x >= 0 ? ~~x : ~~x - 1;
};

// Sine function using T  aylor series (for better accuracy with more terms)
// export const taylorSin = (x) => {
//   x = normalizeAngle(x);
//   let sum = 0;
//   let term = x;
//   let n = 0;
  
//   while (Math.abs(term) > 1e-15 && n < 20) {
//     sum += term;
//     n++;
//     term *= -x * x / ((2 * n) * (2 * n + 1));
//   }
//   return sum;
// };

// Cosine function using Taylor series (with more terms for better accuracy)
// export const taylorCos = (x) => {
//   x = normalizeAngle(x);
//   let sum = 1;
//   let term = 1;
//   let n = 0;
  
//   while (Math.abs(term) > 1e-15 && n < 20) {
//     n++;
//     term *= -x * x / ((2 * n - 1) * (2 * n));
//     sum += term;
//   }
//   return sum;
// };

// Tangent function using sine and cosine
// export const taylorTan = (x) => {
//   // Check for values close to π/2 + nπ where tangent is undefined
//   const normalized = normalizeAngle(x);
//   if (Math.abs(Math.abs(normalized) - PI/2) < 1e-10) {
//     return Infinity * Math.sign(normalized);
//   }
  
//   const sinVal = taylorSin(x);
//   const cosVal = taylorCos(x);
  
//   if (Math.abs(cosVal) < 1e-10) {
//     return Infinity * Math.sign(sinVal);
//   }
//   return sinVal / cosVal;
// };

// Arc sine function improved implementation
export const taylorAsin = (x) => {
  if (x < -1 || x > 1) return NaN;
  if (Math.abs(x) === 1) return PI/2 * Math.sign(x);
  
  // For small values use Taylor series
  if (Math.abs(x) < 0.5) {
    let sum = x;
    let term = x;
    let n = 0;
    
    while (Math.abs(term) > 1e-15 && n < 100) {
      n++;
      term *= x * x * (2 * n - 1) * (2 * n - 1) / ((2 * n) * (2 * n + 1));
      sum += term;
    }
    return sum;
  } else {
    // For larger values use identity: arcsin(x) = π/2 - arcsin(√(1-x²))
    return PI/2 - taylorAsin(sqrt(1 - x * x));
  }
};

// Arc cosine function using arc sine
export const taylorAcos = (x) => {
  if (x < -1 || x > 1) return NaN;
  return PI/2 - taylorAsin(x);
};

// Arc tangent improved implementation
export const taylorAtan = (x) => {
  // Use identity for large values
  if (Math.abs(x) > 1) {
    return Math.sign(x) * PI/2 - taylorAtan(1/x);
  }
  
  // For values close to 1, use identity
  if (Math.abs(x - 1) < 1e-10) return PI/4;
  if (Math.abs(x + 1) < 1e-10) return -PI/4;
  
  let sum = x;
  let term = x;
  let n = 0;
  
  while (Math.abs(term) > 1e-15 && n < 100) {
    n++;
    term *= -x * x * (2 * n - 1) / (2 * n + 1);
    sum += term;
  }
  return sum;
};


// Hyperbolic sine function
export const taylorSinh = (x) => {
  // For large values, use exponential identity to avoid overflow
  if (Math.abs(x) > 20) {
    const ex = Math.exp(Math.abs(x));
    return Math.sign(x) * ex / 2; // Approximation for large values
  }
  
  return (Math.exp(x) - Math.exp(-x)) / 2;
};

// Hyperbolic cosine function
export const taylorCosh = (x) => {
  // For large values, use exponential identity to avoid overflow
  if (Math.abs(x) > 20) {
    const ex = Math.exp(Math.abs(x));
    return ex / 2; // Approximation for large values
  }
  
  return (Math.exp(x) + Math.exp(-x)) / 2;
};

// Hyperbolic tangent function
export const taylorTanh = (x) => {
  // For very large values, tanh approaches ±1
  if (x > 20) return 1;
  if (x < -20) return -1;
  
  // For values close to zero, use Taylor series
  if (Math.abs(x) < 0.1) {
    return x - (x*x*x)/3 + (2*x*x*x*x*x)/15;
  }
  
  // Otherwise use exponential definition
  const ex = Math.exp(2*x);
  return (ex - 1) / (ex + 1);
};

// Inverse hyperbolic sine
export const taylorAsinh = (x) => {
  // For large values, use logarithmic identity
  if (Math.abs(x) > 1e6) {
    return Math.sign(x) * (computeLn(Math.abs(x)) + computeLn(2));
  }
  
  return computeLn(x + sqrt(x*x + 1));
};

// Inverse hyperbolic cosine
export const taylorAcosh = (x) => {
  if (x < 1) return NaN;
  if (x === 1) return 0;
  
  return computeLn(x + sqrt(x*x - 1));
};

// Inverse hyperbolic tangent
export const taylorAtanh = (x) => {
  if (Math.abs(x) >= 1) return NaN;
  
  return 0.5 * computeLn((1 + x) / (1 - x));
};

export const taylorCos = (x) => Math.cos(x);
export const taylorTan = (x) => Math.tan(x);

export function dmsToDecimal(dmsString) {
  const parts = dmsString
    .split('°')
    .map(p => p.trim())
    .filter(p => p !== '');

  if (parts.length === 0 || parts.length > 3) {
    throw new Error("Invalid DMS format: too many components");
  }

  // Validate that all parts are numeric
  for (const part of parts) {
    if (isNaN(part)) {
      throw new Error("Invalid DMS format: all components must be numeric");
    }
  }

  const [deg = 0, min = 0, sec = 0] = parts.map(Number);

  // Ensure correct order: degrees is first, minutes second, etc.
  if (deg === undefined || min < 0 || sec < 0) {
    throw new Error("Invalid DMS format");
  }

  // Additional range validation (optional):
  if (min >= 60 || sec >= 60) {
    throw new Error("Minutes and seconds must be less than 60");
  }

  const decimal = deg + min / 60 + sec / 3600;
  return parseFloat(decimal.toFixed(6));
}

// Numerical differentiation using central difference method
export const taylorSin = (x) => Math.sin(x);

//arg
export function computeArg(z) {
  if (typeof z === 'number') {
    return z >= 0 ? 0 : Math.PI; // Arg(positive real) = 0, Arg(negative real) = π
  }

  const [a, b] = parseComplex(z);
  return Math.atan2(b, a); // returns angle in radians
}

export function computecongj(z) {
  if (typeof z === 'number') return `${z}-0i`; // real numbers only
  const [a, b] = parseComplex(z);
  return `${a}${b < 0 ? '+' : '-'}${Math.abs(b)}i`;
}

export function compute_abi(varName) {
  const z = getComplexByName(varName); // expected to return "a+bi" string
  if (typeof z === 'number') return `${z}+0i`;
  return z;
}

export function computePolar(varName) {
  const polar = getPolarByName(varName); // e.g., { r: 5, theta: 30 }

  const real = polar.r * Math.cos(toRadians(polar.theta));
  const imag = polar.r * Math.sin(toRadians(polar.theta));
  return `${real.toFixed(2)}${imag < 0 ? '-' : '+'}${Math.abs(imag).toFixed(2)}i`;
}

export function parseComplex(str) {
  // Remove all spaces
  str = str.replace(/\s+/g, '');

  // Handle pure imaginary numbers
  if (/^[+-]?\d*\.?\d*i$/.test(str)) {
    const b = parseFloat(str.replace('i', '')) || (str[0] === '-' ? -1 : 1);
    return [0, b];
  }

  // Handle real numbers
  if (/^[+-]?\d*\.?\d+$/.test(str)) {
    return [parseFloat(str), 0];
  }

  // Handle full complex numbers like "3+4i", "-2.5-1.1i"
  const match = str.match(/^([+-]?\d*\.?\d+)([+-]\d*\.?\d*)i$/);
  if (!match) throw new Error("Invalid complex format");
  return [parseFloat(match[1]), parseFloat(match[2])];
}

export const initDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expression TEXT NOT NULL,
        result TEXT NOT NULL,
        timestamp TEXT DEFAULT (datetime('now', 'localtime'))
      );`
    );

    return db;
  } catch (error) {
    console.error('DB init error:', error);
  }
};

export const insertRecord = async (expression = null, result = null) => {
  try {
    if (!db) {
      db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
    }

    const now = new Date().toLocaleString(); // e.g., "7/4/2025, 5:32:21 PM"

    if (expression && !result) {
      const results = await db.executeSql('SELECT COUNT(*) AS count FROM records');
      const count = results[0].rows.item(0).count;

      if (count >= 15) {
        const first = await db.executeSql('SELECT id FROM records ORDER BY id ASC LIMIT 1');
        const firstId = first[0].rows.item(0).id;

        await db.executeSql(
          'UPDATE records SET expression = ?, result = NULL, timestamp = ? WHERE id = ?',
          [expression, now, firstId]
        );
      } else {
        await db.executeSql(
          'INSERT INTO records (expression, result, timestamp) VALUES (?, NULL, ?)',
          [expression, now]
        );
      }

    } else if (!expression && result) {
      const res = await db.executeSql(
        'SELECT id FROM records WHERE result IS NULL ORDER BY id DESC LIMIT 1'
      );

      if (res[0].rows.length > 0) {
        const idToUpdate = res[0].rows.item(0).id;
        await db.executeSql(
          'UPDATE records SET result = ?, timestamp = ? WHERE id = ?',
          [result, now, idToUpdate]
        );
      } else {
        console.warn('No pending expression found to attach result to.');
      }

    } else if (expression && result) {
      const results = await db.executeSql('SELECT COUNT(*) AS count FROM records');
      const count = results[0].rows.item(0).count;

      if (count >= 15) {
        const first = await db.executeSql('SELECT id FROM records ORDER BY id ASC LIMIT 1');
        const firstId = first[0].rows.item(0).id;

        await db.executeSql(
          'UPDATE records SET expression = ?, result = ?, timestamp = ? WHERE id = ?',
          [expression, result, now, firstId]
        );
      } else {
        await db.executeSql(
          'INSERT INTO records (expression, result, timestamp) VALUES (?, ?, ?)',
          [expression, result, now]
        );
      }
    }
  } catch (error) {
    console.error('Insert/update error:', error);
  }
};

export const fetchRecords = async () => {
  try {
    if (!db) {
      db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
    }

    const results = await db.executeSql('SELECT * FROM records ORDER BY id ASC');
    const rows = results[0].rows;
    let data = [];
    for (let i = 0; i < rows.length; i++) {
      data.push(rows.item(i));
    }
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

export const deleteRecordById = async (id) => {
  try {
    if (!db) {
      db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
    }

    await db.executeSql('DELETE FROM records WHERE id = ?', [id]);
  } catch (error) {
    console.error('Delete by ID error:', error);
  }
};

export const deleteAllRecords = async () => {
  try {
    if (!db) {
      db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
    }

    await db.executeSql('DELETE FROM records');
  } catch (error) {
    console.error('Delete all error:', error);
  }
};

export function computeIntegration(a, b, functionExpr) {
  try {
    console.log(`Integration input: a=${a}, b=${b}, function=${functionExpr}`);
    
    // Parse bounds
    const lowerBound = parseFloat(a);
    const upperBound = parseFloat(b);
    
    if (isNaN(lowerBound) || isNaN(upperBound)) {
      return "Error: Invalid bounds";
    }

    // Clean and prepare the function expression
    let cleanExpr = functionExpr.toString().trim();
    console.log(`Original expression: ${cleanExpr}`);
    
    // Handle superscript numbers (X², X³, etc.)
    cleanExpr = cleanExpr.replace(/X²/g, 'x**2');
    cleanExpr = cleanExpr.replace(/X³/g, 'x**3');
    cleanExpr = cleanExpr.replace(/x²/g, 'x**2');
    cleanExpr = cleanExpr.replace(/x³/g, 'x**3');
    
    // Replace common mathematical operators and functions
    cleanExpr = cleanExpr.replace(/X/g, 'x');
    cleanExpr = cleanExpr.replace(/\^/g, '**');
    
    // Handle trigonometric functions - be more specific with replacements
    cleanExpr = cleanExpr.replace(/\bsin\(/g, 'Math.sin(');
    cleanExpr = cleanExpr.replace(/\bcos\(/g, 'Math.cos(');
    cleanExpr = cleanExpr.replace(/\btan\(/g, 'Math.tan(');
    cleanExpr = cleanExpr.replace(/\bexp\(/g, 'Math.exp(');
    cleanExpr = cleanExpr.replace(/\bsqrt\(/g, 'Math.sqrt(');
    cleanExpr = cleanExpr.replace(/\babs\(/g, 'Math.abs(');
    
    // Handle standalone sin, cos, tan without parentheses
    cleanExpr = cleanExpr.replace(/\bsin\b(?!\()/g, 'Math.sin');
    cleanExpr = cleanExpr.replace(/\bcos\b(?!\()/g, 'Math.cos');
    cleanExpr = cleanExpr.replace(/\btan\b(?!\()/g, 'Math.tan');
    
    // Handle logarithmic functions
    cleanExpr = cleanExpr.replace(/\blog\(/g, 'Math.log10(');
    cleanExpr = cleanExpr.replace(/\bln\(/g, 'Math.log(');
    
    // Handle constants
    cleanExpr = cleanExpr.replace(/\bPI\b/g, 'Math.PI');
    cleanExpr = cleanExpr.replace(/\bE\b/g, 'Math.E');
    
    console.log(`Cleaned expression: ${cleanExpr}`);

    // Create a function from the expression
    const f = new Function('x', `return ${cleanExpr};`);
    
    // Test the function with a sample value
    const testValue = (lowerBound + upperBound) / 2;
    const testResult = f(testValue);
    console.log(`Test evaluation at x=${testValue}: ${testResult}`);
    
    if (isNaN(testResult) || !isFinite(testResult)) {
      return "Error: Invalid function result";
    }

    // Simpson's Rule for numerical integration
    const n = 1000; // Number of intervals (must be even)
    const h = (upperBound - lowerBound) / n;
    
    let sum = f(lowerBound) + f(upperBound);
    
    // Add the odd-indexed terms (multiply by 4)
    for (let i = 1; i < n; i += 2) {
      sum += 4 * f(lowerBound + i * h);
    }
    
    // Add the even-indexed terms (multiply by 2)
    for (let i = 2; i < n; i += 2) {
      sum += 2 * f(lowerBound + i * h);
    }
    
    const result = (h / 3) * sum;
    console.log(`Integration result: ${result}`);
    return isFinite(result) ? result : "Error: Integration failed";
    
  } catch (error) {
    console.error("Integration error:", error);
    return "Error: " + error.message;
  }
}

// Enhanced Differentiation Function
export function computeDerivative(functionExpr, x0 = null) {
  try {
    // Clean and prepare the function expression
    let cleanExpr = functionExpr.toString().trim();
    
    // Replace common mathematical operators and functions
    cleanExpr = cleanExpr.replace(/X/g, 'x');
    cleanExpr = cleanExpr.replace(/\^/g, '**');
    cleanExpr = cleanExpr.replace(/sin/g, 'Math.sin');
    cleanExpr = cleanExpr.replace(/cos/g, 'Math.cos');
    cleanExpr = cleanExpr.replace(/tan/g, 'Math.tan');
    cleanExpr = cleanExpr.replace(/log/g, 'Math.log10');
    cleanExpr = cleanExpr.replace(/ln/g, 'Math.log');
    cleanExpr = cleanExpr.replace(/sqrt/g, 'Math.sqrt');
    cleanExpr = cleanExpr.replace(/exp/g, 'Math.exp');
    cleanExpr = cleanExpr.replace(/abs/g, 'Math.abs');
    cleanExpr = cleanExpr.replace(/PI/g, 'Math.PI');
    cleanExpr = cleanExpr.replace(/E/g, 'Math.E');

    // Create a function from the expression
    const f = new Function('x', `return ${cleanExpr};`);
    
    if (x0 !== null) {
      // Numerical derivative at specific point using central difference
      const point = parseFloat(x0);
      if (isNaN(point)) {
        return "Error: Invalid point";
      }
      
      const h = 1e-8; // Small step size
      const derivative = (f(point + h) - f(point - h)) / (2 * h);
      
      return isFinite(derivative) ? derivative : "Error: Derivative undefined";
    } else {
      // Return a function that computes derivative at any point
      return function(x) {
        const point = parseFloat(x);
        if (isNaN(point)) return NaN;
        
        const h = 1e-8;
        return (f(point + h) - f(point - h)) / (2 * h);
      };
    }
    
  } catch (error) {
    console.error("Differentiation error:", error);
    return "Error: " + error.message;
  }
}

// Advanced Integration with multiple methods
export function advancedIntegration(a, b, functionExpr, method = 'simpson') {
  try {
    const lowerBound = parseFloat(a);
    const upperBound = parseFloat(b);
    
    if (isNaN(lowerBound) || isNaN(upperBound)) {
      return "Error: Invalid bounds";
    }

    let cleanExpr = functionExpr.toString().trim();
    cleanExpr = cleanExpr.replace(/X/g, 'x');
    cleanExpr = cleanExpr.replace(/\^/g, '**');
    cleanExpr = cleanExpr.replace(/sin/g, 'Math.sin');
    cleanExpr = cleanExpr.replace(/cos/g, 'Math.cos');
    cleanExpr = cleanExpr.replace(/tan/g, 'Math.tan');
    cleanExpr = cleanExpr.replace(/log/g, 'Math.log10');
    cleanExpr = cleanExpr.replace(/ln/g, 'Math.log');
    cleanExpr = cleanExpr.replace(/sqrt/g, 'Math.sqrt');
    cleanExpr = cleanExpr.replace(/exp/g, 'Math.exp');
    cleanExpr = cleanExpr.replace(/abs/g, 'Math.abs');
    cleanExpr = cleanExpr.replace(/PI/g, 'Math.PI');
    cleanExpr = cleanExpr.replace(/E/g, 'Math.E');

    const f = new Function('x', `return ${cleanExpr};`);
    
    switch (method.toLowerCase()) {
      case 'simpson':
        return simpsonRule(f, lowerBound, upperBound);
      case 'trapezoidal':
        return trapezoidalRule(f, lowerBound, upperBound);
      case 'romberg':
        return rombergIntegration(f, lowerBound, upperBound);
      default:
        return simpsonRule(f, lowerBound, upperBound);
    }
    
  } catch (error) {
    return "Error: " + error.message;
  }
}

// Simpson's Rule implementation
function simpsonRule(f, a, b, n = 1000) {
  if (n % 2 !== 0) n++; // Ensure n is even
  
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  
  for (let i = 1; i < n; i += 2) {
    sum += 4 * f(a + i * h);
  }
  
  for (let i = 2; i < n; i += 2) {
    sum += 2 * f(a + i * h);
  }
  
  return (h / 3) * sum;
}

// Trapezoidal Rule implementation
function trapezoidalRule(f, a, b, n = 1000) {
  const h = (b - a) / n;
  let sum = (f(a) + f(b)) / 2;
  
  for (let i = 1; i < n; i++) {
    sum += f(a + i * h);
  }
  
  return h * sum;
}

// Romberg Integration (more accurate)
function rombergIntegration(f, a, b, maxSteps = 10) {
  const R = [];
  const h = b - a;
  
  // Initialize first column
  R[0] = [h * (f(a) + f(b)) / 2];
  
  for (let i = 1; i <= maxSteps; i++) {
    // Composite trapezoidal rule
    const step = h / Math.pow(2, i);
    let sum = 0;
    
    for (let j = 1; j <= Math.pow(2, i-1); j++) {
      sum += f(a + (2*j - 1) * step);
    }
    
    R[i] = [R[i-1][0] / 2 + step * sum];
    
    // Richardson extrapolation
    for (let j = 1; j <= i; j++) {
      const factor = Math.pow(4, j);
      R[i][j] = (factor * R[i][j-1] - R[i-1][j-1]) / (factor - 1);
    }
  }
  
  return R[maxSteps][maxSteps];
}

// Symbolic differentiation for common functions
function symbolicDerivative(functionExpr) {
  let expr = functionExpr.toString().trim();
  
  // Simple symbolic differentiation rules
  const rules = {
    // Power rule: x^n -> n*x^(n-1)
    'x\\*\\*([0-9]+)': (match, n) => {
      const power = parseInt(n);
      if (power === 1) return '1';
      if (power === 2) return '2*x';
      return `${power}*x**(${power-1})`;
    },
    
    // Trigonometric functions
    'Math\\.sin\\(x\\)': 'Math.cos(x)',
    'Math\\.cos\\(x\\)': '-Math.sin(x)',
    'Math\\.tan\\(x\\)': '1/(Math.cos(x)**2)',
    
    // Exponential and logarithmic
    'Math\\.exp\\(x\\)': 'Math.exp(x)',
    'Math\\.log\\(x\\)': '1/x',
    'Math\\.log10\\(x\\)': '1/(x*Math.log(10))',
    
    // Constants
    '^[0-9\\.]+$': '0',
    '^x$': '1'
  };
  
  for (const [pattern, replacement] of Object.entries(rules)) {
    if (typeof replacement === 'function') {
      expr = expr.replace(new RegExp(pattern, 'g'), replacement);
    } else {
      expr = expr.replace(new RegExp(pattern, 'g'), replacement);
    }
  }
  
  return expr;
}

export function tenPower(x) {
  // Approximate ln(10) manually
  const ln10 = 2.302585092994046; // Precomputed constant

  // Calculate e^(x * ln(10)) manually using Taylor series
  const y = x * ln10;
  const nTerms = 30; // More terms = better accuracy

  let result = 1;
  let term = 1;

  for (let i = 1; i < nTerms; i++) {
    term *= y / i;
    result += term;
  }

  return result;
}


let seed = Date.now() % 1000000;

// Returns a float in [0, 1)
export function RanSharp() {
  const a = 1664525;
  const c = 1013904223;
  const m = 4294967296;

  seed = (a * seed + c) % m;
  return seed / m;
}

// Returns an integer between a and b (inclusive)
export function RanInt(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number' || a > b) {
    throw new Error('RanInt expects two numbers where a <= b');
  }
  const range = b - a + 1;
  return a + Math.floor(RanSharp() * range);
}

//////////////////////////////////////////////////////////////////////

function convertDecimalToDMS(decimal) {
  const degrees = Math.floor(decimal);
  const remaining = (decimal - degrees) * 60;
  const minutes = Math.floor(remaining);
  const seconds = Math.round((remaining - minutes) * 60);

  return `${degrees}°${minutes}'${seconds}"`; // 
}

function toggleDMSDisplay(currentValue, originalDecimal) {
  if (!currentValue) {
    return { output: "°", updatedOriginal: null }; 
  }

  if (!isNaN(parseFloat(currentValue))) {
    const decimal = parseFloat(currentValue);
    const dms = convertDecimalToDMS(decimal);
    return { output: dms, updatedOriginal: currentValue };
  }

  if (currentValue.includes("°") && originalDecimal !== null) {
    return { output: originalDecimal, updatedOriginal: null };
  }

  return { output: currentValue, updatedOriginal: originalDecimal };
}
