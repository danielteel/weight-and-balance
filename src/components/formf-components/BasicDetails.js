import { List, Form } from "semantic-ui-react";

import { calcArm, formatWeight, formatMoment } from "../../common";

import TouchInput from "@dteel/touch-input";

export default function EditBasicDetails({formF, formFsDispatch, aircraftList}){
    if (!formF) return 'undefined formf';

    const aircraft = aircraftList.find( ac => ac.id === formF.aircraft );

    const mergeFormF = (obj) => {
        obj.id=formF.id;
        const formFCopy=Object.assign({...formF}, obj);
        formFsDispatch('update', formFCopy);
    }

    const aircraftDropdownList = aircraftList.map( ac=>{
        return {key: ac.id, value: ac.id, text: ac.tail};
    })

    return (
        <Form>
            <Form.Field>
                <TouchInput 
                    as={Form.Input}
                    fluid
                    label='Mission Name'
                    type='text'
                    value={formF.mission}
                    onChange={(value)=>mergeFormF({mission: value})}
                />
            </Form.Field>

            <Form.Field>
                <Form.Dropdown
                    selection
                    fluid
                    error={aircraft?null:'Select an aircraft'}
                    label='Aircraft'
                    options={aircraftDropdownList}
                    value={formF.aircraft}
                    onChange={(e,{value})=>mergeFormF({aircraft: value})}
                />
            </Form.Field>

            <Form.Field>
                <TouchInput 
                    as={Form.Input}
                    label='Crew Weight'
                    title='Crew Weight'
                    type='number'
                    value={formF.crew?.weight}
                    onChange={(value)=>mergeFormF({crew: {weight: value, moment: formF.crew.moment}})}
                    onBlur={()=>mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}
                />
                <TouchInput 
                    as={Form.Input}
                    label='Crew Moment'
                    title='Crew Moment'
                    type='number'
                    value={formF.crew?.moment}
                    onChange={(value)=>mergeFormF({crew: {weight: formF.crew.weight, moment: value}})}
                    onBlur={()=>mergeFormF({crew: {weight: formatWeight(formF.crew.weight), moment: formatMoment(formF.crew.moment)}})}
                />
            </Form.Field>
        </Form>
    );
}