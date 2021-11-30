import { types, Instance } from 'mobx-state-tree';


const Annotation = () => {
    return types
        .model('Annotation', {
            field: types.string,
            vaule: types.string || types.number,
        })
}

export default Annotation
export type AnnotationStateModel = ReturnType<typeof Annotation>
export interface AnnotationModel extends Instance<AnnotationStateModel> { }
