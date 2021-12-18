export default function formFsReducer(state, action, payload){
    switch (action){
        case 'close':{
            const id=payload;
            const formFs=state;
            for (const formF of formFs){
                if (formF.id===id) formF.open=false;
            }
            return formFs;
        }
        case 'open':{
            const id=payload;
            const formFs=state;
            for (const formF of formFs){
                if (formF.id===id) formF.open=true;
            }
            return formFs;
        }
        case 'delete':{
            const id=payload;    
            const formFs=state;        
            return formFs.filter( formF => !(formF.id===id) );
        }
        case 'create':{
            if (state){
                return [...state, payload];
            }else{
                return [payload];
            }
        }
        default:
            return state;
    }
}