import { getUniqueId, isGoodObject } from "../common";

const defRemarks=[
    {
      "id": 0,
      "code":
`//ACFT INIT
string output=newline+"ACFT INIT: "+string(floor(basic_weight+0.5))+" / "+string(floor(calcArm(basic_weight, basic_moment)+0.5))+newline;

//kit: xxx lbs / xxx in
double kitWeight=0, kitMoment=0;
if (kit_length>0){
	for (double i=0;i<kit_length;i=i+1){
		kitWeight=kitWeight+kit_i_weight(i);
		kitMoment=kitMoment+kit_i_moment(i);
	}
	output=output+"kit: "+string(floor(kitWeight+0.5))+" lbs / "+string(floor(calcArm(kitWeight, kitMoment)+0.5))+" in"+newline;
}
double cargoWeight=0, cargoMoment=0;

//cargo: xxx lbs / xxx in
if (cargo_length>0){
	for (double i=0;i<cargo_length;i=i+1){
		cargoWeight=cargoWeight+cargo_i_weight(i);
		cargoMoment=cargoMoment+cargo_i_moment(i);
	}
	output=output+"cargo: "+string(floor(cargoWeight+0.5))+" lbs / "+string(floor(calcArm(cargoWeight, cargoMoment)+0.5))+" in"+newline;
}

//kit+cargo: xxx lbs / xxx in
if (cargo_length>0 && kit_length>0){
	output=output+"kit+cargo: "+string(floor(cargoWeight+kitWeight+0.5))+" lbs / "+string(floor(calcArm(cargoWeight+kitWeight, cargoMoment+kitMoment)+0.5))+" in"+newline;
}

exit output;`
    }
];

function blankFormF(){
    return {
        created: (new Date()).toDateString(),
        date: new Date(),
        to: "",
        from: "",
        pilot: "",
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

        remarks: defRemarks,
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