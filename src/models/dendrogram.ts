import { types, Instance } from 'mobx-state-tree';


const Dendrogram = () => {
    return types
        .model('Dendrogram', {
            field: types.string,
            vaule: types.string || types.number,
        })
}

export default Dendrogram
export type DendrogramStateModel = ReturnType<typeof Dendrogram>
export interface DendrogramModel extends Instance<DendrogramStateModel> { }
