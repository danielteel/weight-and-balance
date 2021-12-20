import {Button, Divider, Tab, Header} from 'semantic-ui-react';



export default function FormF({formFs, formFsDispatch, id, goHome}){
    const panes = [
        { menuItem: 'Summary', render: () => <Tab.Pane></Tab.Pane> },
        { menuItem: 'Basic', render: () => <Tab.Pane></Tab.Pane> },
        { menuItem: 'Kit', render: () => <Tab.Pane></Tab.Pane> },
        { menuItem: 'Cargo', render: () => <Tab.Pane></Tab.Pane> },
        { menuItem: 'Fuel', render: () => <Tab.Pane></Tab.Pane> },
    ];

    const formF = formFs?.find( item => item.id===id );

    if (!formF){
        goHome();
        return null;
    }
    
    return <>
        <Tab panes={panes} renderActiveOnly onTabChange={(e, data)=>{
            sessionStorage.setItem('formf-tab-index', data.activeIndex);
        }}/>
    </>
}