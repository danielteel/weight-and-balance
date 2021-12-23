import { Form, Segment } from "semantic-ui-react";

import TouchInput from "@dteel/touch-input";

export default function EditBasicDetails({formF, aircraftList, mergeProps}){
    if (!formF) return 'undefined formf';

    const aircraft = aircraftList.find( ac => ac.id === formF.aircraft );

    const aircraftDropdownList = aircraftList.map( ac=>{
        return {key: ac.id, value: ac.id, text: ac.tail};
    })
    aircraftDropdownList.push({key: null, value: null, text:'-clear-'});

    return (
        <Segment secondary style={{width:'100%', maxWidth:'400px'}}>
        <Form>
            <Form.Field>
                <TouchInput 
                    as={Form.Input}
                    fluid
                    label='Mission Name'
                    type='text'
                    value={formF.mission}
                    onChange={(value)=>mergeProps({mission: value})}
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
                    onChange={(e,{value})=>mergeProps({aircraft: value})}
                />
            </Form.Field>

            <Form.Field>
                <TouchInput 
                    as={Form.Input}
                    label='Crew Weight'
                    title='Crew Weight'
                    type='number'
                    value={formF.crew?.weight}
                    onChange={(value)=>mergeProps({crew: {weight: value, moment: formF.crew.moment}})}
                />
                <TouchInput 
                    as={Form.Input}
                    label='Crew Moment'
                    title='Crew Moment'
                    type='number'
                    value={formF.crew?.moment}
                    onChange={(value)=>mergeProps({crew: {weight: formF.crew.weight, moment: value}})}
                />
            </Form.Field>
        </Form>
        </Segment>
    );
}