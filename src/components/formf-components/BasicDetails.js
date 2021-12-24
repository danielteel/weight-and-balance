import { Form, Segment, Divider } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import TouchInput from "@dteel/touch-input";

export default function EditBasicDetails({formF, aircraftList, mergeProps}){
    if (!formF) return 'undefined formf';

    const aircraft = aircraftList.find( ac => ac.id === formF.aircraft );

    const aircraftDropdownList = aircraftList.map( ac=>{
        return {key: ac.id, value: ac.id, text: ac.tail};
    })
    aircraftDropdownList.push({key: null, value: null, text:'-clear-'});

    let date=new Date(formF.date);
    if (isNaN(Date.parse(date))){
        mergeProps({date: new Date()});
        date=new Date();
    }
    

    return (
        <Segment secondary style={{width:'100%', maxWidth:'400px'}}>
        <Form>
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
                    fluid
                    label='Mission Name'
                    type='text'
                    value={formF.mission}
                    onChange={(value)=>mergeProps({mission: value})}
                />
            </Form.Field>

            <Form.Field>
                <label>Date</label>
                <DatePicker todayButton='Today' selected={date} onChange={(date) => mergeProps({date})} />
            </Form.Field>

            <Divider/>

            <Form.Field>
                <TouchInput 
                    as={Form.Input}
                    fluid
                    label='To'
                    type='text'
                    value={formF.to}
                    onChange={(value)=>mergeProps({to: value})}
                />
            </Form.Field>

            <Form.Field>
                <TouchInput 
                    as={Form.Input}
                    fluid
                    label='From'
                    type='text'
                    value={formF.from}
                    onChange={(value)=>mergeProps({from: value})}
                />
            </Form.Field>

            <Divider/>

            <Form.Field>
                <TouchInput 
                    as={Form.Input}
                    fluid
                    label='Pilot'
                    type='text'
                    value={formF.pilot}
                    onChange={(value)=>mergeProps({pilot: value})}
                />
            </Form.Field>

            <Form.Field>
                <TouchInput 
                    as={Form.Input}
                    fluid
                    label='Home Station'
                    type='text'
                    value={formF.homeStation}
                    onChange={(value)=>mergeProps({homeStation: value})}
                />
            </Form.Field>

            <Divider/>

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