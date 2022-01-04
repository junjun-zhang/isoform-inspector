import { createContext, useContext } from "react";
import { types, Instance, flow } from 'mobx-state-tree';
import Feature from './feature';
import Observation from './observation';
import { fetchSubjects, fetchFeatures, fetchObservations } from '../dataAdapters/adapterWebAPI'
import { getNivoData, getVisxData, getSubjAnnoData, orderSubjectByAnnotation } from '../dataAdapters/utils'
import Subject from "./subject";
import Configure from "./configure";
import { clusterData } from '@greenelab/hclust';
import { agnes } from 'ml-hclust'
import { features } from "process";


function inOrderTraverse(currentNode: {[key: string]: any} | null, leafNodes: number[]) {
    if (currentNode !== null) {
        const leftChild = currentNode.children.length === 2 ? currentNode.children[0] : null;
        const rightChild = currentNode.children.length === 2 ? currentNode.children[1]: null;

        inOrderTraverse(rightChild, leafNodes);

        if (currentNode.isLeaf) leafNodes.push(currentNode.index)

        inOrderTraverse(leftChild, leafNodes);
    }
}


export default function IsoformInspector() {
    return types
        .model('IsoformInspector', {
            type: types.literal('IsoformInspector'),
            dataState: types.enumeration(['noData', 'pending', 'loaded']),

            uiState: types.model({
                currentPanel: types.maybe(types.enumeration(['subjectAnnotation', 'heatmap', 'feature'])),
                currentX: types.maybe(types.number),
                currentY: types.maybe(types.number),
            }),

            configure: Configure(),
            features: types.maybe(Feature()),
            subjects: types.maybe(Subject()),
        })
        .volatile(() => ({
            observations: types.map(Observation()),
            error: types.frozen()
        }))
        .actions(self => ({
            setCurrentPanel(currentPanel: 'subjectAnnotation' | 'heatmap' | 'feature' | undefined) {
                self.uiState.currentPanel = currentPanel;
            },
            setCurrentX(currentX: number | undefined) {
                self.uiState.currentX = currentX;
            },
            setCurrentY(currentY: number | undefined) {
                self.uiState.currentY = currentY;
            },
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

                    // then fetch features
                    self.features = yield fetchFeatures(
                        geneId,
                        self.configure.feature.featureDataSource
                    );

                    // finally fetch observations, for now fetch features at this step as well
                    const fetchedData = yield fetchObservations(
                        geneId,
                        self.configure.feature.featureType,
                        self.configure.subject.subjectType,
                        //@ts-ignore
                        self.subjects.subjectIds
                    );
                    //@ts-ignore
                    self.observations = fetchedData.observations;

                    // need to perform ordering of subjects, eg, clustering or by annotation field
                    if (self.configure.subject.subjectOrderBy === 'clustering') {
                        let dataToCluster = []
                        //@ts-ignore
                        for (const subjectId of self.subjects.subjectIds) {
                            let subjectData = []
                            //@ts-ignore
                            for (const featureId of fetchedData.features.featureIds) {
                                //@ts-ignore
                                subjectData.push(self.observations[self.configure.feature.featureType].subjects[subjectId].features[featureId]);
                            }
                            dataToCluster.push(subjectData);
                        }

                        // This one seems not as good
                        // const { clusters, distances, order, clustersGivenK } = clusterData({data: dataToCluster});

                        const tree = agnes(dataToCluster, { method: 'centroid' });
                        const orderedSubjectsIndexes: number[] = []
                        inOrderTraverse(tree, orderedSubjectsIndexes)

                        let newSubjectOrder = []
                        for (const index of orderedSubjectsIndexes) {
                            //@ts-ignore
                            newSubjectOrder.push(self.subjects.subjectIds[index]);
                        }
                        //@ts-ignore
                        self.subjects.subjectIds = newSubjectOrder;
                    } else if (
                            self.configure.subject.subjectOrderBy === 'project' ||
                            self.configure.subject.subjectOrderBy === 'specimen_type'
                        ) {
                        //@ts-ignore
                        orderSubjectByAnnotation(self.subjects, self.configure.subject.subjectOrderBy);
                    }

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
                    self.heatmapFeatureIds,
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
                    self.heatmapFeatureIds,
                    self.configure.feature.featureType,
                    self.observations
                );
            },
            get heatmapFeatureIds() {
                let featureIds: string[] = [];
                //@ts-ignore
                [...self.features.features.values()].map((feature) => {
                    if (feature.featureType === self.configure.feature.featureType) {
                        featureIds.push(feature.featureId);
                    }
                });
                return featureIds;
            },
            get subjAnnoWidth() {
                return self.configure.width * 0.1
            },
            get heatmapWidth() {
                return self.configure.width * 0.9
            },
            get featurePanelHeight() {
                if (!self.features) {
                    return 10;
                }
                //@ts-ignore
                const transcriptCount = [...self.features.features.values()].filter(feature => feature.featureType === 'transcript').length;
                return transcriptCount * self.configure.featureHeight + 100
            },
            get subjAnnoData() {
                return getSubjAnnoData(
                    self.configure.subject.subjectType,
                    self.subjects?.subjectAnnoFields,
                    self.subjects?.subjectIds,
                    self.subjects?.subjects,
                );
            },
            get transcripts(): { [key: string]: any } {
                let transcripts: {[key: string]: any} = {}
                //@ts-ignore
                let features = [...self.features.features.values()];
                let transcriptFeatures = features.filter(feature => feature.featureType === 'transcript');
                let exonOrJunectionFeatures = features.filter(feature => ['exon', 'junction'].includes(feature.featureType));

                //@ts-ignore
                transcriptFeatures.map((transcript) => {
                    let transcriptLength = 0;
                    let exonCount = 0;
                    const f = exonOrJunectionFeatures.filter((f) => f.parentFeatureIds.includes(transcript.featureId));
                    for (const c of f) {
                        if (c.featureType === 'exon') {
                            transcriptLength += c.end - c.start + 1;
                            exonCount++;
                        }
                    }
                    transcripts[transcript.featureId] = {
                        transcriptLength,
                        exonCount,
                        //@ts-ignore
                        pixelsPerBase: this.heatmapWidth / self.features.totalBasesToRender,
                        exonAndJunctions: f
                    }
                });
                return transcripts;
            }
        }))
}

export type IsoformInspectorStateModel = ReturnType<typeof IsoformInspector>
export type IsoformInspectorModel = Instance<IsoformInspectorStateModel>

let _store: any = null;

export function initializeStore() {
    _store = IsoformInspector().create({
        type: 'IsoformInspector',
        dataState: 'noData',
        uiState: {},
        configure: {
            displayName: 'Transcript Isoform Inspector',
            width: 1200,
            heatmapHeight: 600,
            featureHeight: 20,
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
