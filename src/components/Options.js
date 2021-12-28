import { useEffect, useState } from "react";
import { Form, Header, Segment, Progress, Button } from "semantic-ui-react";
import { isAboutEquals } from "../common";
import { getLocalStorageSize, getFreeSpace } from '../getLocalStorageSize'
import FetchButton from "./FetchButton";
import {flushSaveToStorage} from '@dteel/use-stored-reducer/src/saveToStorage';

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

export default function Options({formFsDispatch, formFs, kit, cargo, aircraftList, aircraftDispatch, selectedMenuDispatch}){
    const [getCode, setGetCode] = useState('');
    const [spaceUsedByWAB, setSpaceUsedByWAB] = useState(0);
    const [spaceUsed, setSpaceUsed] = useState(0);
    const [reCalc, setReCalc] = useState({});

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
    }, [formFs, kit, cargo, aircraftList, reCalc]);

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
                                        const formf=obj;
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
                                        formFsDispatch('create', formf, (formId) => {
                                            formFsDispatch('open', formId);
                                            selectedMenuDispatch('formf', {id: formId});
                                        });
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
                        label={'Storage Used: '+Math.ceil(spaceUsed/1024)+' Kb / '+Math.ceil(getLocalStorageSize()/1024)+' Kb'}
                        color='green'
                    />
  
                    <Progress
                        value={spaceUsedByWAB}
                        total={spaceUsed}
                        progress='percent'
                        label={'WABs Useage: '+Math.ceil(spaceUsedByWAB/1024)+' Kb / '+Math.ceil(spaceUsed/1024)+' Kb'}
                        color='green'
                    />

                    <Button onClick={()=>{localStorage.clear(); setReCalc({})}}>Clear LocalStorage</Button>
                </Segment>
            </Segment>
        </>
    );
}