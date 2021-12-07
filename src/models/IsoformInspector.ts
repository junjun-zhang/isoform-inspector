import { createContext, useContext } from "react";
import { types, Instance, flow } from 'mobx-state-tree';
import Feature from './feature';
import Observation from './observation';
import { fetchSubjects, fetchObservations } from '../dataAdapters/adapterWebAPI'
import { getNivoData, getVisxData, getSubjAnnoData } from '../dataAdapters/utils'
import Subject from "./subject";
import Configure from "./configure";


export default function IsoformInspector() {
    return types
        .model('IsoformInspector', {
            type: types.literal('IsoformInspector'),
            dataState: types.enumeration(['noData', 'pending', 'loaded']),

            configure: Configure(),
            features: types.maybe(Feature()),
            subjects: types.maybe(Subject()),
        })
        .volatile(() => ({
            observations: types.map(Observation()),
            error: types.frozen()
        }))
        .actions(self => ({
            setGeneId: flow(function* (geneId) {
                self.dataState = 'pending';
                try {
                    // fetch subjects first, later this should be done elsewhere, not under setGeneId
                    const fetchedSubjects = yield fetchSubjects(self.configure.subject.subjectDataSource);
                    //@ts-ignore
                    self.subjects = {
                        subjectType: self.configure.subject.subjectType,
                        //@ts-ignore
                        subjectIds: fetchedSubjects.subjectIds,
                        //@ts-ignore
                        subjects: fetchedSubjects.subjects,
                        //@ts-ignore
                        subjectAnnoFields: fetchedSubjects.subjectAnnoFields
                    };

                    // then fetch features, to be added when gene model data source is available

                    // finally fetch observations, for now fetch features at this step as well
                    const fetchedData = yield fetchObservations(
                        geneId,
                        self.configure.feature.featureType,
                        self.configure.subject.subjectType,
                        //@ts-ignore
                        self.subjects.subjectIds
                    );
                    //@ts-ignore
                    self.features = fetchedData.features;
                    //@ts-ignore
                    self.observations = fetchedData.observations;

                    self.configure.geneId = geneId;
                    self.dataState = 'loaded';

                } catch (error: any) {
                    self.error = error;
                }
            }),
        }))
        .views(self => ({
            get nivoData() {
                return getNivoData(
                    //@ts-ignore
                    self.subjects.subjectIds,
                    //@ts-ignore
                    self.features.featureIds,
                    self.configure.subject.subjectType,
                    self.configure.feature.featureType,
                    self.observations
                );
            },
            get visxData() {
                return getVisxData(
                    //@ts-ignore
                    self.subjects.subjectIds,
                    //@ts-ignore
                    self.features.featureIds,
                    self.configure.feature.featureType,
                    self.observations
                );
            },
            get subjAnnoWidth() {
                return self.configure.width * 0.2
            },
            get heatmapWidth() {
                return self.configure.width * 0.8
            },
            // subjAnnoData(chartType: string) {
            //     return getSubjAnnoData(self.subjectType, self.subjectIds, self.subjects);
            // }
        }))
}

export type IsoformInspectorStateModel = ReturnType<typeof IsoformInspector>
export type IsoformInspectorModel = Instance<IsoformInspectorStateModel>

let _store: any = null;

export function initializeStore() {
    _store = IsoformInspector().create({
        type: 'IsoformInspector',
        dataState: 'noData',
        configure: {
            displayName: 'Transcript Isoform Inspector',
            width: 1200,
            height: 800,
            theme: 'light',
            geneId: undefined,
            feature: {
                featureType: 'junction',
                featureDataSource: 'WebAPI',
                featureOrderBy: 'coordinates'
            },
            subject: {
                subjectType: 'sample',
                subjectDataSource: 'WebAPI',
                subjectOrderBy: 'clustering',
            },
            observation: {
                observationType: 'read_counts',
                observationDataSource: 'WebAPI',
            },
        }
    });
    return _store;
}

export type IsoformInspectorInstance = Instance<typeof IsoformInspector>;
const IsoformInspectorStoreContext = createContext<null | IsoformInspectorInstance>(null);
export const Provider = IsoformInspectorStoreContext.Provider;

export function useStore(): Instance<typeof IsoformInspector> {
    const store = useContext(IsoformInspectorStoreContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
}
