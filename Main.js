import React, {useState, useEffect, useRef} from "react";
import { View, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Text, Image} from "react-native";
import { factorial , PI,E,abs,sqrt, div_mul, divide, cbrt, square, cube, x_yrt,
  makeNegative, computeLog10, computeLn,computeLogBase, 
  computeSummation,taylorSin,taylorTan,taylorCos,taylorAsin,taylorAcos,taylorAtan,
taylorSinh,taylorCosh,taylorTanh,taylorAsinh,taylorAcosh,taylorAtanh,initDB,insertRecord,computeIntegration,computeDerivative,
Rand,advancedIntegration,symbolicDerivative,tenPower,RanSharp,RanInt} from "./Screens/AllLogics";
import { computeArg,computecongj,compute_abi,computePolar } from "./Screens/ComplexModeLogics";




//ya mainfunction hai
function Main({navigation,ActualMode,setActualMode,route}){
  
  const [shift, setShift] = useState(false);
  const[DRG, setDRG]= useState('DEG');
  const[alpha,setAlpha]=useState(false);
  const[SA,setSA]=useState('off');
  const [expressionInput, setExpressionInput] = useState(''); 
  const [cursorPosition, setCursorPosition] = useState(null);
  const inputRef = useRef(null);
  const[result,setResult]=useState('');
  const[FirstPlaceHolderPosition,setFirstPlaceholderPosition]=useState(null);
  const[SecondPlaceHolderPosition,setSecondPlaceholderPosition]=useState(null);
  const[FunctionType,setFunctionType]=useState(null);
  const[IsEnteringExponent,setIsEnteringExponent]=useState(false);
  const[ThirdPlaceHolderPosition,setThirdPlaceholderPosition]=useState(null);
  const[BaseStartPosition,setBaseStartPosition]=useState(null);
  const[ExponentStartPosition,setExponentStartPosition]=useState(null);
  const [lastresult,setLastResult]=useState(null);
  let hypitems= route?.params?.hypvalues??null;
  let eqvalues=route?.params?.equation??null;
  const [shiftSeven, setShiftSeven] = useState(route?.params?.shiftsvn ?? null);
  const [shiftSeven2, setShiftSeven2] = useState(route?.params?.shiftsn ?? null);
  const [shifttwo, setshifttwo] = useState(route?.params?.complxvalues??null);
  const [questions, setquestions] = useState(route?.params?.question??null);
  const [answers, setanswers] = useState(route?.params?.answer??null);
  const [vectors, setvectors] = useState(route?.params?.vector??null);
  const [vecresults, setvecresults] = useState(route?.params?.vecresult??null);
  const [bases, setbases] = useState(route?.params?.base??null);
  const [baseresults, setbaseresults] = useState(route?.params?.baseresult??null);
  const [graphcount,setgraphcount]=useState(0)
  
 


// Special tokens that should be deleted as a whole
  const specialTokens = [
    'sin(□)', 'cos(□)', 'tan(□)', 'hyp(□)', 'log(□)', 'Ln(□)', 
    'sin⁻¹(□)', 'cos⁻¹(□)', 'tan⁻¹(□)', 'sinh(□)', 'cosh(□)', 'tanh(□)','□^□','□!','□/□','□*(□/□)','log□(□)','□√□',
    '√□','∛□','□²','□³','10^□','e^□','|□|'

  ];


const DRGHandling=()=>{
  if(DRG==='DEG'){
    setDRG('RAD')
  }
  else if(DRG==='RAD'){
    setDRG('GRAD')
  }
  else{
    setDRG('DEG')
  }
}


//Alpha
const AlphaHandling=()=>{
 setAlpha(!alpha)
}
//Shift
const ShiftHandling=()=>{
 setShift(!shift)
}
//ShiftAlphaHandling
const ShiftAlphaHandling=()=>{
if(shift===true && alpha===false ){
  setSA('Shift');
}
else if(shift===false && alpha===true){
  setSA('Alpha');
}
else if(shift===false && alpha===false){
  setSA('off');
}
else if(shift===true && alpha===true){
  setAlpha(false)
  setShift(false)
  setSA('off');
}
}
//modes handling 
const ModeHandling=()=>{
if(shift===true){
  navigation.navigate('ShiftMode');
}
else if(shift===false){
  navigation.navigate('SimpleMode')
}
}

 useEffect(() => {
  (async () => {
    await initDB();
  })();
    ShiftAlphaHandling();
    ShowHyp();

  }, [shift, alpha,hypitems,eqvalues]);


  // handle text on button clicks
const HandleNumberClick=(number)=>{

  const currentPos= cursorPosition!==null? cursorPosition: expressionInput.length
  if (currentPos< expressionInput.length && expressionInput[currentPos]==='□'){
    const newExpression= expressionInput.substring(0,currentPos)+number+expressionInput.substring(currentPos+1);  //replace that box with a number
      setExpressionInput(newExpression);
      
      setCursorPosition(currentPos + 1);
  }
 
else if(shift===true && number==='7'){
    navigation.navigate('Shiftseven')
  }

else if(shift===true && number==='8'){
    navigation.navigate('Shifteight')
  }

else if(shift===true && number==='2'&& ActualMode==='CMPLX'){
    navigation.navigate('ShiftTwo')
  }

else if(shift===true && number==='0'){
  handleRand();
}

else{
   const newExpression= expressionInput.substring(0,currentPos)+number+expressionInput.substring(currentPos);  // ab □ exist ne krta just add value at current Position 
      setExpressionInput(newExpression);
      setCursorPosition(currentPos + 1); 
  }
  
}

  // Implementation for x^-1 button (reciprocal) 
  const handleReciprocal = () => {

    if(shift===false){
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "□^(-1)" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos); 
    setCursorPosition(currentPos + 1); // Position cursor after box
    setFunctionType('reciprocal');
    }
    else if(shift===true){
      const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "□!" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
     setFirstPlaceholderPosition(currentPos);
    setFunctionType('factorial');
    setCursorPosition(currentPos - 2); // Position cursor after box
    }
  };


const handleSummation = (expr) => {
  const sumRegex = /∑\((\w+),\s*(-?\d+),\s*(-?\d+),\s*([^)]+)\)/;

  const match = expr.match(sumRegex);
  if (!match) return null;

  const [, variable, start, end, innerExpr] = match;

  let total = 0;
  for (let i = parseInt(start); i <= parseInt(end); i++) {
    // Replace all instances of the variable with the value in parentheses to preserve order
    const replaced = innerExpr.replace( new RegExp(`\\b${variable}\\b`,'g'),`(${i})` );
    const val = evaluateExpression(replaced);
    if (val === 'Error') return 'Error';
    total += parseFloat(val);
  }

  return total;
};

  // handle log₂y clicks

  
const handleLog2y = () => {
  if(shift===false){

  
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + "log□(□)" + 
                       expressionInput.substring(currentPos);
  
  setExpressionInput(newExpression);
  setFirstPlaceholderPosition(currentPos + 5);
  setFunctionType('log2');
  setCursorPosition(currentPos + 6); // Position cursor after box
  }
  else if(shift===true&& ActualMode==='COMP'){
     
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + "∑(x,□,□,□)" + 
                       expressionInput.substring(currentPos);
  
  setExpressionInput(newExpression);
  setFirstPlaceholderPosition(currentPos + 4);
setSecondPlaceholderPosition(currentPos+2)
setThirdPlaceholderPosition(currentPos+2)
  setCursorPosition(currentPos + 1); // Position cursor after box 
  }
};

// handle x/y click
  const handlexDividey = () => {
    if(shift==false){
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "□/□" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos);
    setSecondPlaceholderPosition(currentPos + 2);
    setFunctionType('x/y');
    setIsEnteringExponent(false);
    setCursorPosition(currentPos + 1); // Position cursor after first box
    }
    else if(shift===true){

    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "□*(□/□)" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos);
    setSecondPlaceholderPosition(currentPos + 3);
    setThirdPlaceholderPosition(currentPos+5)
    setFunctionType('x/y');
    setIsEnteringExponent(false);
    setCursorPosition(currentPos + 7); // Position cursor after first box
    

    }
  };
//handle squareroot click 
  const handleSqCubrt = () => {
    if(shift===false){
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "√□" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setCursorPosition(currentPos + 2); // Position cursor after box
    }
    else if(shift===true){
     const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "∛□" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setCursorPosition(currentPos + 3); // Position cursor after box 
    }
  };

//handle square and cube button clicks
const handlesquare_cube = () => {

    if(shift===false){
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "□²" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos);
    setFunctionType('square');
    setCursorPosition(currentPos + 2); // Position cursor after box
    }
    else if(shift===true){
      const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "□³" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos);
    setFunctionType('cube');
    setCursorPosition(currentPos + 2); // Position cursor after box
    }
  };


//handle x power y and x underroot y clicks
const handlexPowery = () => {
  if(shift===false){
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + "□^□" + 
                       expressionInput.substring(currentPos);
  
  setExpressionInput(newExpression);
  setBaseStartPosition(currentPos);
  setExponentStartPosition(currentPos + 2);
  setIsEnteringExponent(false);
  setCursorPosition(currentPos + 1); // Position cursor after first box
  }
  else if(shift===true){
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + "□√□" + 
                       expressionInput.substring(currentPos);
  
  setExpressionInput(newExpression);
  setBaseStartPosition(currentPos);
  setExponentStartPosition(currentPos + 2);
  setIsEnteringExponent(false);
  setCursorPosition(currentPos + 1); // Position cursor after first box
  
  }
};


//handle log and anti log clicks
const Handlelog_antilog = () => {

    if(shift===false){
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "log(□)" + 
                         expressionInput.substring(currentPos);
  setExpressionInput(newExpression);
   setFirstPlaceholderPosition(currentPos + 4);
  setFunctionType('log');
  setCursorPosition(currentPos + 5);  // Position cursor after box
    }
    else if(shift===true){
      const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "10^□" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos+3);
    setFunctionType('cube');
    setCursorPosition(currentPos + 4); // Position cursor after box
    }
  };

  //handle Ln clicks
const HandleLn = () => {

    if(shift===false){
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "Ln(□)" + 
                         expressionInput.substring(currentPos);
  setExpressionInput(newExpression);
   setFirstPlaceholderPosition(currentPos + 3);
  setFunctionType('log');
  setCursorPosition(currentPos + 5);  // Position cursor after box
    }
    else if(shift===true){
      const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "e^□" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos+2);
    setFunctionType('cube');
    setCursorPosition(currentPos + 4); // Position cursor after box
    }
  };

  
//handle hyperbolic menu on button 
const HandleHyp=(variable)=>{
if(shift===true&& variable=='c'&& alpha===false ){
HandleVariables(variable);
}
else if(shift===false && variable==='c' && alpha===false){    
navigation.navigate('HyperbolicMenu');
}
else if(shift===false && variable==='c' && alpha===true){
  HandleVariables(variable)
}
}

const HandleVariables=(variable)=>{

    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;

   if(shift===true && variable==='a' && alpha===false && ActualMode==='CMPLX'){
      setExpressionInput(expressionInput.substring(0, currentPos) + '∠' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   } 
   else if(shift===false && variable==='a' && alpha===false && ActualMode==='COMP'){
      setExpressionInput(expressionInput.substring(0, currentPos) + '-' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
   else if(shift===false && variable==='a' && alpha===true ){
      setExpressionInput(expressionInput.substring(0, currentPos) + 'A' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
   else if(  variable==='b' && alpha===false){
      setExpressionInput(expressionInput.substring(0, currentPos) + '°' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
   else if(shift===false && variable==='b'&&alpha===true){
     setExpressionInput(expressionInput.substring(0, currentPos) + 'B' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
    else if(  shift===true&& variable==='c' && alpha===false){
      setExpressionInput(expressionInput.substring(0, currentPos) + ' |□|' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
   else if( shift===false&& variable==='c' && alpha===true){
     setExpressionInput(expressionInput.substring(0, currentPos) + 'C' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
   else if(shift===true&& variable==='d' && alpha===false){
    const newExpression = expressionInput.substring(0, currentPos) + "sin⁻¹(□)" + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 6);
    setFunctionType('asin');
    setCursorPosition(currentPos + 7);
   }
   else if(shift===false&& variable==='d' && alpha===true){
    setExpressionInput(expressionInput.substring(0, currentPos) + 'D' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
    else if(shift===false&& variable==='d' && alpha===false){
    const newExpression = expressionInput.substring(0, currentPos) + "sin(□)" + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 4);
    setFunctionType('asin');
    setCursorPosition(currentPos + 5);
   }
else if(shift===true&& variable==='c' && alpha===false){
    const newExpression = expressionInput.substring(0, currentPos) + "sin⁻¹(□)" + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 6);
    setFunctionType('asin');
    setCursorPosition(currentPos + 7);
   }
   else if(shift===false&& variable==='c' && alpha===true){
    setExpressionInput(expressionInput.substring(0, currentPos) + 'D' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
    else if(shift===false&& variable==='c' && alpha===false){
    const newExpression = expressionInput.substring(0, currentPos) + "sin(□)" + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 4);
    setFunctionType('asin');
    setCursorPosition(currentPos + 5);
   }
   
else if(shift===true&& variable==='e' && alpha===false){
    const newExpression = expressionInput.substring(0, currentPos) + "cos⁻¹(□)" + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 6);
    setFunctionType('asin');
    setCursorPosition(currentPos + 7);
   }
   else if(shift===false&& variable==='e' && alpha===true){
    setExpressionInput(expressionInput.substring(0, currentPos) + 'E' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
    else if(shift===false&& variable==='e' && alpha===false){
    const newExpression = expressionInput.substring(0, currentPos) + "cos(□)" + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 4);
    setFunctionType('asin');
    setCursorPosition(currentPos + 5);
   } 
   else if(shift===true && variable==='i' && alpha===false && ActualMode==='CMPLX'){
      setExpressionInput(expressionInput.substring(0, currentPos) + 'i' + expressionInput.substring(currentPos));
      setCursorPosition(currentPos + 1);
   }

     
else if(shift===true&& variable==='f' && alpha===false){
    const newExpression = expressionInput.substring(0, currentPos) + "tan⁻¹(□)" + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 6);
    setFunctionType('asin');
    setCursorPosition(currentPos + 7);
   }
   else if(shift===false&& variable==='f' && alpha===true){
    setExpressionInput(expressionInput.substring(0, currentPos) + 'F' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
   }
    else if(shift===false&& variable==='f' && alpha===false){
    const newExpression = expressionInput.substring(0, currentPos) + "tan(□)" + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 4);
    setFunctionType('asin');
    setCursorPosition(currentPos + 5);
   }
     // Parentheses
  else if (shift === false && variable === '(' ) {
    setExpressionInput(expressionInput.substring(0, currentPos) + '(' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
  }
   else if (shift === true && variable === '(') {
    setExpressionInput(expressionInput.substring(0, currentPos) + '%' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
  }
  else if (shift === false && variable === ')' && alpha===false) {
    setExpressionInput(expressionInput.substring(0, currentPos) + ')' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
  }
 else if (shift === true && variable === ')'&& alpha===false) {
    setExpressionInput(expressionInput.substring(0, currentPos) + ',' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
  }
   else if (shift === false && variable === ')' && alpha===true) {
    setExpressionInput(expressionInput.substring(0, currentPos) + 'X' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
  }
  else if (shift === false && variable === 'y' && alpha===true) {
    setExpressionInput(expressionInput.substring(0, currentPos) + 'Y' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
  }
else if(shift === false && variable === 'm' && alpha===true){
 setExpressionInput(expressionInput.substring(0, currentPos) + 'M+' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
}
else if(shift === true && variable === 'm' && alpha===false){
 setExpressionInput(expressionInput.substring(0, currentPos) + 'M-' + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
}
}

// Function to handle operator clicks
  const handleOperatorClick = (operator) => {
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    setExpressionInput(expressionInput.substring(0, currentPos) + operator + expressionInput.substring(currentPos));
    setCursorPosition(currentPos + 1);
  };


// handle decimal click 
const handleDecimalClick = () => {
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;

  // If ALPHA is active → Insert RanInt(□,□)
  if (alpha === true) {
    const insertText = 'RanInt(□,□)';
    setExpressionInput(
      expressionInput.substring(0, currentPos) +
      insertText +
      expressionInput.substring(currentPos)
    );
    setFirstPlaceholderPosition(currentPos + 7); // position of first □
    setSecondPlaceholderPosition(currentPos + 9); // position of second □
    setCursorPosition(currentPos + 11); // after last )
    return;
  }

  // If SHIFT is active → Insert Ran# (converted to Rand() in evaluator)
  else if (shift === true) {
    const insertText = 'Rand()';
    setExpressionInput(
      expressionInput.substring(0, currentPos) +
      insertText +
      expressionInput.substring(currentPos)
    );
    setCursorPosition(currentPos + insertText.length);
    return;
  }

  // Default behavior: Insert decimal only if last number doesn't already have one
  const parts = expressionInput.split(/[\+\-\*X÷\/\(\)]/); // Add more symbols as needed
  const lastPart = parts[parts.length - 1];

  if (!lastPart.includes('.')) {
    setExpressionInput(
      expressionInput.substring(0, currentPos) +
      '.' +
      expressionInput.substring(currentPos)
    );
    setCursorPosition(currentPos + 1);
  }
};

//handle hyperbolic values
const ShowHyp=()=>{
if(hypitems!==null&&shift==false){
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + hypitems + 
                         expressionInput.substring(currentPos);
  setExpressionInput(newExpression);
   setFirstPlaceholderPosition(currentPos + 6);
  setCursorPosition(currentPos + 8);  
  hypitems=null;
}
else if(eqvalues!=null){
   const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + eqvalues + 
                         expressionInput.substring(currentPos);
                           setExpressionInput(newExpression);
  setFirstPlaceholderPosition(currentPos + 6);
  setCursorPosition(currentPos + 8);  
  eqvalues=null;
}
  else if (shiftSeven !== null && shiftSeven2 !== null) {
  console.log('before= ' + shiftSeven);

  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + shiftSeven + expressionInput.substring(currentPos);
  setExpressionInput(newExpression);

  // Clear after use
  

  console.log('after= ' + shiftSeven);  // Will still show old value because it's not updated immediately
}
else if (shifttwo != null) {
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + shifttwo + expressionInput.substring(currentPos);
  setExpressionInput(newExpression);
  setshifttwo(null);
}

else if (questions !== null && answers !== null) {
  console.log('before= ' + shiftSeven);

  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + questions + expressionInput.substring(currentPos);
  setExpressionInput(newExpression);


  

  console.log('after= ' + questions);  // Will still show old value because it's not updated immediately
}

 else if (vecresults !== null && vectors !== null) {
  console.log('before= ' + vectors);

  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + vectors + expressionInput.substring(currentPos);
  setExpressionInput(newExpression);

  // Clear after use
  

  console.log('after= ' + vectors);  // Will still show old value because it's not updated immediately
}

 else if (bases !== null && baseresults !== null) {
  console.log('before= ' + bases);

  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + bases + expressionInput.substring(currentPos);
  setExpressionInput(newExpression);

  // Clear after use
  

  console.log('after= ' + bases);  // Will still show old value because it's not updated immediately
}

                         

}


const handle_integration_and_derivation = () => {
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;

  if (!shift) {
    const newExpression = expressionInput.substring(0, currentPos) + '∫(a,b,f(x),dx)' +
                          expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 6);
    setCursorPosition(currentPos + 3);
  } else {
    const newExpression = expressionInput.substring(0, currentPos) + 'd/dx(f(x),x0)' +
                          expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 6);
    setCursorPosition(currentPos + 3);
  }
};


  // Find if the expression ends with a special token
  const findSpecialToken = (expression) => {
    for (const token of specialTokens) {
      if (expression.endsWith(token)) {
        return token;
      }
    }
    return null;
  };

    // Enhanced backspace function
  const handleBackspace = () => {
    if (expressionInput.length > 0) {
      const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
      
      if (currentPos > 0) {
        // Check if we're deleting a special token
        const token = findSpecialToken(expressionInput.substring(0, currentPos));
        
        if (token) {
          // Delete entire token
          const newExpression = expressionInput.substring(0, currentPos - token.length) + 
                               expressionInput.substring(currentPos);
          setExpressionInput(newExpression);
          setCursorPosition(currentPos - token.length);
        } else {
          // Delete single character at cursor position
          const newExpression = expressionInput.substring(0, currentPos - 1) + 
                               expressionInput.substring(currentPos);
          setExpressionInput(newExpression);
          setCursorPosition(currentPos - 1);
        }
      }
    }
  };
  


const HandleClear=()=>{
  setExpressionInput('');
  setResult('');
}

const handleAns=()=>{
if(lastresult){
  setExpressionInput(expressionInput+lastresult)

}
}


const evaluateExpression = (expr) => {
  console.log(`Original expression: ${expr}`);
  
  if (expr.includes('∑(')) {
    const result = handleSummation(expr);
    if (result !== null) return result;
  }

  // Handle integration BEFORE other replacements - improved regex
  expr = expr.replace(/∫\(([^,]+),([^,]+),([^,]+),dx\)/g, (match, a, b, fx) => {
    console.log(`Integration match: a=${a}, b=${b}, fx=${fx}`);
    return `computeIntegration(${a}, ${b}, "${fx}")`;
  });

  // Handle differentiation BEFORE other replacements - improved regex
  expr = expr.replace(/d\/dx\(([^,]+)(?:,([^)]+))?\)/g, (match, fx, x0) => {
    console.log(`Differentiation match: fx=${fx}, x0=${x0}`);
    return x0 ? `computeDerivative("${fx}", ${x0})` : `computeDerivative("${fx}")`;
  });

  //console.log(`After integration/differentiation replacement: ${expr}`);

  // Replace operators for JavaScript evaluation (only if not already handled)
  if (!expr.includes('computeIntegration') && !expr.includes('computeDerivative')) {
    expr = expr.replace(/X/g, '*');
    expr = expr.replace(/÷/g, '/');
    expr = expr.replace(/\^/g, '**');

    // Handle factorial e.g., 5! => factorial(5)
    expr = expr.replace(/(\d+|\([^()]*\))\s*!/g, 'factorial($1)');

    // Handle x⁻¹ => 1/x or (expr)⁻¹ => 1/(expr)
    expr = expr.replace(/(\d+|\([^()]*\))⁻¹/g, '(1/($1))');

    // Handle division e.g., a / b => divide(a, b)
    expr = expr.replace(/(\w+|\([^()]*\))\s*\/\s*(\w+|\([^()]*\))/g, 'divide($1, $2)');

    // Handle expressions like x*(y/z) => multiply(x, divide(y, z))
    expr = expr.replace(/(\w+)\s*\*\s*\(\s*(\w+)\s*\/\s*(\w+)\s*\)/g, 'multiply($1, divide($2, $3))');

    // Handle special functions
    expr = expr.replace(/√(\d+|\([^()]*\))/g, 'sqrt($1)');
    expr = expr.replace(/∛\s*(\w+|\([^()]*\))/g, 'cbrt($1)');
    expr = expr.replace(/(\d+(\.\d+)?|\w+|\([^()]*\))²/g, 'square($1)');
    expr = expr.replace(/(\w+|\([^()]*\))³/g, 'cube($1)');
    expr = expr.replace(/(\w+|\([^()]*\))\s*\^\s*(\w+|\([^()]*\))/g, 'power($1, $2)');
    expr = expr.replace(/(\w+|\([^()]*\))\s*√\s*(\w+|\([^()]*\))/g, 'x_yrt($2, $1)');
    expr = expr.replace(/-\s*(\w+|\([^()]*\))/g, 'makeNegative($1)');
    expr = expr.replace(/log\(([^)]+)\)/g, 'computeLog10($1)');
    expr = expr.replace(/Ln\(([^)]+)\)/g, 'computeLn($1)');
    expr = expr.replace(/log(\d+)\(([^)]+)\)/g, 'computeLogBase($2, $1)');
    expr = expr.replace(/∑\(([^,]+),([^,]+),([^,]+),([^)]+)\)/g, 'computeSummation($1, $2, $3, $4)');
   expr = expr.replace(/arg\(([^)]+)\)/gi, 'computeArg($1)');
   expr = expr.replace(/conjg\(([^)]+)\)/gi, 'computecongj($1)');
   expr = expr.replace(/([a-zA-Z0-9_]+)\s*▶\s*a\+bi/gi, 'compute_abi($1)');
  expr = expr.replace(/([a-zA-Z0-9_]+)\s*▶\s*r∠θ/gi, 'computePolar($1)');


    // Convert angles based on DRG mode for trigonometric functions
    if (typeof DRG !== 'undefined' && DRG !== 'RAD') {
      expr = expr.replace(/taylorSin\(([^)]+)\)/g, `taylorSin(convertAngleToRadians($1, '${DRG}'))`);
      expr = expr.replace(/taylorCos\(([^)]+)\)/g, `taylorCos(convertAngleToRadians($1, '${DRG}'))`);
      expr = expr.replace(/taylorTan\(([^)]+)\)/g, `taylorTan(convertAngleToRadians($1, '${DRG}'))`);
      expr = expr.replace(/taylorAsin\(([^)]+)\)/g, `convertRadiansToAngle(taylorAsin($1), '${DRG}')`);
      expr = expr.replace(/taylorAcos\(([^)]+)\)/g, `convertRadiansToAngle(taylorAcos($1), '${DRG}')`);
      expr = expr.replace(/taylorAtan\(([^)]+)\)/g, `convertRadiansToAngle(taylorAtan($1), '${DRG}')`);
    }

    // Original trig function replacements
    expr = expr.replace(/sin\(/g, 'taylorSin(');
    expr = expr.replace(/cos\(/g, 'taylorCos(');
    expr = expr.replace(/tan\(/g, 'taylorTan(');
    expr = expr.replace(/sin⁻¹\(/g, 'taylorAsin(');
    expr = expr.replace(/cos⁻¹\(/g, 'taylorAcos(');
    expr = expr.replace(/tan⁻¹\(/g, 'taylorAtan(');
    expr = expr.replace(/sinh\(/g, 'taylorSinh(');
    expr = expr.replace(/cosh\(/g, 'taylorCosh(');
    expr = expr.replace(/tanh\(/g, 'taylorTanh(');
    expr = expr.replace(/sinh⁻¹\(/g, 'taylorAsinh(');
    expr = expr.replace(/cosh⁻¹\(/g, 'taylorAcosh(');
    expr = expr.replace(/tanh⁻¹\(/g, 'taylorAtanh(');
     expr = expr.replace(/π/g, 'PI');
    expr = expr.replace(/e/g, 'E')
    expr = expr.replace(/10\^(\d+(\.\d+)?|\([^()]*\))/g, 'tenPower($1)');
    expr = expr.replace(/Rand\(\)/g, () => RanSharp());
  expr = expr.replace(/RanInt\((\d+),\s*(\d+)\)/g, (_, a, b) => RanInt(Number(a), Number(b)))


  }

  console.log(`Final expression before evaluation: ${expr}`);

  try {
    const evalInScope = new Function(
      'PI', 'E', 'factorial', 'abs', 'sqrt', 'divide', 'div_mul', 'cbrt', 'square', 'cube', 'x_yrt', 'makeNegative',
      'computeLog10', 'computeLn', 'computeLogBase', 'computeIntegration', 'computeDerivative', 'computeSummation',
      'taylorSin', 'taylorCos', 'taylorTan', 'taylorAsin', 'taylorAcos', 'taylorAtan', 'taylorSinh', 'taylorCosh', 'taylorTanh',
      'taylorAsinh', 'taylorAcosh', 'taylorAtanh', 'computeArg', 'computecongj', 'compute_abi', 'computePolar','tenPower',
      'RanInt','RanSharp',
      `return ${expr};`
    );

    const result = evalInScope(
      PI, E, factorial, abs, sqrt, divide, div_mul, cbrt, square, cube, x_yrt, makeNegative,
      computeLog10, computeLn, computeLogBase, computeIntegration, computeDerivative, computeSummation,
      taylorSin, taylorCos, taylorTan, taylorAsin, taylorAcos, taylorAtan, taylorSinh, taylorCosh, taylorTanh,
      taylorAsinh, taylorAcosh, taylorAtanh, computeArg, computecongj, compute_abi, computePolar,tenPower,RanInt,RanSharp
    );

    console.log(`Evaluation result: ${result}`);
    return (typeof result === 'number' && !isNaN(result)) ? result : "Error";

  } catch (error) {
    console.error("Evaluation error:", error);
    return "Error: " + error.message;
  }
};
const handleExp = () => {
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;

  if (shift === true && alpha === false) {
    // Handle π insertion
    const newExpression = expressionInput.substring(0, currentPos) + "π" + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
  } 
  else if (shift === false && alpha === true) {
    if (expressionInput !== '') {
      HandleClear();
      setTimeout(() => {
        setExpressionInput("e");
      }, 0);
    } else {
      const newExpression = expressionInput.substring(0, currentPos) + "e" + expressionInput.substring(currentPos);
      setExpressionInput(newExpression);
    }
  } 
  else if (shift === false && alpha === false) {
    // Insert 10^x
    const newExpression = expressionInput.substring(0, currentPos) + '10^' + expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setCursorPosition(currentPos + 1); // Optional
  }
};

const handleRand = () => {
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;

  const insertText = 'Rand()';
  const newExpression =
    expressionInput.substring(0, currentPos) + insertText + expressionInput.substring(currentPos);

  setExpressionInput(newExpression);
  setCursorPosition(currentPos + 5); // Cursor between the brackets: Rand(|)
};

  // Function to handle equals button
 // Modify your handleEquals to handle the x^y special case
 const handleEquals = () => {
  try {

    if (shift===true && expressionInput===''){
      navigation.navigate('History')
    }
  
    
    else if (baseresults) {
      setResult(baseresults);
      insertRecord(bases,baseresults)
      console.log(baseresults);

      // Clear
      setbaseresults(null);
      setbases(null);
    }

    else if (vecresults) {
      setResult(vecresults);
      insertRecord(vectors,vecresults)
      console.log(vecresults);

      // Clear
      setvecresults(null);
      setvectors(null);
    }
    else if (answers) {
      setResult(answers);
      insertRecord(questions,answers)
      console.log(answers);

      // Clear
      setquestions(null);
      setanswers(null);
    }

     else if (shiftSeven) {
      setResult(shiftSeven2);
      insertRecord(shiftSeven,shiftSeven2)
      console.log(shiftSeven);

      // Clear
      setShiftSeven(null);
      setShiftSeven2(null);
    }
    

    // Normal equation evaluation
    else if (expressionInput) {
  const result = evaluateExpression(expressionInput);

  // ❌ Prevent saving invalid results
  if (typeof result !== 'number' || isNaN(result)) {
    setResult("Error");
    return;
  }

  setResult(result.toString());
  insertRecord(expressionInput, result);
  setLastResult(result.toString());
}

    
  } catch (error) {
    console.error("Calculation error:", error);
    setResult('Error');
  }
};

const handlegraph=()=>{
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  if (graphcount===0){
    const newExpression = expressionInput.substring(0, currentPos) + 'fx=' +
                          expressionInput.substring(currentPos);
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 3);
    setCursorPosition(currentPos + 3);
    setgraphcount(1)
  }
  else if(graphcount==1){
    let cleanedExpression = expressionInput.startsWith("fx=")
  ? expressionInput.substring(3) // remove first 3 characters
  : expressionInput;
 console.log(cleanedExpression)
  setgraphcount(0)

    navigation.navigate('Graph',{grapequation:cleanedExpression})
  }

}

const handlearrows = (direction) => {
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;

  let newPos = currentPos;

  if (direction === 'left') {
    newPos = Math.max(0, currentPos - 1);
  } else if (direction === 'right') {
    newPos = Math.min(expressionInput.length, currentPos + 1);
  }

  setCursorPosition(newPos);
};
return (

<SafeAreaView style={ss.mainView}>
      <View style={{marginTop:22}}>

      <TextInput
  ref={inputRef}
  style={ss.textInput}
  multiline={true}
  value={expressionInput}
  editable={true}
  autoFocus={true}
  caretHidden={false}
  showSoftInputOnFocus={false}
  onChangeText={(text) => {
    setExpressionInput(text);
  }}
  onSelectionChange={(event) => {
    const { selection } = event.nativeEvent;
    setCursorPosition(selection.start);
  }}
  selection={{
    start: cursorPosition ?? expressionInput.length,
    end: cursorPosition ?? expressionInput.length,
  }}
/>
 
 <TextInput     style={ss.textInput} multiline={true} value={result} onChangeText={setResult}  
  editable={false}

  />
  </View>
      <View style={{flexDirection:'row',marginTop:12}}>
        <View style={ss.modebtnView}>

          <TouchableOpacity style={ss.modebtn} onPress={DRGHandling}>
            <Text style={ss.modetxt}>{DRG}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={ss.modebtn}>
            <Text style={{color:'white',fontSize:12,marginTop:2}}>{ActualMode}</Text> 
          </TouchableOpacity>

          <TouchableOpacity style={ss.modebtn} onPress={ShiftAlphaHandling}>
            <Text style={ss.modetxt}>{SA}</Text> 
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={ss.graphbtn} onPress={()=>{handlegraph()}}>
            <Text style={{marginTop:2}}>GRAPH</Text> 
          </TouchableOpacity>
        </View>
      </View>

      {/* row 1 */}  
      <View style={ss.row1btn}>
        <TouchableOpacity style={shift ? ss.onshiftPress : ss.withoutshiftPress} onPress={ShiftHandling}>
          <Text>Shift</Text> 
        </TouchableOpacity>

        <TouchableOpacity 
          style={{alignItems:'center',marginLeft:10,backgroundColor:'#6792E9', borderRadius:10,height:25,width:50}} onPress={AlphaHandling}>
          <Text>Alpha</Text> 
        </TouchableOpacity>

        <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>handlearrows('left')}>
        <Image source={require('./Assets/leftArrow.png')} style={{height:15,width:15,marginTop:4}}></Image>
        </TouchableOpacity>

        <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>handlearrows('right')}>
          <Image source={require('./Assets/rightArrow.png')} style={{height:15,width:15,marginTop:4}}></Image> 
        </TouchableOpacity>

        <TouchableOpacity  
          style={{alignItems:'center',marginLeft:20,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:70}} onPress={ModeHandling}>
          <Text>MODE</Text>
        </TouchableOpacity>
      </View>

      {/* row 2 */}
      <View style={{flexDirection:'row',marginTop:8}}>
        <View>
          <Text style={{color:'white', marginLeft:15}}>solve=</Text>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
            <Text style={{fontWeight:'bold',marginTop:2}}>CALC</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{color:'white', marginLeft:20}}>d/dx</Text>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>{handle_integration_and_derivation()}}>
            <View style={{flexDirection:'row'}}>
              <View>
                <Text style={{fontSize:16,fontWeight:'bold'}}>∫</Text>
              </View>
              <View style={{flexDirection:'column',marginBottom:10}}>
                <Text style={{fontSize:8,fontWeight:'bold'}}>x</Text>
                <Text style={{fontSize:8,fontWeight:'bold'}}>y</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <Text></Text>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>{handleEquals()}}>
            <Image source={require('./Assets/upArrow.png')} style={{height:15,width:15,marginTop:4}}></Image> 
          </TouchableOpacity>
        </View>

        <View>
          <Text></Text>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
            <Image source={require('./Assets/downArrow.png')} style={{height:15,width:15,marginTop:4}}></Image> 
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{color:'white', marginLeft:30}}>x!</Text>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} 
          onPress={handleReciprocal}>
            <Text style={{fontSize:19}}>x⁻¹</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{color:'white', marginLeft:30}}>∑</Text>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:55}}
          onPress={handleLog2y}>
            <Text style={{fontSize:16}}>log₂y</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* row 3 */}
      <View style={{flexDirection:'row',marginTop:8}}>
        <View>
          <View style={{marginLeft:11}}>
            <Image source={require('./Assets/row3_btn1.png')} style={{height:20,width:45,marginTop:2}}></Image> 
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}
          onPress={handlexDividey} >
            <Text style={{fontWeight:'bold',fontSize:16,marginBottom:4}}>x/y</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:11}}>
            <Image source={require('./Assets/row3_btn2.png')} style={{height:20,width:45,marginTop:2}}></Image> 
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}
          onPress={handleSqCubrt} >
            <Image source={require('./Assets/underoot_x.png')} style={{height:20,width:40,marginTop:2}}></Image>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:11}}>
            <Image source={require('./Assets/row3_btn3.png')} style={{height:20,width:45,marginTop:2}}></Image> 
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}
          onPress={handlesquare_cube}>
            <Text style={{fontSize:18}}>x²</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:11}}>
            <View style={{marginLeft:10}}>
              <Image source={require('./Assets/row3_btn4.png')} style={{height:20,width:30,marginTop:2}}></Image> 
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}
          onPress={handlexPowery} >
            <Text style={{fontSize:18,marginTop:1}}>xʸ</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:11}}>
            <View style={{marginLeft:10}}>
              <Image source={require('./Assets/row3_btn5.png')} style={{height:20,width:30,marginTop:2}}></Image> 
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}
          onPress={Handlelog_antilog} >
            <Text style={{marginTop:2, fontWeight:'bold'}}>Log</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:11}}>
            <View style={{marginLeft:6}}>
              <Image source={require('./Assets/row3_btn6.png')} style={{height:20,width:38,marginTop:2}}></Image> 
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}
          onPress={HandleLn}>
            <Text style={{marginTop:2, fontWeight:'bold'}}>Ln</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* for next row no 4 */}
      <View style={{flexDirection:'row',marginTop:8}}>
        <View>
          <Text style={{color:'white', marginLeft:18}}>∠     a</Text>
          <TouchableOpacity style={{marginTop:2,alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} 
          onPress={()=>HandleVariables('a')}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>(-)</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{color:'white', marginLeft:10}}>    ← b</Text>
          <TouchableOpacity style={{marginTop:2,alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}
          onPress={()=>HandleVariables('b')} > 
            <Text style={{fontSize:16,fontWeight:'bold'}}>° ' "</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{color:'white', marginLeft:16}}>Abs  c</Text>
          <TouchableOpacity style={{marginTop:2,alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}
          onPress={()=>HandleHyp('c')} >
            <Text style={{fontSize:16,fontWeight:'bold'}}>hyp</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:11}}>
            <Image source={require('./Assets/sin_inv.png')} style={{height:20,width:55}}></Image> 
          </View>
          <TouchableOpacity style={{marginTop:2,alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:51}} 
          onPress={()=>HandleVariables('d')}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>sin</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2}}>
              <Image source={require('./Assets/cos_inv.png')} style={{height:19,width:47}}></Image> 
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:5,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:51,marginTop:2}}
          onPress={()=>HandleVariables('e')} >
            <Text style={{fontSize:16,fontWeight:'bold'}}>cos</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginLeft:5}}>
              <Image source={require('./Assets/tan_inv.png')} style={{height:19,width:47}}></Image> 
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:8,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:51,marginTop:2}} 
          onPress={()=>{HandleVariables('f')}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>tan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* row 5 */}
      <View style={{flexDirection:'row',marginTop:8}}>
        <View>
          <View style={{marginLeft:6,marginTop:3}}>
            <View style={{marginBottom:2,marginLeft:4}}>
              <Text style={{color:'white'}}>STO CLRv</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:52,marginTop:1}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>RCL</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:3}}>
              <Text style={{color:'white'}}>i     cot</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:52,marginTop:1}}
          onPress={()=>{HandleVariables('i')}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>ENG</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginLeft:2,marginTop:3}}>
              <Image source={require('./Assets/row5_btn3.png')} style={{height:19,width:47}}></Image> 
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9',marginLeft:8, borderRadius:10,height:25,width:51,marginTop:1}}
          onPress={()=>{HandleVariables('(')}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>(</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginLeft:12,marginTop:3}}>
              <Text style={{color:'white',fontSize:14}}>,      x</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9',marginLeft:8,  borderRadius:10,height:25,width:52,marginTop:1}}
          onPress={()=>HandleVariables(')')}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>)</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginTop:2,marginLeft:2}}>
              <Image source={require('./Assets/row5_btn5.png')} style={{height:22,width:53}}></Image> 
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9',marginLeft:8, borderRadius:10,height:25,width:51,marginTop:1}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>S⇔D</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:3}}>
              <Text style={{color:'white'}}>M-    m</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:52,marginTop:1,marginLeft:6}}
          onPress={()=>{HandleVariables('m')}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>M+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* row6 */}
      <View style={{flexDirection:'row',marginTop:6}}>
        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:14,color:'white'}}>CONST</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
          onPress={()=>HandleNumberClick('7')}  >
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>7</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:6,color:'white'}}>CONV  SI</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
           onPress={()=>HandleNumberClick('8')}>
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>8</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:14,color:'white'}}>Limit</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
           onPress={()=>HandleNumberClick('9')} >
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>9</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:20,color:'white'}}></Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#E07D31', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
           onPress={()=>handleBackspace()}>
            <Text style={{color:'black',fontSize:23,fontWeight:'bold'}}>⌫</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:10,color:'white'}}>CLR ALL</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#E07D31', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:15}}
          onPress={HandleClear}>
            <Text style={{marginLeft:12,color:'black',fontSize:18,fontWeight:'bold',marginTop:3,marginLeft:2}}>AC</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* row7 */}
      <View style={{flexDirection:'row',marginTop:6}}>
        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:14,color:'white'}}>MATRIX</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}} onPress={()=>HandleNumberClick('4')}
>
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>4</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:8,color:'white'}}>VECTOR</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
            onPress={()=>HandleNumberClick('5')}>
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>5</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:4,color:'white'}}>FUNC HELP</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
            onPress={()=>HandleNumberClick('6')}>
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>6</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:4,color:'white'}}>nPr GCD</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:8}}
          onPress={()=>handleOperatorClick('X')}>
            <Text style={{color:'black',fontSize:18,fontWeight:'bold',marginTop:4}}>X</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:4,color:'white'}}>nCr LCM</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:12}}
          onPress={()=>handleOperatorClick('÷')}>
            <Text style={{marginLeft:6,color:'black',fontSize:24,fontWeight:'bold',marginLeft:2}}>÷</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* row8 */}
      <View style={{flexDirection:'row',marginTop:6}}>
        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:14,color:'white'}}>STAT</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
           onPress={()=>HandleNumberClick('1')} >
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>1</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:8,color:'white'}}>COMPLX</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
            onPress={()=>HandleNumberClick('2')}>
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>2</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:16,color:'white'}}>DISTR</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}} onPress={()=>HandleNumberClick(3)}>
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>3</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:12,color:'white'}}>Pol   Cell</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:19}}
           onPress={()=>handleOperatorClick('+')} >
            <Text style={{color:'black',fontSize:24,fontWeight:'bold'}}>+</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:4,color:'white'}}>Rec Floor</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:12}}
            onPress={()=>handleOperatorClick('-')}>
            <Text style={{marginLeft:6,color:'black',fontSize:26,fontWeight:'bold',marginLeft:2}}>-</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* row9 */}
      <View style={{flexDirection:'row',marginTop:6}}>
        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:10,color:'white'}}>copy paste</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}} 
           onPress={()=>HandleNumberClick('0')}
            >
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>0</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:2,color:'white'}}>Ran# RanInt</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:7}}
           onPress={()=>handleDecimalClick()} >
            <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>.</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:4,color:'white'}}>π      e</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1}}
          onPress={()=>handleExp('x')}
          >
            <Text style={{alignItems:'center',fontSize:18,fontWeight:'bold',marginTop:3}}>*10^x</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:10,color:'white'}}>PreAns</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:14}}
           onPress={()=>handleAns()} >
            <Text style={{color:'black',fontSize:18,fontWeight:'bold',marginTop:4}}>Ans</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:6}}>
            <View style={{marginBottom:2,marginTop:6}}>
              <Text style={{marginLeft:10,color:'white'}}>History</Text>
            </View>
          </View>
          <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:12}}
          onPress={()=>handleEquals()}>
            <Text style={{marginLeft:6,color:'black',fontSize:24,fontWeight:'bold',marginLeft:2}}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  mainView: {
    padding: 10,
    backgroundColor: 'black',
    height:1000
  },
  textInput: {
    height: 80,
    backgroundColor: '#D3EBD3',
    borderBottomEndRadius: 10,
    fontSize: 24,
    fontWeight:'bold'
  },
  modebtn: {
    backgroundColor: '#343A46',
    height: 25,
    width: 60,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  modebtnView: {
    flexDirection: 'row',
  },
  modetxt: {
    color: 'white',
    fontSize: 16,
  },
  graphbtn: {
    backgroundColor: 'red',
    height: 26,
    width: 60,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
    marginLeft: 70
  },
  row1btn: {
    flexDirection: 'row',
    marginTop: 20
  },
  onshiftPress: {
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: 'yellow', 
    borderRadius: 10,
    height: 25,
    width: 50
  },
  withoutshiftPress: {
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: 'white', 
    borderRadius: 10,
    height: 25,
    width: 50
  }
});

export default Main;