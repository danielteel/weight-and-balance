import {Modal, Button, Table, Icon} from 'semantic-ui-react';
import {isAboutEquals, formatWeight, formatArm, formatMoment} from '../common';

function itemsMatch(a, b){
    return ( a.name.trim().toLowerCase()===b.name.trim().toLowerCase() &&
        isAboutEquals(a.weight, b.weight, 0.1) &&
        isAboutEquals(a.moment, b.moment, 0.1) );
}

function doesItAlreadyExist(item, alreadyHaveList){
    for (const o of alreadyHaveList){
        if (itemsMatch(o, item)) return true;
    }
    return false;
}

export default function ItemGroupImport({open, title, onAddItem, onClose, importList, alreadyHaveList}){
    if (!open) return null;

    const itemsToRender = [];

    for (const item of importList){
        if (!doesItAlreadyExist(item, alreadyHaveList)){
            itemsToRender.push(item);
        }else{
            itemsToRender.push({...item, disabled: true});
        }
    }

    return (
        <Modal open={open} size="tiny">
            <Modal.Header>Import from {title} presets</Modal.Header>
            <Modal.Content>
                <Table selectable compact unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Weight</Table.HeaderCell>
                            <Table.HeaderCell>Arm</Table.HeaderCell>
                            <Table.HeaderCell>Mom</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            itemsToRender.map( item => (
                                !item.disabled?
                                    <Table.Row>
                                        <Table.Cell><Button size='mini' icon='add' positive onClick={()=>onAddItem(item)}/></Table.Cell>
                                        <Table.Cell>{item.name}</Table.Cell>
                                        <Table.Cell>{formatWeight(item.weight)}</Table.Cell>
                                        <Table.Cell>{formatMoment(item.moment)}</Table.Cell>
                                        <Table.Cell>{formatArm(item.arm)}</Table.Cell>
                                    </Table.Row>
                                :
                                    <Table.Row disabled>
                                        <Table.Cell><Button size='mini' icon='check'/></Table.Cell>
                                        <Table.Cell>{item.name}</Table.Cell>
                                        <Table.Cell>{formatWeight(item.weight)}</Table.Cell>
                                        <Table.Cell>{formatMoment(item.moment)}</Table.Cell>
                                        <Table.Cell>{formatArm(item.arm)}</Table.Cell>
                                    </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
            </Modal.Content>
            <Modal.Actions>
                <Button content={"Close"} onClick={onClose}/>
            </Modal.Actions>
      </Modal>
    )
}