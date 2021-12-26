import { Menu } from "semantic-ui-react";
import FormFMenu from './FormFMenu';
export default function WABMenu({menuItems, selectedMenu, selectedMenuDispatch, formFs, formFsDispatch}){
    if (!selectedMenu || !selectedMenu.page) selectedMenuDispatch(menuItems[0].page);

    return (
            <Menu attached style={{overflowX: 'auto', overflowY:'clip', touchAction:'pan-x pan-y'}}>
                {
                    menuItems.map( item => <Menu.Item
                        style={{touchAction:'pan-x pan-y'}}
                        key={"menu"+item.page}
                        name={item.title}
                        active={selectedMenu?.page === item.page}
                        onClick={()=>selectedMenuDispatch(item.page)}
                    />)
                }
                <FormFMenu  menuItems={menuItems} selectedMenu={selectedMenu} selectedMenuDispatch={selectedMenuDispatch} formFs={formFs} formFsDispatch={formFsDispatch}/>
            </Menu>
    );
}