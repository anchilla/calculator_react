import "./styles.css"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import { useReducer } from "react";

// 27:00 kod = dugmeta zavrsila
    //u css kad stavis da se calculator-grid , justify-content: center to njega celog 
//centrira na web stranici

//GLOBALNA VARIJABLA, zato velika slova. Ona je objekat.
export const ACTIONS = {
  //svi tipovi akcija koje cemo imati
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

//function reducer(state, action){ - razlozi action na vise stvari, jer cemo imati vise 
// valjda se zato koristi useReducer. type - tip akcije, payload - ono sto ce akcije
// proslediti.
function reducer(state, {type, payload}){
  switch (type){
    //za ovaj switch ne mora break, jer imas return
  case ACTIONS.ADD_DIGIT:
    //ovaj if je da kad kliknemo novu cifru posle nekog dobijenog rezultata da pise novu, ne
    // dodaje na taj rezultat
    if(state.overwrite){
      return{
        ...state,
        currentOperand: payload.digit,
        overwrite: false,
      }

    }
    if(payload.digit === "0" && state.currentOperand === "0") {
      return state;
    }
    if(payload.digit === "." && state.currentOperand.includes(".")) {
      return state;
    }
    // return state - ovo sto vraca je state
    return {
      ...state,
      // ` ` ili ''
      //digit prosledimo iz App, iz dispach metode
      currentOperand: `${state.currentOperand || ""}${payload.digit}`,
    }
  case ACTIONS.CHOOSE_OPERATION:
    if(state.currentOperand == null && state.previousOperand == null){
      return state;
    }

    //opcija ako smo vec kliknuli na neku operaciju, ali se predomislimo - zato 
    //proverimo da li je vec napisana neka cifra i onda menjamo operation
    if(state.currentOperand == null){
      return {
        ...state,
        operation: payload.operation,
      }
    }
    //ako je samo jedan broj upisan za vrsenje operacija, prev postaje current, a current nema
    //da se ispise u najgornjem delu tipa 47*
    if(state.previousOperand == null){
      return {
        ...state,
        operation: payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: null,
      }
    }

    //ovo uradi u svakom slucaju
    return{
      ...state,
      previousOperand: evaluate(state),
      operation: payload.operation,
      currentOperand: null,
    }

  case ACTIONS.CLEAR:
    return {};

  case ACTIONS.DELETE_DIGIT:
    if(state.overwrite) {
      //ovde brise celu cifru ako je ona rezultat
      return {
        ...state,
        overwrite: false,
        currentOperand: null,
      }
    }
    if(state.currentOperand == null){
      return state;
    }
    //ako je currOp samo jedna cidfra, ili je ostala samo jedna cifra a ostale smo izbrisali
    // onda stavljamo da je  vrednost currOp null
    if(state.currentOperand.length === 1){
      return {
        ...state, 
        currentOperand: null,
      }
    }
    //ovo nam je default case, uradi ovo svejedno
    //brise poslednju cifru iz currOp(broj koji smo iskucali, ili dobili)
    return{
      ...state,
      currentOperand: state.currentOperand.slice(0, -1)
    }

  case ACTIONS.EVALUATE:
    //ovi props se moraju pozivati preko state. tipa - state.operation, inace kaze da je 
    // undefined, barem u ovom if-u
    if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
      return state;
    }
    //ovo uradi svejedno, za ovaj case
    return {
      ...state,
      //dodali smo overwrite prop state-u da ne bi ako kliknemo neku cifru posle rezultata
      // dodavao na tu cifru nego da pise novu
      overwrite: true,
      previousOperand: null,
      operation: null,
      currentOperand: evaluate(state),
    }
  }
}

//isNaN() - pise se s velikim N na KRAJU
function evaluate({currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch(operation){
  case "+":
    computation = prev + current;
    break;
  case "-":
    computation = prev - current;
    break;
  case "*":
    computation = prev * current;
    break;
  case "÷":
    computation = prev / current;
    break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits:0})
//preko ove konstante koristimo metodu za formatiranje brojeva
//ako nema broja (operand), ne radi nista
//razdvoji broj na deo pre tacke i posle(integer, decimal) - split metoda ce respektivno
// dodeliti vrednost obema konstanatama
//ako je decimal null, samo formatiraj integer
//na kraju, vrati formatirani integer sa ne formatiranim decimal zajedno.
function formatOperand(operand){
  if(operand == null) return;
  const[integer, decimal] = operand.split(".");
  if(decimal == null) return INTEGER_FORMATTER.format(integer);
   return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;

}


function App(){

    //const [state, dispach] = useReducer(reducer, {}) - da znas sta je, skraceno. currOp, 
    // prevOp, operation su state varijable.
    const [{currentOperand, previousOperand, operation}, dispach] = useReducer(reducer, {})

//dispach({type: ACTIONS.ADD_DIGIT, payload: { digit: 1}}){} - ovo smo uklonili kad smo
    //stavili ovo dole DigitalButton
// umesto dugmadi mozemo stavljati nasu custom <DigitButton digit= "÷" dispach ={dispach} //>

//pre funkccije formatOperand() je bilo ovako:
//<div className="previous-operand">{previousOperand} {operation}</div>  i ovde:
//<div className="current-operand">{currentOperand}}</div>
 return (
  <div className="calculator-grid">
    <div className="output">
      <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
      <div className="current-operand">{formatOperand(currentOperand)}</div>
    </div>

    <button className="span-two" onClick = {() => dispach({ type: ACTIONS.CLEAR}) }>AC</button>
        <button  onClick = {() => dispach({ type: ACTIONS.DELETE_DIGIT}) }>DEL</button>
        <OperationButton operation= "÷" dispach ={dispach} />
        <DigitButton digit= "1" dispach ={dispach} />
              <DigitButton digit= "2" dispach ={dispach} />
              <DigitButton digit= "3" dispach ={dispach} />
              <OperationButton operation= "*" dispach ={dispach} />
              <DigitButton digit= "4" dispach ={dispach} />
              <DigitButton digit= "5" dispach ={dispach} />
              <DigitButton digit= "6" dispach ={dispach} />
              <OperationButton operation= "+" dispach ={dispach} />
              <DigitButton digit= "7" dispach ={dispach} />
              <DigitButton digit= "8" dispach ={dispach} />
              <DigitButton digit= "9" dispach ={dispach} />
              <OperationButton operation= "-" dispach ={dispach} />
              <DigitButton digit= "." dispach ={dispach} />
              <DigitButton digit= "0" dispach ={dispach} />
        <button className="span-two" onClick = {() => dispach({ type: ACTIONS.EVALUATE}) } >=</button>


  </div>
  )
}


export default App;

