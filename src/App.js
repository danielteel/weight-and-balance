import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import { useStoredReducer } from '@dteel/use-stored-reducer';
import WABMenu from './components/WABMenu';
import FormF from './components/FormF';
import FormFs from './components/FormFs';
import FormFMenu from './components/FormFMenu';
import Aircraft from './components/Aircraft';
import ItemGroup from './components/ItemGroup';

import formFsReducer from './reducers/formFsReducer';
import aircraftReducer from './reducers/aircraftReducer';
import selectedMenuReducer from './reducers/selectedMenuReducer';
import itemGroupReducer from './reducers/itemGroupReducer';


const menuItems=[
    {page:'formfs', title: 'Form Fs'},
    {page:'aircraft', title:'Aircraft'},
    {page:'standardkit', title:'Stock Kit'},
    {page:'standardcargo', title:'Stock Cargo'}
]




function App() {
    const [selectedMenu, {current: selectedMenuDispatch}] = useStoredReducer('wab-menu', selectedMenuReducer, {page: 'formfs'}, sessionStorage, 500);

    const [formFs, {current: formFsDispatch}] = useStoredReducer('wab-formfs', formFsReducer, [], localStorage, 500);
    const [aircraft, {current: aircraftDispatch}] = useStoredReducer('wab-aircraft', aircraftReducer, [], localStorage, 500);
    const [kit, {current: kitDispatch}] = useStoredReducer('wab-kit', itemGroupReducer, [], localStorage, 500);
    const [cargo, {current: cargoDispatch}] = useStoredReducer('wab-cargo', itemGroupReducer, [], localStorage, 500);

    const goHome = () => selectedMenuDispatch('formfs');

    let pageToShow=null;

    if (selectedMenu?.page==='formfs'){
        pageToShow = <FormFs formFs={formFs} formFsDispatch={formFsDispatch} selectedMenuDispatch={selectedMenuDispatch} aircraftList={aircraft}/>
    }else if (selectedMenu?.page==='formf'){
        pageToShow = <FormF id={selectedMenu?.id} formFs={formFs} formFsDispatch={formFsDispatch} aircraftList={aircraft} goHome={goHome}/>
    }else if (selectedMenu?.page==='aircraft'){
        pageToShow=<Aircraft aircraft={aircraft} aircraftDispatch={aircraftDispatch}/>
    }else if (selectedMenu?.page==='standardkit'){
        pageToShow=<ItemGroup items={kit} itemsDispatch={kitDispatch} title='Kit'/>
    }else if (selectedMenu?.page==='standardcargo'){
        pageToShow=<ItemGroup items={cargo} itemsDispatch={cargoDispatch} title='Cargo'/>
    }else{
        selectedMenuDispatch('formfs');
    }

    return ( 
        <Container>
            <Segment attached="top">
                <Header as='h1' textAlign="center">WAB</Header>
                <Header as='h6' textAlign='center' style={{color:'#00000033'}}>Reference Use Only</Header>
            </Segment>
            <WABMenu menuItems={menuItems} selectedMenu={selectedMenu} selectedMenuDispatch={selectedMenuDispatch}/>
            <FormFMenu menuItems={menuItems} selectedMenu={selectedMenu} selectedMenuDispatch={selectedMenuDispatch} formFs={formFs} formFsDispatch={formFsDispatch}/>
            <Segment attached="bottom" secondary style={{display:'flex', justifyContent:'center'}}>
                {pageToShow}
            </Segment>
        </Container>
    );
}

export default App;