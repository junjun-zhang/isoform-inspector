import { types, Instance } from 'mobx-state-tree';


const Feature = () => {
    return types
        .model('Feature', {
            featureId: types.string,
            featureType: types.maybe(types.string),
        })
}

export default Feature
export type FeatureStateModel = ReturnType<typeof Feature>
export interface FeatureModel extends Instance<FeatureStateModel> { }
