import { Menu, Icon } from "semantic-ui-react";

export default function WABMenu({selectedMenu, selectedMenuDispatch, formFs, formFsDispatch}){
    const menuItems=[
        {page:'formfs', title: 'Form Fs'},
        {page:'aircraft', title:'Aircraft'},
        {page:'standardkit', title:'Kit Presets'},
        {page:'standardcargo', title:'Cargo Presets'}
    ]

    if (!selectedMenu || !selectedMenu.page) selectedMenuDispatch(menuItems[0].page);

    return (
        <>
            <Menu attached>
                {
                    menuItems.map( item => <Menu.Item
                        key={"menu"+item.page}
                        name={item.title}
                        active={selectedMenu?.page === item.page}
                        onClick={()=>selectedMenuDispatch(item.page)}
                    />)
                }
                <Menu.Menu attached position="right">
                    {
                        formFs?.filter( item => {
                            return item.open;
                        }).map( item => {
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
            </Menu>
            <button type="button" onClick={()=>localStorage.clear()}>clear</button>
        </>
    );
}