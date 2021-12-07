import { types, Instance } from 'mobx-state-tree';


const Feature = () => {
    return types
        .model('Feature', {
            featureType: types.maybe(types.string),
            featureIds: types.maybe(types.array(types.string)),
            currentFeatureId: types.maybe(types.string),
            featureAnnoFields: types.maybe(types.array(types.string)),
            // object{key: subjectId, value: object{key: field, value: any}}
            features: types.maybe(types.map(types.frozen())),
        })
        .actions(self => ({
            setCurrentFeatureId(featureId: string | undefined) {
                self.currentFeatureId = featureId;
            },

        }))
}

export default Feature
export type FeatureStateModel = ReturnType<typeof Feature>
export interface FeatureType extends Instance<FeatureStateModel> {}
