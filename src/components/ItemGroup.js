
import TouchInput from '@dteel/touch-input'
import { Table, Input, Button } from 'semantic-ui-react';
import {useState} from 'react';

import {useSorted} from '../useSorted';

import ItemGroupImport from './ItemGroupImport';
import ConfirmationModal from './ConfirmationModal';

import { calcArm, calcMoment, formatWeight, formatMoment } from '../common';


const noPadCell={padding:'1px', border:'none'};
const deleteCell={padding:'0px 4px 0px 0px', border:'none'};
const inputStyle={style:{paddingLeft:'5px', paddingRight:'5px'}};



const sortDetails=[
    {key: 'name', type: 'string'},
    {key: 'weight', type: 'number'},
    {key: 'moment', type: 'number'},
    {key: 'arm', type: 'number'}
];

export default function ItemGroup({items, itemsDispatch, title, importList}){
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [importIsOpen, setImportIsOpen] = useState(false);
    const [itemList, sortBy, matchSort] = useSorted(sortDetails, items);


    let weightTotal=0, momentTotal=0, armTotal;

    itemList?.forEach( item => {
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
            <ItemGroupImport open={importIsOpen} title={title} onAddItem={(item)=>itemsDispatch('create', item)} onClose={()=>setImportIsOpen(false)} importList={importList} alreadyHaveList={itemList}/>
            <Table unstackable style={{maxWidth: '550px'}} sortable>
                <Table.Header className='stickyheader'>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <Button.Group vertical>
                                    <Button icon='add' labelPosition='left' positive size='small' content='New'  onClick={()=>itemsDispatch('create', null)}/>
                                    {
                                        importList ?
                                            <Button icon='download' labelPosition='left' size='small' content='Import' onClick={()=>setImportIsOpen(true)}/>
                                        :
                                            null
                                    }
                                </Button.Group>
                                <div style={{flexGrow:'1', textAlign:'center', fontSize:'1.3em'}}>{title}</div>
                            </div>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell width={6} sorted={matchSort('name')}   onClick={()=>sortBy('name')}  >Name  </Table.HeaderCell>
                        <Table.HeaderCell width={3} sorted={matchSort('weight')} onClick={()=>sortBy('weight')}>Weight</Table.HeaderCell>
                        <Table.HeaderCell width={3} sorted={matchSort('moment')} onClick={()=>sortBy('moment')}>Moment</Table.HeaderCell>
                        <Table.HeaderCell width={3} sorted={matchSort('arm')}    onClick={()=>sortBy('arm')}   >Arm   </Table.HeaderCell>
                        <Table.HeaderCell collapsing width={1} onClick={()=>sortBy(null)}></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        itemList?.length ?
                        itemList.map( item => (
                                <Table.Row key={item.id}>
                                    <Table.Cell style={noPadCell}>
                                        <TouchInput as={Input} value={item.name} onChange={(v)=>itemsDispatch('update', {...item, name: v})} fluid input={inputStyle}/>
                                    </Table.Cell>
                                    <Table.Cell style={noPadCell}>
                                        <TouchInput as={Input} value={item.weight} onChange={(v)=>{
                                                itemsDispatch('update', {...item, weight: v, moment: calcMoment(v, item.arm), arm: item.arm})
                                        }} fluid  type='number' title='Weight' input={inputStyle}/>
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
                    itemList?.length?
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