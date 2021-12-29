import TouchInput from '@dteel/touch-input'
import { Table, Input, Button } from 'semantic-ui-react';

import {useState} from 'react';

import ConfirmationModal from './ConfirmationModal';
import { useSorted } from '../useSorted';
import { calcArm } from '../common';

const noPadCell={padding:'1px', border:'none'};
const deleteCell={padding:'0px 4px 0px 0px', border:'none'};
const inputStyle={style:{paddingLeft:'5px', paddingRight:'5px'}};

const sortDetails=[
    {key: 'tail', type: 'string'},
    {key: 'weight', type: 'number'},
    {key: 'moment', type: 'number'},
];

export default function Aircraft({aircraft, aircraftDispatch}){
    const [aircraftList, sortBy, matchSort] = useSorted(sortDetails, aircraft);
    const [deleteAircraftId, setDeleteAircraftId]=useState(null);
 
    return (
        <>
            <ConfirmationModal title={"Are you sure you want to delete this?"}
                        isOpen={deleteAircraftId!==null}
                        onYes={()=>{
                            aircraftDispatch('delete', deleteAircraftId);
                            setDeleteAircraftId(null)
                        }}
                        onNo={()=>{
                            setDeleteAircraftId(null)
                        }}
            />
            <Table unstackable sortable style={{maxWidth: '550px'}}>
                <Table.Header className='stickyheader'>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <Button icon='add' labelPosition='left' positive size='small' content='New Aircraft'  onClick={()=>aircraftDispatch('create', null)}/>
                                <div style={{flexGrow:'1', textAlign:'center', fontSize:'1.3em'}}>Aircraft</div>
                            </div>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell width={6} sorted={matchSort('tail')}   onClick={()=>sortBy('tail')}>Tail</Table.HeaderCell>
                        <Table.HeaderCell width={4} sorted={matchSort('weight')} onClick={()=>sortBy('weight')}>Weight</Table.HeaderCell>
                        <Table.HeaderCell width={4} sorted={matchSort('moment')} onClick={()=>sortBy('moment')}>Moment</Table.HeaderCell>
                        <Table.HeaderCell width={1} onClick={()=>sortBy(null)}>Arm</Table.HeaderCell>
                        <Table.HeaderCell collapsing width={1} onClick={()=>sortBy(null)}></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        aircraftList?.length ?
                            aircraftList.map( ac => (
                                <Table.Row key={ac.id}>
                                    <Table.Cell style={noPadCell}>
                                        <TouchInput as={Input} value={ac.tail} onChange={(v)=>aircraftDispatch('update', {...ac, tail: v})} fluid input={inputStyle}/>
                                    </Table.Cell>
                                    <Table.Cell style={noPadCell}>
                                        <TouchInput as={Input} value={ac.weight} onChange={(v)=>aircraftDispatch('update', {...ac, weight: v})} fluid  type='number' title='Weight' input={inputStyle}/>
                                    </Table.Cell>
                                    <Table.Cell style={noPadCell}>
                                        <TouchInput as={Input} value={ac.moment} onChange={(v)=>aircraftDispatch('update', {...ac, moment: v})} fluid type='number' title='Moment' input={inputStyle}/>
                                    </Table.Cell>
                                    <Table.Cell style={{...noPadCell, textAlign:'center'}}>
                                        {calcArm(ac.weight, ac.moment, 10)}
                                    </Table.Cell>
                                    <Table.Cell style={deleteCell}>
                                        <Button floated='right' icon='minus' negative size='mini' onClick={(e)=>{
                                            setDeleteAircraftId(ac.id);
                                        }}/>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        :
                            <Table.Row style={{textAlign:'center'}}>
                                <Table.Cell colSpan='5'>
                                    no aircraft
                                </Table.Cell>
                            </Table.Row>
                    }
                </Table.Body>
            </Table>
        </>
    );
}