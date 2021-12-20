import { Tab } from 'semantic-ui-react';
import FormFForm from './formf-components/FormFForm';
import BasicDetails from './formf-components/BasicDetails';


export default function FormF({formFs, formFsDispatch, aircraft, id, goHome}){
    const formF = formFs?.find( form => form.id===id );

    if (!formF){
        goHome();
        return null;
    }

    const panes = [
        { menuItem: 'Form', render: () => <Tab.Pane><FormFForm formF={formF} aircraftList={aircraft}/></Tab.Pane> },
        { menuItem: 'Basic', render: () => <Tab.Pane><BasicDetails formF={formF} formFsDispatch={formFsDispatch} aircraftList={aircraft}/></Tab.Pane> },
        { menuItem: 'Kit', render: () => <Tab.Pane></Tab.Pane> },
        { menuItem: 'Cargo', render: () => <Tab.Pane></Tab.Pane> },
        { menuItem: 'Fuel', render: () => <Tab.Pane></Tab.Pane> },
    ];
    
    return <>
        <Tab panes={panes} renderActiveOnly style={{width: "100%"}}/>
    </>
}