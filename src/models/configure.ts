import { types, Instance } from 'mobx-state-tree';


const Configure = () => {
    return types
        .model('Configure', {
            displayName: "Isoform Inspection",
            width: 1200,
            height: 800,
            theme: types.enumeration(['light', 'dark']),
            geneId: types.maybe(types.string),
            feature: types.model({
                featureType: types.enumeration(['exon', 'junction']),
                featureDataSource: types.string,
            }),
            subject: types.model({
                subjectType: types.enumeration(['sample', 'cell']),
                subjectDataSource: types.string,
            }),
            observation: types.model({
                observationType: types.enumeration(['read_counts']),
                observationDataSource: types.string,
            })
        })
        .actions(self => ({
            setDisplayName(displayName: string) {
                self.displayName = displayName;
            },
            setWidth(width: number) {
                self.width = width;
            },
            setHeight(height: number) {
                self.height = height;
            },
            setTheme(theme: string) {
                self.theme = theme;
            },
            setGeneId(geneId: string) {
                self.geneId = geneId;
            },
            setFeatureType(featureType: Instance<'junction'> | Instance<'exon'>) {
                self.feature.featureType = featureType;
            },
            setSubjectType(subjectType: Instance<'sample'> | Instance<'cell'>) {
                self.subject.subjectType = subjectType;
            },
        }))
}

export default Configure;
export type ConfigureStateModel = ReturnType<typeof Configure>;
export interface ConfigureModel extends Instance<ConfigureStateModel> { };
