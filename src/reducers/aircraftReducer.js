import { useStoredReducer } from "@dteel/use-stored-reducer";
import { getUniqueId, isGoodObject } from "../common";

function blankAircraft(){
    return {tail:'', weight: 0, moment: 0};
}

function aircraftReducer(state, action, payload, callback){

    if (!Array.isArray(state)) state=[];

    switch (action){
        case 'reset':{
            return [];
        }
        case 'update':{
            const aircraft=state;  
            
            for (const [index, element] of aircraft.entries()){
                if (element.id===payload.id){
                    aircraft[index]=payload;
                    break;
                }
            }
            return aircraft;
        }
        case 'delete':{
            const aircraft=state;
            const id=typeof payload==='object' ? payload.id : payload;
            return aircraft.filter( ac => !(ac.id === id) );
        }
        case 'create':{
            let newAircraft = payload;
            if (!isGoodObject(newAircraft)) newAircraft=blankAircraft();

            newAircraft.id=getUniqueId(state, 'id');
            if (callback) callback(newAircraft.id);

            return [...state, newAircraft];
        }
        default:
            return state;
    }
}

function useAircraftReducer(hysterisis=1000){
    const [aircraftList, {current: aircraftDispatch}] = useStoredReducer('wab-aircraft', aircraftReducer, [], localStorage, hysterisis);

    return [aircraftList, aircraftDispatch];
}

export {useAircraftReducer as default, aircraftReducer};