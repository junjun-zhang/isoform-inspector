import { createContext, useContext } from "react";
import { types, Instance, flow } from 'mobx-state-tree';
import Subject from './subject';
import Feature from './feature';
import { ObservationModel } from './observation';
import { fetchUrlData } from '../dataAdapters/adapterWebAPI'
import { getNivoData, getVisxData } from '../dataAdapters/utils'
import { subjectIds, subjectType } from '../dataAdapters/utils'


export default function IsoformInspector() {
    return types
        .model('IsoformInspector', {
            type: types.literal('IsoformInspector'),
            displayName: types.string,
            colors: "greens",
            width: 800,
            height: 500,

            geneId: types.string,

            subjectType: types.string,
            subjectIds: types.array(types.string),
            subjects: types.array(Subject()),
            subjectOrderBy: types.maybe(types.string),

            featureType: types.enumeration(['junction', 'exon', 'transcript']),
            featureIds: types.array(types.string),
            features: types.array(Feature()),

            dataState: types.string,
        })
        .volatile(() => ({
            data: (undefined as unknown) as ObservationModel,
            error: types.frozen()
        }))
        .actions(self => ({
            setDisplayName(displayName: string) {
                self.displayName = displayName;
            },
            setGeneId: flow(function* (geneId) {
                self.dataState = 'pending';
                try {
                    const fetchedData = yield fetchUrlData(
                        geneId, 'junction', self.subjectType, self.subjectIds)
                    //@ts-ignore
                    self.subjects = fetchedData.subjects;
                    //@ts-ignore
                    self.featureIds = fetchedData.featureIds;
                    //@ts-ignore
                    self.features = fetchedData.features;
                    //@ts-ignore
                    self.data = fetchedData.data;

                    self.geneId = geneId;
                    self.dataState = 'done';
                } catch (error: any) {
                    self.error = error;
                }
            }),
            setColors(colors: string) {
                self.colors = colors;
            },
        }))
        .views(self => ({
            //@ts-ignore
            nivoData() {
                return getNivoData(self.subjectType, self.data);
            },
            //@ts-ignore
            visxData() {
                return getVisxData(self.data);
            },
        }))
}

export type IsoformInspectorStateModel = ReturnType<typeof IsoformInspector>
export type IsoformInspectorModel = Instance<IsoformInspectorStateModel>

let _store: any = null;

export function initializeStore() {
    _store = IsoformInspector().create({
        type: 'IsoformInspector',
        displayName: 'Transcript Isoform Inspector',
        geneId: '',
        colors: "greens",
        width: 800,
        height: 500,
        featureType: 'junction',
        subjectType: subjectType,
        subjectIds: subjectIds,
        dataState: 'noData',
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