import { Form, Segment } from "semantic-ui-react";

import TouchInput from "@dteel/touch-input";

import { formatWeight } from "../../common";
import { maxFuel } from '../../fuel';
import UploadButton from "../FetchButton";

export default function EditFuel({formF, mergeProps}){

    return (
        <Segment secondary style={{width:'100%', maxWidth:'400px'}}>
            <Form>
                <Form.Field>
                    <TouchInput 
                        as={Form.Input}
                        type='number'
                        error={formF.fuel.weight>maxFuel(formF.fuel.fwdMATInstalled, formF.fuel.centerMATInstalled) || formF.fuel.weight<0}
                        label='Fuel weight'
                        title='Fuel weight'
                        value={formF.fuel.weight}
                        onChange={(v)=>{
                            mergeProps({fuel: {...formF.fuel, weight: v}});
                        }}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Checkbox label='Forward MAT installed' checked={formF.fuel.fwdMATInstalled} onChange={()=>{
                        const fuelCopy = {...formF.fuel};
                        fuelCopy.fwdMATInstalled=!fuelCopy.fwdMATInstalled;
                        mergeProps({fuel: fuelCopy});
                    }}/>
                    <Form.Checkbox label='Center MAT installed' checked={formF.fuel.centerMATInstalled} onChange={()=>{
                        const fuelCopy = {...formF.fuel};
                        fuelCopy.centerMATInstalled=!fuelCopy.centerMATInstalled;
                        mergeProps({fuel: fuelCopy});
                    }}/>
                </Form.Field>

                <Form.Field>
                    <TouchInput 
                            as={Form.Input}
                            type='number'
                            error={formF.fuel.taxiTakeOffFuelBurn<0}
                            label='Taxi/Takeoff Fuel Burn'
                            title='Taxi/Takeoff Fuel Burn'
                            value={formF.fuel.taxiTakeOffFuelBurn}
                            onChange={(v)=>{
                                mergeProps({fuel: {...formF.fuel, taxiTakeOffFuelBurn: v}});
                            }}
                    />
                    <TouchInput 
                            as={Form.Input}
                            type='number'
                            error={formF.fuel.landingFuel<0}
                            label='Landing Fuel'
                            title='Landing Fuel'
                            value={formF.fuel.landingFuel}
                            onChange={(v)=>{
                                mergeProps({fuel: {...formF.fuel, landingFuel: v}});
                            }}
                    />
                </Form.Field>
            </Form>
        </Segment>
    )
}