import {Segment, Button, Modal, Header, Loader} from 'semantic-ui-react';
import {useState} from 'react';


function packageFormF(formF, aircraftList){
    if (!formF) return null;

    const aircraft = aircraftList.find( ac => ac.id === formF.aircraft );
    if (aircraft===undefined) aircraft=null;

    const packaged = {
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

        aircraft: aircraft,
        kit: formF.kit,
        cargo: formF.cargo,
    };
    return packaged;
}

export default function FormOptions({formF, aircraftList}){
    const [shareCode, setShareCode] = useState(null);
    if (!formF) return 'undefined formf';



    return (
        <Segment secondary style={{width:'100%', maxWidth:'400px', textAlign:'center'}}>
            <Header>Options</Header>
            <Modal open={shareCode!==null} size='tiny' onClose={()=>setShareCode(null)}>
                <Modal.Content>
                    <Modal.Description>
                        {
                            (shareCode==='loading')?(
                                <Loader active inline='centered' />
                            ):(
                                (shareCode==='error')?(
                                    <Header textAlign='center'>Error uploading form</Header>
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
                    const response = await fetch('https://zptr.net/form', {
                        mode: 'cors',
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: 'cv22',
                            package: packageFormF(formF, aircraftList)
                        })
                    })
                    if (!response.ok){
                        setShareCode('error');
                    }else{
                        const result = await response.json();
                        if (result.error){
                            setShareCode('error');
                        }else{
                            setShareCode(result.id+' '+result.pass);
                        }
                    }
                } catch (e){
                    setShareCode('error');
                }
                
            }}>Share</Button>
        </Segment>
    );
}

