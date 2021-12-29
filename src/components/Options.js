import { useEffect, useState } from "react";
import { Form, Header, Segment, Progress, Button } from "semantic-ui-react";

import {flushSaveToStorage} from '@dteel/use-stored-reducer/src/saveToStorage';
import useFormFsReducer from '../reducers/formFsReducer';
import useAircraftReducer from '../reducers/aircraftReducer';
import useSelectedMenuReducer from '../reducers/selectedMenuReducer';
import useItemGroupReducer from '../reducers/itemGroupReducer';

import { isAboutEquals } from "../common";
import { getLocalStorageSize, getFreeSpace } from '../getLocalStorageSize'
import FetchButton from "./FetchButton";
import ConfirmationModal from './ConfirmationModal';

function downloadedFormF(formf, formFsDispatch, aircraftList, aircraftDispatch, selectedMenuDispatch){
    if (formf.aircraft!==null){
        const existingAircraft = aircraftList.find( ac => {
            return  ( ac.tail.trim().toLowerCase() === formf.aircraft.tail.trim().toLowerCase() &&
                        isAboutEquals(ac.weight, formf.aircraft.weight, 0.01) && isAboutEquals(ac.moment, formf.aircraft.moment, 0.01) );
        });
        if (existingAircraft){
            formf.aircraft=existingAircraft.id;
        }else{
            aircraftDispatch('create', formf.aircraft, (acId) => formf.aircraft=acId);
        }
    }
    let newFormId = null;
    formFsDispatch('create', formf, (formId) => {
        newFormId=formId;
    });

    return <Button onClick={()=>{
        formFsDispatch('open', newFormId);
        selectedMenuDispatch('formf', {id: newFormId});
    }}>open form</Button>
}


function getSpaceUsedByWAB(){
    let spaceUsedByWAB = 0;
    for (let i = 0; i < localStorage.length; i++){
        const key=localStorage.key(i);
        if (key.trim().toLowerCase().startsWith("wab-")){
            const size=localStorage.getItem(key).length+key.length;
            spaceUsedByWAB+=size;
        }   
    }
    return spaceUsedByWAB;
}

export default function Options(){
    const [selectedMenu, selectedMenuDispatch] = useSelectedMenuReducer(1000);

    const [formFs, formFsDispatch] = useFormFsReducer(0);
    const [aircraftList, aircraftDispatch] = useAircraftReducer(0);
    const [kit, kitDispatch] = useItemGroupReducer('kit', 0);
    const [cargo, cargoDispatch] = useItemGroupReducer('cargo', 0);

    const [getCode, setGetCode] = useState('');
    const [spaceUsedByWAB, setSpaceUsedByWAB] = useState(0);
    const [spaceUsed, setSpaceUsed] = useState(0);
    const [deleteLocalModal, setDeleteLocalModal] = useState(false);

    useEffect( ()=>{
        flushSaveToStorage();
        setSpaceUsedByWAB(getSpaceUsedByWAB());
        setSpaceUsed(getLocalStorageSize()-getFreeSpace());

        const storageChanged = () => {
            setSpaceUsedByWAB(getSpaceUsedByWAB());
            setSpaceUsed(getLocalStorageSize()-getFreeSpace());
        };

        window.addEventListener('storage', storageChanged);
        return ()=>window.removeEventListener('storage', storageChanged);
    }, [formFs, kit, cargo, aircraftList]);

    return (
        <>
            <Segment style={{width:'100%', maxWidth:'600px'}}>
                <Header textAlign='center'>Options</Header>
                <Segment secondary>
                    <Header as='h4' textAlign="center">Download</Header>
                    <Form>
                        <Form.Field>
                            <Form.Input
                                placeholder='e.g. 1X5 3RP'
                                value={getCode}
                                onChange={(e)=>{setGetCode(e.target.value)}}
                            />
                        </Form.Field>
                        <FetchButton
                            as={Form.Button}
                            disabled={getCode.trim().length===0}
                            label='Download'
                            onFetch={()=>{
                                const [id, pass] = getCode.trim().toUpperCase().split(' ');
                                return ['GET', `https://zptr.net/form/${id}/${pass}`];
                            }}
                            onComplete={(obj)=>{
                                if (obj){
                                    if (obj.type==='formf'){
                                        return downloadedFormF(obj, formFsDispatch, aircraftList, aircraftDispatch, selectedMenuDispatch);
                                    }else{

                                        return new Error('unknown data type "'+obj.type+'"');

                                    }
                                }
                                return null;
                            }}
                        />
                    </Form>
                </Segment>


                
                <Segment secondary>
                    <Header as='h4' textAlign="center">Local Storage</Header>

                    <Progress
                        value={spaceUsed}
                        total={getLocalStorageSize()}
                        progress='percent'
                        precision={1}
                        label={'Storage Used: '+Math.ceil(spaceUsed/1024)+' Kb / '+Math.ceil(getLocalStorageSize()/1024)+' Kb'}
                    />
  
                    <Progress
                        value={spaceUsedByWAB}
                        total={spaceUsed}
                        progress='percent'
                        precision={1}
                        label={'WABs Useage: '+Math.ceil(spaceUsedByWAB/1024)+' Kb / '+Math.ceil(spaceUsed/1024)+' Kb'}
                    />
                    <ConfirmationModal 
                        title="Are you sure?"
                        content="This will erase everything WAB related on your device, are you sure?"
                        onNo={()=>setDeleteLocalModal(false)} 
                        onYes={()=>{
                            formFsDispatch('reset');
                            kitDispatch('reset');
                            cargoDispatch('reset');
                            aircraftDispatch('reset');

                            setDeleteLocalModal(false);
                        }}
                        isOpen={deleteLocalModal}
                    />
                    <Button negative onClick={()=>setDeleteLocalModal(true)}>Clear WAB LocalStorage</Button>
                </Segment>
            </Segment>
        </>
    );
}