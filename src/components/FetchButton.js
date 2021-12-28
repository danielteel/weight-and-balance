import React, { useState } from "react";
import { Button, Message } from "semantic-ui-react";


export default function FetchButton({as=Button, onFetch, label, icon, onComplete, ...props}){
    const [status, setStatus] = useState({action: null, message: ''});

    const onClick = async () => {
        if (status.action!=='loading'){
            setStatus({action: 'loading', message:''});
            const [method, endPoint, data]=onFetch();

            try {
                const response = await fetch(endPoint, {
                    method: method,
                    mode: 'cors',
                    headers: method.trim().toUpperCase()!=='GET' ? {
                        'Content-Type': 'application/json',
                    }:undefined,
                    body: method.trim().toUpperCase()!=='GET' ? JSON.stringify(data) : undefined
                })

                const result = await response.json();
                if (result.error){
                    setStatus({action: 'error', message: result.error});
                }else{
                    const message=onComplete(result);
                    if (message instanceof Error){
                        setStatus({action: 'error', message: message.message});
                    } else if (message){
                        setStatus({action: 'success', message: message});
                    }
                }
            } catch (e){
                console.error(e);
                setStatus({action: 'error', message: 'Failed to '+method});
            }

        }
    }

    const btnProps = {
        onClick: onClick,
        icon: icon,
        content: label,
        ...props,
        loading: status.action==='loading'
    };
    return (
        <>
            {React.createElement(as, btnProps)}
            {
                (status.action==='error')?(
                    <>
                    <Message negative onDismiss={()=>setStatus({action: null, message:''})}>
                        <Message.Header>
                            Error
                        </Message.Header>
                        <Message.Content>
                            {status.message}
                        </Message.Content>
                    </Message>
                    </>
                ):(status.action==='success')?(
                    <Message positive onDismiss={()=>setStatus({action: null, message:''})}>
                        <Message.Header>
                            Success
                        </Message.Header>
                        <Message.Content>
                            {status.message}
                        </Message.Content>
                    </Message>
                ):(
                    null
                )
            }
        </>
    );
}