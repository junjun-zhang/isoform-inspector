import { types } from 'mobx-state-tree';


const Observation = () => {
    return types
        // object{key: featureType, value: object{key: subjectId, value: object{key: featureId, value: any}}}
        .model('Observation', {
            featureType: types.identifier,  // exon or junction
            subjects: types.map(
                types.model({
                    subjectId: types.identifier,
                    features: types.map(
                        types.model({
                            featureId: types.identifier,
                            value: types.union(types.null, types.undefined, types.string, types.number)
                        }))
                }))
        })
}

export default Observation
export interface ObservationModel extends ReturnType<typeof Observation> { }
