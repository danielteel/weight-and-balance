import React, { useEffect, useState } from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import { useStoredReducer } from '@dteel/use-stored-reducer';
import WABMenu from './components/WABMenu';
import FormF from './components/FormF';
import FormFs from './components/FormFs';
import FormFMenu from './components/FormFMenu';

const menuItems=[
    {page:'formfs', title: 'Form Fs'},
    {page:'aircraft', title:'Aircraft'},
    {page:'standardkit', title:'Kit Presets'},
    {page:'standardcargo', title:'Cargo Presets'}
]

function selectedMenuReducer(state, action, payload) {
    return {page: action, ...payload};
}


function formFsReducer(state, action, payload){
    switch (action){
        case 'close':{
            const id=payload;
            const formFs=state;
            for (const formF of formFs){
                if (formF.id===id) formF.open=false;
            }
            return formFs;
        }
        case 'open':{
            const id=payload;
            const formFs=state;
            for (const formF of formFs){
                if (formF.id===id) formF.open=true;
            }
            return formFs;
        }
        case 'delete':{
            const id=payload;    
            const formFs=state;        
            return formFs.filter( formF => !(formF.id===id) );
        }
        case 'create':{
            if (state){
                return [...state, payload];
            }else{
                return [payload];
            }
        }
        default:
            return state;
    }
}

function App() {
    const [selectedMenu, {current: selectedMenuDispatch}] = useStoredReducer('wab-menu', selectedMenuReducer, {page: 'formfs'}, sessionStorage, 1000)
    const [formFs, {current: formFsDispatch}] = useStoredReducer('wab-formfs', formFsReducer, [], localStorage);

    const goHome = () => selectedMenuDispatch('formfs');

    let pageToShow=null;

    if (selectedMenu?.page==='formfs'){
        pageToShow = <FormFs formFs={formFs} formFsDispatch={formFsDispatch}/>
    }else if (selectedMenu?.page==='formf'){
        pageToShow = <FormF id={selectedMenu?.id} formFs={formFs} formFsDispatch={formFsDispatch} goHome={goHome}/>
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