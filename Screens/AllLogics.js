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
export const taylorSin = (x) => {
  x = normalizeAngle(x);
  let sum = 0;
  let term = x;
  let n = 0;
  
  while (Math.abs(term) > 1e-15 && n < 20) {
    sum += term;
    n++;
    term *= -x * x / ((2 * n) * (2 * n + 1));
  }
  return sum;
};

// Cosine function using Taylor series (with more terms for better accuracy)
export const taylorCos = (x) => {
  x = normalizeAngle(x);
  let sum = 1;
  let term = 1;
  let n = 0;
  
  while (Math.abs(term) > 1e-15 && n < 20) {
    n++;
    term *= -x * x / ((2 * n - 1) * (2 * n));
    sum += term;
  }
  return sum;
};

// Tangent function using sine and cosine
export const taylorTan = (x) => {
  // Check for values close to π/2 + nπ where tangent is undefined
  const normalized = normalizeAngle(x);
  if (Math.abs(Math.abs(normalized) - PI/2) < 1e-10) {
    return Infinity * Math.sign(normalized);
  }
  
  const sinVal = taylorSin(x);
  const cosVal = taylorCos(x);
  
  if (Math.abs(cosVal) < 1e-10) {
    return Infinity * Math.sign(sinVal);
  }
  return sinVal / cosVal;
};

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
    return Math.sign(x) * (taylorLn(Math.abs(x)) + taylorLn(2));
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


// Numerical integration using Simpson's 1/3 rule
export const computeIntegration = (a, b, fx) => {
  try {
    // Evaluate a and b
    a = evaluateExpression(a);
    b = evaluateExpression(b);
    if (isNaN(a) || isNaN(b)) return "Error: Invalid bounds";

    // Number of intervals (must be even for Simpson's rule)
    const n = 1000; // Adjust for precision
    if (n % 2 !== 0) throw new Error("Number of intervals must be even");

    const h = (b - a) / n;
    let sum = 0;

    // Evaluate f(x) at each point
    for (let i = 0; i <= n; i++) {
      const x = a + i * h;
      // Replace 'x' in fx with the current x value
      let fxi = fx.replace(/\bx\b/g, `(${x})`);
      fxi = evaluateExpression(fxi);
      if (isNaN(fxi)) return "Error: Invalid integrand";

      // Simpson's rule coefficients
      if (i === 0 || i === n) {
        sum += fxi;
      } else if (i % 2 === 0) {
        sum += 2 * fxi;
      } else {
        sum += 4 * fxi;
      }
    }

    // Compute final result
    const result = (h / 3) * sum;
    return result;
  } catch (error) {
    console.error("Integration error:", error);
    return "Error";
  }
};


// Numerical differentiation using central difference method
export const computeDerivative = (fx, x0) => {
  try {
    // If x0 is not provided, default to x = 0
    x0 = x0 ? evaluateExpression(x0) : 0;
    if (isNaN(x0)) return "Error: Invalid evaluation point";

    // Small step size for numerical differentiation
    const h = 0.0001; // Adjust for precision

    // Central difference: (f(x0+h) - f(x0-h)) / (2h)
    let fxPlusH = fx.replace(/\bx\b/g, `(${x0 + h})`);
    let fxMinusH = fx.replace(/\bx\b/g, `(${x0 - h})`);

    fxPlusH = evaluateExpression(fxPlusH);
    fxMinusH = evaluateExpression(fxMinusH);

    if (isNaN(fxPlusH) || isNaN(fxMinusH)) return "Error: Invalid function";

    const result = (fxPlusH - fxMinusH) / (2 * h);
    return result;
  } catch (error) {
    console.error("Differentiation error:", error);
    return "Error";
  }
};