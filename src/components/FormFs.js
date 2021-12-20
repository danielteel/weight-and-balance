import { useState } from "react";
import { Button, Table, Icon } from "semantic-ui-react";

import ConfirmationModal from "./ConfirmationModal";



export default function FormFs({formFs, formFsDispatch, selectedMenuDispatch}){
    const [deleteFormFId, setDeleteFormFId]=useState(null);

    const newFormAction = () => {
        formFsDispatch('create', null, (newId) => {
            formFsDispatch('open', newId);
            selectedMenuDispatch('formf', {id: newId});
        });
    }

    return (
        <>
            <ConfirmationModal  title={"Are you sure you want to delete this?"}
                                isOpen={deleteFormFId!==null}
                                onYes={()=>{
                                    formFsDispatch('delete', deleteFormFId);
                                    setDeleteFormFId(null)
                                }}
                                onNo={()=>{
                                    setDeleteFormFId(null)
                                }}
            />

            <Table selectable={formFs?.length} unstackable style={{maxWidth: '550px'}}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <Button floated='left' icon='add' labelPosition='left' positive size='small' content='New Form F'  onClick={newFormAction}/>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell collapsing></Table.HeaderCell>
                        <Table.HeaderCell>Mission</Table.HeaderCell>
                        <Table.HeaderCell>Tail</Table.HeaderCell>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell collapsing></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        formFs?.length?
                            formFs.map( formF => {
                                return (
                                    <Table.Row key={formF.id} onClick={(e)=>{
                                        formFsDispatch('open', formF.id);
                                        selectedMenuDispatch('formf', {id: formF.id});
                                    }}>
                                        <Table.Cell>
                                            {
                                                (formF.open)?(
                                                    <Icon name='folder open'/>
                                                ):(
                                                    null
                                                )
                                            }
                                        </Table.Cell>
                                        <Table.Cell>
                                            {formF.mission}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {formF.tail}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {formF.created}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button floated='right' icon='minus' negative size='mini' onClick={(e)=>{
                                                e.stopPropagation();
                                                setDeleteFormFId(formF.id);
                                            }}/>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })
                        :
                            <Table.Row style={{textAlign:'center'}}>
                                <Table.Cell colSpan='5'>
                                    no form fs
                                </Table.Cell>
                            </Table.Row>
                        }
                </Table.Body>
            </Table>
        </>
    );
}
