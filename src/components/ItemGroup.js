
import TouchInput from '@dteel/touch-input'
import { Table, Input, Button } from 'semantic-ui-react';

import ConfirmationModal from './ConfirmationModal';
import { calcArm, calcMoment, formatWeight, formatMoment } from '../common';

import {useState} from 'react';

const noPadCell={padding:'1px', border:'none'};
const deleteCell={padding:'0px 4px 0px 0px', border:'none'};
const inputStyle={style:{paddingLeft:'5px', paddingRight:'5px'}};



export default function ItemGroup({items, itemsDispatch, title}){
    const [deleteItemId, setDeleteItemId] = useState(null);

    let weightTotal=0, momentTotal=0, armTotal;

    items?.forEach( item => {
        weightTotal+=Number(item.weight);
        momentTotal+=Number(item.moment);
    })
    weightTotal=formatWeight(weightTotal);
    momentTotal=formatMoment(momentTotal);
    armTotal=calcArm(weightTotal, momentTotal);

    return (
        <>
            <ConfirmationModal title={"Are you sure you want to delete this?"}
                        isOpen={deleteItemId!==null}
                        onYes={()=>{
                            itemsDispatch('delete', deleteItemId);
                            setDeleteItemId(null);
                        }}
                        onNo={()=>{
                            setDeleteItemId(null);
                        }}
            />
            <Table unstackable style={{maxWidth: '550px'}}>
                <Table.Header className='stickyheader'>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <Button icon='add' labelPosition='left' positive size='small' content='New item'  onClick={()=>itemsDispatch('create', null)}/>
                                <div style={{flexGrow:'1', textAlign:'center', fontSize:'1.3em'}}>{title}</div>
                            </div>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell width={6}>Name</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Weight</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Moment</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Arm</Table.HeaderCell>
                        <Table.HeaderCell collapsing width={1}></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        items?.length ?
                            items.map( item => (
                                <Table.Row key={item.id}>
                                    <Table.Cell style={noPadCell}>
                                        <TouchInput as={Input} value={item.name} onChange={(v)=>itemsDispatch('update', {...item, name: v})} fluid input={inputStyle}/>
                                    </Table.Cell>
                                    <Table.Cell style={noPadCell}>
                                        <TouchInput as={Input} value={item.weight} onChange={(v)=>itemsDispatch('update', {...item, weight: v})} fluid  type='number' title='Weight' input={inputStyle}/>
                                    </Table.Cell>
                                    <Table.Cell style={noPadCell}>
                                        <TouchInput as={Input} value={item.moment} onChange={(v)=>itemsDispatch('update', {...item, moment: v, arm: calcArm(item.weight, v)})} fluid type='number' title='Moment' input={inputStyle}/>
                                    </Table.Cell>
                                    <Table.Cell style={{...noPadCell, textAlign:'center'}}>
                                        <TouchInput as={Input} value={item.arm} onChange={(v)=>itemsDispatch('update', {...item, arm: v, moment: calcMoment(item.weight, v)})} fluid type='number' title='Arm' input={inputStyle}/>
                                    </Table.Cell>
                                    <Table.Cell style={deleteCell}>
                                        <Button floated='right' icon='minus' negative size='mini' onClick={(e)=>{
                                            setDeleteItemId(item.id);
                                        }}/>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        :
                            <Table.Row style={{textAlign:'center'}}>
                                <Table.Cell colSpan='5'>
                                    no items
                                </Table.Cell>
                            </Table.Row>
                    }
                </Table.Body>
                {
                    items?.length?
                        <Table.Footer>
                            <Table.Row>
                                <Table.Cell>Total</Table.Cell>
                                <Table.Cell>{weightTotal}</Table.Cell>
                                <Table.Cell>{momentTotal}</Table.Cell>
                                <Table.Cell>{armTotal}</Table.Cell>
                                <Table.Cell></Table.Cell>
                            </Table.Row>
                        </Table.Footer>
                    :
                        null
                }
            </Table>
        </>
    );
}