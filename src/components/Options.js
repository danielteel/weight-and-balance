import { useState } from "react";
import { Form, Input, Divider, Message, Header } from "semantic-ui-react";
import { isAboutEquals } from "../common";


async function downloadFromShareCode(shareCode){
    const [id, pass] = shareCode.trim().toUpperCase().split(' ');
    try {
        const response = await fetch(`https://zptr.net/form/${id}/${pass}`, {
            mode: 'cors',
            method: 'GET'
        })

        const result = await response.json();
        if (result.error){
            return result.error;
        }
        return JSON.parse(result);

    } catch (e){
        return 'fetch failed';
    }
}

export default function Options({formFsDispatch, aircraftList, aircraftDispatch, selectedMenuDispatch}){
    const [getCode, setGetCode] = useState('');
    const [getCodeStatus, setGetCodeStatus] = useState(null);

    return (
    <>
        <Header textAlign='center'>Options</Header>
        <Form error={getCodeStatus && getCodeStatus!=='loading'} loading={getCodeStatus==='loading'}>
            
            <Message 
                error
                header='Download failed'
                content={getCodeStatus+" for '"+getCode+"'"}
            />
            <Form.Field
                control={Input}
                label='Download from share code'
                value={getCode}
                onChange={(e)=>{setGetCode(e.target.value); setGetCodeStatus(null)}}
                action={{
                    labelPosition: 'right',
                    icon: 'download',
                    content: 'Get',
                    onClick: async () => {
                        setGetCodeStatus('loading');
                        const formf = await downloadFromShareCode(getCode, ()=>{});
                        if (typeof formf==='string'){
                            setGetCodeStatus(formf);
                        }else{
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

                                formFsDispatch('create', formf, (formId) => {
                                    formFsDispatch('open', formId);
                                    selectedMenuDispatch('formf', {id: formId});
                                });
                            }
                        }
                    }
                }}
            />
            <Divider/>
        </Form>
    </>
    );
}