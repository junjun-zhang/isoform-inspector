// import { SubjectModel } from "../models/subject";
import { FeatureStateModel } from "../models/feature";
import { ObservationModel } from '../models/observation';
import { subjectIds } from '../dataAdapters/utils'

const dataUrlPrefixPath = "data"

export interface FetchedData {
    features: FeatureStateModel,
    observations: ObservationModel
}

export async function fetchObservations(
    geneId: string,
    featureType: string,
    subjectType: string,
    subjectIds: string[]
): Promise<FetchedData> {
    var localFilePrefix = featureType === 'junction' ?
        'junction_quantifications' : 'exon_quantifications';

    let features: any = {
        featureType: featureType,
        featureIds: [],
        currentFeatureId: undefined,
        featureAnnoFields: [],
        features: {},
        featureOrderBy: '',
    };
    let observations: any = {};
    observations[featureType] = {
        featureType: featureType,
        subjects: {}
    }

    await new Promise(async (resolve, reject) => {
        subjectIds.reduce(async (memo, subj) => {
            await memo;

            const dataPath = [
                dataUrlPrefixPath, 'observations', geneId, 'subjects', subj, 'observations', `${localFilePrefix}.json`
            ].join('/');

            return fetch(dataPath,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            )
                .then((response) => {
                    return response.json();
                })
                .then((myJson) => {
                    const subjectId = myJson.subjects[0].subject_id;

                    observations[featureType].subjects[subjectId] = {
                        subjectId: subjectId,
                        features: {}
                    };

                    for (const f of myJson.subjects[0].features) {
                        f['featureId'] = f['feature_id'];
                        delete f['feature_id'];
                        if (!features.featureIds.includes(f['featureId'])) {
                            features.featureIds.push(f['featureId']);
                            features.features[f['featureId']] = {
                                featureId: f['featureId'],
                                featureType: featureType
                            };
                        }
                        // console.log('f: ', f)
                        observations[featureType].subjects[subjectId].features[f['featureId']] = f.value;
                    }

                    if (subjectIds.length === Object.keys(observations[featureType].subjects).length) {
                        resolve(1);
                    }
                }); 

        }, Promise.resolve());
    });

    //@ts-ignore
    return { features, observations };
}


export async function fetchSubjects(
    subjectDataSource: string | undefined
) {
    let subjectAnnoFields: string[] = [];
    let subjects: {[key: string]: any} = {};
    for (const subjectId of subjectIds) {
        const { annoFields, annotations } = await fetchSubjectAnnotations(subjectId)
        for (const field of annoFields) {
            if (!subjectAnnoFields.includes(field)) subjectAnnoFields.push(field)
        }
        subjects[subjectId] = annotations
    }

    return {subjectIds, subjects, subjectAnnoFields}
}

export async function fetchSubjectAnnotations(
    subjectId: string
) {
    const dataPath = [
        dataUrlPrefixPath, 'subjects', subjectId, 'annotations.json'
    ].join('/');

    const response = await fetch(dataPath,
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    );

    const myJson = await response.json();

    let annoFields: string[] = [];
    let annotations: {[key: string]: (string | number)} = {};

    for (const anno of myJson.annotations) {
        if (!annoFields.includes(anno.type)) annoFields.push(anno.type);
        annotations[anno.type] = anno.value;
    }

    return { annoFields, annotations };
}
