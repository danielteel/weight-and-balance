import ItemGroup from '../ItemGroup';
import itemGroupReducer from '../../reducers/itemGroupReducer';


export default function EditItemGroup({formF, mergeProps, objName, title, presets}){
    const itemsDispatch = (action, payload, callback) => mergeProps( {[objName]: itemGroupReducer(formF[objName], action, payload, callback)} );

    return <ItemGroup items={formF[objName]} itemsDispatch={itemsDispatch} title={title} importList={presets}/>
}