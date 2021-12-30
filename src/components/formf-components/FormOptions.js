import {Segment, Button, Modal, Header, Loader} from 'semantic-ui-react';
import {useState} from 'react';
import FetchButton from '../FetchButton';


function packagedFormF(formF, aircraftList){
    if (!formF) return null;

    const aircraft = aircraftList.find( ac => ac.id === formF.aircraft );

    const packaged = {
        type: 'formf',
        created: formF.created,
        date: formF.date,
        to: formF.to,
        from: formF.to,
        pilot: formF.pilot,
        mission: formF.mission,
        homeStation: formF.homeStation,
        crew: formF.crew,
        fuel: formF.fuel,
        remarks: formF.remarks,

        aircraft: aircraft?aircraft:null,
        kit: formF.kit,
        cargo: formF.cargo,
    };
    return packaged;
}

export default function FormOptions({formF, aircraftList}){
    if (!formF) return 'undefined formf';



    return (
        <Segment secondary style={{width:'100%', maxWidth:'400px', textAlign:'center'}}>
            <Header>Options</Header>

            <FetchButton
                label='Upload'
                icon='upload'
                onFetch={()=>[
                    'POST',
                    'https://wab.zptr.net/obj',
                    {'id': 'cv22', 'package': packagedFormF(formF, aircraftList)}
                ]}
                onComplete={(retData)=>{
                    return <Header as='h3'>Identifier: <span style={{fontFamily:'consolas'}}>{retData.id} {retData.pass}</span></Header>;
                }}
            />
        </Segment>
    );
}