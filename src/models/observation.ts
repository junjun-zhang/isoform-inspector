import { types, Instance } from 'mobx-state-tree';

const SubjectWithObservation = types
    .model('SubjectWithObservation', {
        subjectId: types.string,
        features: types.array(types.model({
            featureId: types.string,
            value: types.string || types.number
        }))
    })


const Observation = types
    .model('Observation', {
        observationType: types.string,
        featureType: types.string,
        subjects: types.array(SubjectWithObservation),
    })


export default Observation
export interface ObservationModel extends Instance<typeof Observation> { }
export interface SubjectWithObservationModel extends Instance<typeof SubjectWithObservation> { }
