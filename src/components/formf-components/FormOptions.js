import {Segment, Button, Modal, Header, Loader} from 'semantic-ui-react';
import {useState, useEffect} from 'react';

export default function FormOptions({formF, aircraftList}){
    const [shareCode, setShareCode] = useState(null);
    if (!formF) return 'undefined formf';

    const aircraft = aircraftList.find( ac => ac.id === formF.aircraft );
    if (aircraft===undefined) aircraft=null;


    return (
        <Segment secondary style={{width:'100%', maxWidth:'400px'}}>
            <Modal open={shareCode!==null} size='tiny' onClose={()=>setShareCode(null)}>
                <Modal.Content>
                    <Modal.Description>
                        {
                            (shareCode==='loading')?(
                                <Loader active inline='centered' />
                            ):(
                                (shareCode==='error')?(
                                    <Header textAlign='center'>Error uploading form, check airplane mode</Header>
                                ):(
                                    <Header style={{fontFamily:'consolas', textAlign:'center'}}>Share code is: {shareCode}</Header>
                                )
                            )
                        }
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setShareCode(null)}>
                        Ok
                    </Button>
                </Modal.Actions>
            </Modal>
            <Button onClick={async ()=>{
                setShareCode('loading');
                try {
                    const response = await fetch('http://192.168.1.14:3001/form', {
                        mode: 'cors',
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: 'cv22',
                            package: formF
                        })
                    })
                    if (!response.ok){
                        setShareCode('error uploading');
                    }else{
                        const result = await response.json();
                        if (result.error){
                            setShareCode('error uploading');
                        }else{
                            setShareCode(result.id+' '+result.pass);
                        }
                    }
                } catch (e){
                    setShareCode('error uploading');
                }
                
            }}>Share</Button>
        </Segment>
    );
}

