import { Tab } from 'semantic-ui-react';
import ViewForm from './formf-components/ViewForm';
import BasicDetails from './formf-components/BasicDetails';
import EditFuel from './formf-components/EditFuel';
import EditItemGroup from './formf-components/EditItemGroup';

export default function FormF({formFs, formFsDispatch, aircraftList, id, goHome}){
    const formF = formFs?.find( form => form.id===id );

    if (!formF){
        goHome();
        return null;
    }

    const mergeProps = (obj) => {
        const formFCopy=Object.assign({...formF}, obj);
        formFCopy.id=formF.id;//dont want to lose this
        formFsDispatch('update', formFCopy);
    }
    
    const panes = [
        { menuItem: 'Form', render: () => <Tab.Pane>  <ViewForm formF={formF} aircraftList={aircraftList}/> </Tab.Pane> },
        { menuItem: 'Basic', render: () => <Tab.Pane> <BasicDetails formF={formF} aircraftList={aircraftList} mergeProps={mergeProps}/> </Tab.Pane> },
        { menuItem: 'Kit', render: () => <Tab.Pane>   <EditItemGroup formF={formF} mergeProps={mergeProps} objName={'kit'} title={'Kit'}/> </Tab.Pane> },
        { menuItem: 'Cargo', render: () => <Tab.Pane> <EditItemGroup formF={formF} mergeProps={mergeProps} objName={'cargo'} title={'Cargo'}/> </Tab.Pane> },
        { menuItem: 'Fuel', render: () => <Tab.Pane>  <EditFuel formF={formF} mergeProps={mergeProps}/></Tab.Pane> },
    ];
    
    return <>
        <Tab panes={panes} renderActiveOnly style={{textAlign:'center'}}/>
    </>
}