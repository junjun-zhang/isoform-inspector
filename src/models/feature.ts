import { types, Instance } from 'mobx-state-tree';


const Feature = () => {
    return types
        .model('Feature', {
            featureTypes: types.array(types.string),
            featureIds: types.maybe(types.array(types.string)),
            currentFeatureId: types.maybe(types.string),
            totalBasesToRender: types.maybe(types.number),
            featureAnnoFields: types.maybe(types.array(types.string)),
            // object{key: featureId, value: object{key: field, value: any}}
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
