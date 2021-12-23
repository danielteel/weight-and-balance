import { getUniqueId, isGoodObject } from "../common";

function blankFormF(){
    return {
        created: (new Date()).toDateString(),
        date: (new Date()).toDateString(),

        mission: "TRAINING",

        aircraft: null,

        crew:{
            weight: 660,
            moment: 157.5
        },

        kit:[],

        cargo:[],

        fuel:{
            weight: 0,
            fwdMATInstalled: false,
            centerMATInstalled: false,
            taxiTakeOffFuelBurn: 500,
            landingFuel: 1500
        },
        
        //Open and view are for saving state of if the formf is open for editing and what screen editing is happening on
        open: false,
        view: null,
    };
}


export default function formFsReducer(state, action, payload, callback){

    if (!Array.isArray(state)) state=[];

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
            const id=typeof payload==='object' ? payload.id : payload;
            const formFs=state;        
            return formFs.filter( formF => !(formF.id===id) );
        }
        case 'update':{
            const formFs=state;  
            
            for (const [index, element] of formFs.entries()){
                if (element.id===payload.id){
                    formFs[index]=payload;
                    break;
                }
            }
            return formFs;
        }
        case 'create':{
            let newFormF = payload;
            if (!isGoodObject(newFormF))  newFormF=blankFormF();

            newFormF.id=getUniqueId(state, 'id');
            if (callback) setTimeout( ()=>callback(newFormF.id) , 0);

            return [...state, newFormF];
        }
        default:
            return state;
    }
}