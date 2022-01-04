import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import WABMenu from './components/WABMenu';
import FormF from './components/FormF';
import FormFs from './components/FormFs';
import Aircraft from './components/Aircraft';
import ItemGroup from './components/ItemGroup';
import Options from './components/Options';

import useFormFsReducer from './reducers/formFsReducer';
import useAircraftReducer from './reducers/aircraftReducer';
import useSelectedMenuReducer from './reducers/selectedMenuReducer';
import useItemGroupReducer from './reducers/itemGroupReducer';
import AplnCgCharts from './apln-cg';

const menuItems=[
    {page:'formfs', title: 'Form Fs'},
    {page:'aircraft', title: 'Aircraft'},
    {page:'standardkit', title: 'Kit Presets'},
    {page:'standardcargo', title: 'Cargo Presets'},
    {page:'options', title: 'Options'},
]




function App() {
    const [selectedMenu, selectedMenuDispatch] = useSelectedMenuReducer(1000);

    const [formFs, formFsDispatch] = useFormFsReducer();
    const [aircraft, aircraftDispatch] = useAircraftReducer(1000);
    const [kit, kitDispatch] = useItemGroupReducer('kit', 1000);
    const [cargo, cargoDispatch] = useItemGroupReducer('cargo', 1000);

    const goHome = () => selectedMenuDispatch('formfs');

    let pageToShow=null;

    if (selectedMenu?.page==='formfs'){
        pageToShow = <FormFs formFs={formFs} formFsDispatch={formFsDispatch} selectedMenuDispatch={selectedMenuDispatch} aircraftList={aircraft}/>
    }else if (selectedMenu?.page==='formf'){
        pageToShow = <FormF id={selectedMenu?.id} formFs={formFs} formFsDispatch={formFsDispatch} aircraftList={aircraft} goHome={goHome} standardKit={kit} standardCargo={cargo}/>
    }else if (selectedMenu?.page==='aircraft'){
        pageToShow=<Aircraft aircraft={aircraft} aircraftDispatch={aircraftDispatch}/>
    }else if (selectedMenu?.page==='standardkit'){
        pageToShow=<ItemGroup items={kit} itemsDispatch={kitDispatch} title='Kit Presets'/>
    }else if (selectedMenu?.page==='standardcargo'){
        pageToShow=<ItemGroup items={cargo} itemsDispatch={cargoDispatch} title='Cargo Presets'/>
    }else if (selectedMenu?.page==='options'){
        pageToShow=<Options/>
    }else{
        selectedMenuDispatch('formfs');
    }

    const aplnCgCharts = new aplnCgCharts();
    aplnCgCharts.$gross_weight.value = 45000;
    aplnCgCharts.calc();

    return ( 
        <Container>
            <Segment attached="top">
                <Header as='h1' textAlign="center">WAB</Header>
                <Header as='h6' textAlign='center' style={{color:'#00000033'}}>Reference Use Only</Header>
            </Segment>
            {aplnCgCharts.$apln_forward_limit} - {aplnCgCharts.$apln_aft_limit}
            <WABMenu menuItems={menuItems} selectedMenu={selectedMenu} selectedMenuDispatch={selectedMenuDispatch} formFs={formFs} formFsDispatch={formFsDispatch}/>
            <Segment attached="bottom" secondary style={{alignItems:'center', display:'flex', flexDirection:'column'}}>
                {pageToShow}
            </Segment>
        </Container>
    );
}

export default App;