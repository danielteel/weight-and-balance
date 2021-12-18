import React, { useEffect, useState } from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import { useStoredReducer } from '@dteel/use-stored-reducer';
import WABMenu from './components/WABMenu';
import FormF from './components/FormF';
import FormFs from './components/FormFs';
import FormFMenu from './components/FormFMenu';
import Aircraft from './components/Aircraft';

import formFsReducer from './reducers/formFsReducer';
import aircraftReducer from './reducers/aircraftReducer';
import selectedMenuReducer from './reducers/selectedMenuReducer';

const menuItems=[
    {page:'formfs', title: 'Form Fs'},
    {page:'aircraft', title:'Aircraft'},
    {page:'standardkit', title:'Kit Presets'},
    {page:'standardcargo', title:'Cargo Presets'}
]




function App() {
    const [selectedMenu, {current: selectedMenuDispatch}] = useStoredReducer('wab-menu', selectedMenuReducer, {page: 'formfs'}, sessionStorage, 500)
    const [formFs, {current: formFsDispatch}] = useStoredReducer('wab-formfs', formFsReducer, [], localStorage, 500);
    const [aircraft, {current: aircraftDispatch}] = useStoredReducer('wab-aircraft', aircraftReducer, [], localStorage, 500);

    const goHome = () => selectedMenuDispatch('formfs');

    let pageToShow=null;

    if (selectedMenu?.page==='formfs'){
        pageToShow = <FormFs formFs={formFs} formFsDispatch={formFsDispatch} selectedMenuDispatch={selectedMenuDispatch}/>
    }else if (selectedMenu?.page==='formf'){
        pageToShow = <FormF id={selectedMenu?.id} formFs={formFs} formFsDispatch={formFsDispatch} goHome={goHome}/>
    }else if (selectedMenu?.page==='aircraft'){
        pageToShow=<Aircraft/>
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
            <Segment attached="bottom" secondary>
                {pageToShow}
            </Segment>
        </Container>
    );
}

export default App;