import { types, Instance } from 'mobx-state-tree';


const Feature = () => {
    return types
        .model('Feature', {
            featureId: types.identifier,
            featureType: types.maybe(types.string),
            annotations: types.maybe(types.frozen())
        })
}

export default Feature
export type FeatureStateModel = ReturnType<typeof Feature>
export interface FeatureModel extends Instance<FeatureStateModel> { }
