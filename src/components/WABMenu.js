import { Menu, Segment } from "semantic-ui-react";

export default function WABMenu({menuItems, selectedMenu, selectedMenuDispatch}){
    if (!selectedMenu || !selectedMenu.page) selectedMenuDispatch(menuItems[0].page);

    return (
            <Menu attached>
                {
                    menuItems.map( item => <Menu.Item
                        key={"menu"+item.page}
                        name={item.title}
                        active={selectedMenu?.page === item.page}
                        onClick={()=>selectedMenuDispatch(item.page)}
                    />)
                }
            </Menu>
    );
}