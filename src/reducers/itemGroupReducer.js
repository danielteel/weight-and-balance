import { calcArm, getUniqueId, isAboutEquals, isGoodObject } from "../common";

function blankItem(){
    return {name:'', weight: 0, moment: 0, arm: 0};
}

export default function itemGroupReducer(state, action, payload, callback){

    if (!Array.isArray(state)) state=[];

    switch (action){
        case 'update':{
            const items=state;
            
            const expectedArm = calcArm(payload.weight, payload.moment);
            if (!isAboutEquals(expectedArm, payload.arm, 0.1)){
                payload.arm=expectedArm;
            }

            for (const [index, element] of items.entries()){
                if (element.id===payload.id){
                    items[index]=payload;
                    break;
                }
            }
            return items;
        }
        case 'delete':{
            const items=state;
            const id=typeof payload==='object' ? payload.id : payload;
            return items.filter( item => !(item.id === id) );
        }
        case 'create':{
            let newItem = payload;
            if (!isGoodObject(newItem)) newItem=blankItem();

            newItem.id=getUniqueId(state, 'id');
            if (callback) callback(newItem.id);

            return [...state, newItem];
        }
        default:
            return state;
    }
}