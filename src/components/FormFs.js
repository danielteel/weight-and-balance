import { useState, useEffect } from "react";
import { Button, Table, Header} from "semantic-ui-react";
import {getUniqueId} from '../common';

import ConfirmationModal from "./ConfirmationModal";


function newFormFObj(id){
    return {
        id,

        created: (new Date()).toDateString(),
        date: (new Date()).toDateString(),

        open: false,

        mission: "TRAINING",

        aircraft: null,

        crew:{
            weight: 660,
            moment: 157.5
        },

        kit:[],

        cargo:[],

        fuel:{
            weight: 0,
            fwdMATInstalled: false,
            centerMATInstalled: false,
            taxiTakeOffFuelBurn: 500,
            landingFuel: 1500
        }
    };
}



export default function FormFs({formFs, formFsDispatch}){
    const [deleteFormFId, setDeleteFormFId]=useState(null);

    const newFormAction = () => formFsDispatch('create', newFormFObj( getUniqueId(formFs, 'id') ) );

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
                            }}/>
                            
        <Header textAlign='center'>Form Fs</Header>
        <Table selectable unstackable>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell colSpan='4'>
                    <Button floated='left' icon='add' labelPosition='left' positive size='small' content='New Form F'  onClick={newFormAction}/>
                  </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                  <Table.HeaderCell>Mission</Table.HeaderCell>
                  <Table.HeaderCell>Tail</Table.HeaderCell>
                  <Table.HeaderCell>Created</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
          </Table.Header>

          <Table.Body>
            {formFs.map( formF => {
                return (
                    <Table.Row key={formF.id} onClick={(e)=>{
                        formFsDispatch('open', formF.id);
                    }}>
                        <Table.Cell>
                            {formF.mission}
                        </Table.Cell>
                        <Table.Cell>
                            {}
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
            })}
          </Table.Body>
      </Table>
        </>
    );
}
