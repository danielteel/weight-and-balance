import { Menu, Icon } from "semantic-ui-react";

export default function FormFMenu({menuItems, selectedMenu, selectedMenuDispatch, formFs, formFsDispatch}){


    if (!selectedMenu || !selectedMenu.page) selectedMenuDispatch(menuItems[0].page);

    const openFormFs=formFs?.filter( item => item.open );

    if (!openFormFs || openFormFs.length===0) return null;

    return (
            <Menu.Menu position="right">
                    {
                        openFormFs.map( item => {
                            return (
                                <Menu.Item
                                    style={{paddingLeft: '3px', paddingRight: '0px'}}
                                    key={"menuformf"+item.id}
                                    active={selectedMenu?.page==='formf' && selectedMenu?.id === item.id}
                                    onClick={()=>selectedMenuDispatch('formf', {id: item.id})}
                                >
                                    <span style={{minWidth: '2em'}}>
                                        {item.mission}
                                    </span>
                                    <div style={{marginLeft: 'auto'}} onClick={(e)=>{
                                        e.stopPropagation();
                                        if (selectedMenu?.page==='formf' && selectedMenu?.id === item.id) selectedMenuDispatch(menuItems[0].page);
                                        formFsDispatch('close', item.id);
                                    }}>
                                        <Icon  name='close'/>
                                    </div>
                                </Menu.Item>
                            );
                        })
                    }
            </Menu.Menu>
    );
}