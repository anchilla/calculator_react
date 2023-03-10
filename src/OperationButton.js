
import { ACTIONS } from './App'

//prosledjujemo mu payload ovde, u zavisnosti od ACTIONS koji je
export default function OperationButton({dispach, operation}){
	//ovo postoji da bismo mogli da zovemo useReducer odavde, kad se klikne dugme
	return <button
	 onClick = {() => dispach({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation }})}>
	{operation}
	</button>
}