import { Menu, Segment } from 'semantic-ui-react';
import ViewForm from './formf-components/ViewForm';
import BasicDetails from './formf-components/BasicDetails';
import EditFuel from './formf-components/EditFuel';
import EditItemGroup from './formf-components/EditItemGroup';
import EditRemarks from './formf-components/EditRemarks';
import FormOptions from './formf-components/FormOptions';

import './formf-components/formf.css';

export default function FormF({formFs, formFsDispatch, aircraftList, id, goHome, standardKit, standardCargo}){
    const formF = formFs?.find( form => form.id===id );
    if (!Array.isArray(aircraftList)) aircraftList=[];

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
        { viewName: 'Fuel',     render: <EditFuel formF={formF} mergeProps={mergeProps}/> },
        { viewName: 'Kit',      render: <EditItemGroup formF={formF} mergeProps={mergeProps} objName={'kit'} title={'Kit'} presets={standardKit}/> },
        { viewName: 'Cargo',    render: <EditItemGroup formF={formF} mergeProps={mergeProps} objName={'cargo'} title={'Cargo'} presets={standardCargo}/> },
        { viewName: 'Remarks',  render: <EditRemarks formF={formF} mergeProps={mergeProps} aircraftList={aircraftList}/>},
        { viewName: 'Options',  render: <FormOptions formF={formF} aircraftList={aircraftList}/>}
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
            <Menu  attached style={{overflowX: 'auto', overflowY:'hidden', touchAction:'pan-x pan-y'}}>
                
                {
                    views.map( item => (
                        <Menu.Item
                            style={{touchAction:'pan-x pan-y'}}
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