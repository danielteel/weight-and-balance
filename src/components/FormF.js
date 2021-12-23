import { Menu, Segment, Container } from 'semantic-ui-react';
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
    
    const views = [
        { viewName: 'Form',     render: <ViewForm formF={formF} aircraftList={aircraftList}/> },
        { viewName: 'Basic',    render: <BasicDetails formF={formF} aircraftList={aircraftList} mergeProps={mergeProps}/> },
        { viewName: 'Kit',      render: <EditItemGroup formF={formF} mergeProps={mergeProps} objName={'kit'} title={'Kit'}/> },
        { viewName: 'Cargo',    render: <EditItemGroup formF={formF} mergeProps={mergeProps} objName={'cargo'} title={'Cargo'}/> },
        { viewName: 'Fuel',     render: <EditFuel formF={formF} mergeProps={mergeProps}/> },
    ];
    
    let activeView=views[0].render;
    let activeViewName=views[0].viewName;

    for (const view of views){
        if (formF.view === view.viewName){
            activeView=view.render;
            activeViewName=view.viewName;
        }
    }

    return (<>
            <Menu tabular attached>
                {
                    views.map( item => (
                        <Menu.Item
                            key={item.viewName}
                            name={item.viewName}
                            active={activeViewName === item.viewName}
                            onClick={()=>mergeProps({view: item.viewName})}
                        />
                        )
                    )
                }
            </Menu>
            <Segment attached  style={{alignItems:'center', display:'flex', flexDirection:'column'}}>
                {activeView}
            </Segment>
        </>
    );
}