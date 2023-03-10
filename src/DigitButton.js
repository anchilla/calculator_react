//OVO JE CUSTOM COMPONENT
// ({dispach, digit})- a ovo su ti props

import { ACTIONS } from './App'

//prosledjujemo mu payload ovde, u zavisnosti od ACTIONS koji je
export default function DigitButton({dispach, digit}){
	//ovo postoji da bismo mogli da zovemo useReducer odavde, kad se klikne dugme
	return <button
	 onClick = {() => dispach({ type: ACTIONS.ADD_DIGIT, payload: { digit }})}>
	{digit}
	</button>
}