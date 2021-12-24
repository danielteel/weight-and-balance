import { useState } from "react";
import { Button, Checkbox, Segment, Message } from "semantic-ui-react";
import TextareaAutosize from 'react-textarea-autosize';

import { getUniqueId } from "../../common";
import { buildExternList, runCode, markUpScript } from "./calcRemarks";

const externKeywords=['newline', 'kit_length', 'cargo_length', 'tail', 'basic_weight', 'basic_moment', 'basic_arm', 'calcArm', 'calcMoment', 'kit_i_name', 'kit_i_weight', 'kit_i_moment', 'kit_i_arm',
'cargo_i_name', 'cargo_i_weight', 'cargo_i_moment', 'cargo_i_arm'];

export default function EditRemarks({formF, mergeProps, aircraftList}){
    const [editEnabled, setEditEnabled] = useState(false);
    const externs=buildExternList(formF, aircraftList);

    let remarks=[];
    if (Array.isArray(formF.remarks)) remarks=formF.remarks;
    return (
        <Segment secondary style={{width: '100%'}}>
            
            <Checkbox toggle label="Edit code" checked={editEnabled} onClick={()=>setEditEnabled((v)=>!v)}/>
            {
                remarks.map( (remark, index) => {
                    return (
                        <Segment>
                            {
                                editEnabled?
                                    <TextareaAutosize spellCheck="false" autoCorrect="false" autoComplete="false" minRows={3} key={remark.id} style={{resize:'vertical', width: '100%'}} value={remark.code} onChange={(e)=>{
                                        const remarksCopy = formF.remarks;
                                        remarksCopy[index].code = e.target.value;
                                        mergeProps({remarks: remarksCopy});
                                    }}/>
                                :
                                    <Message size="mini" className="wab-code-message">
                                        {markUpScript(remark.code, externKeywords)}
                                    </Message>
                            }
                            <div style={{display:'flex', alignItems:'center'}}>
                                <div style={{flexGrow:1}}>Output: <pre>{runCode(remark.code, externs)}</pre></div>
                                <Button icon='delete' size='mini' negative onClick={()=>mergeProps({remarks: remarks.filter((rem, i)=> index!==i)})}/>
                            </div>
                        </Segment>
                    );
                })
            }
            <Button icon='add' labelPosition="left" positive content='New remark' onClick={()=>{
                mergeProps({remarks: [...remarks, {id: getUniqueId(formF.remarks, 'id'), code: '//code'}]})}
            }/>
        </Segment>
    )
}