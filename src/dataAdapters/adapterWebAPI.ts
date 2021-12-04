import { SubjectModel } from "../models/subject";
import { FeatureModel } from "../models/feature";
import { ObservationModel } from '../models/observation';

const dataUrlPrefixPath = "data"

export interface FetchedData {
    subjectIds: string[],
    subjects: SubjectModel[],
    subjectAnnoFields: string[],
    featureIds: string[],
    features: FeatureModel[],
    data: ObservationModel
}

export async function fetchUrlData(
    geneId: string,
    featureType: string,
    subjectType: string,
    subjectIds: string[]
): Promise<FetchedData> {
    var localFilePrefix = featureType === 'junction' ?
        'junction_quantifications' : 'exon_quantifications';

    let featureIds: string[] = [];
    let features: any[] = [];
    let data: { observationType: string, featureType: string, subjects: SubjectModel[] } = {
        "observationType": "read_counts",
        "featureType": "junction_quantification",
        "subjects": []
    };

    // var observationType: string = 'read_counts';
    let subjects: { [key: string]: any } = {};

    await new Promise(async (resolve, reject) => {
        subjectIds.reduce(async (memo, subj) => {
            await memo;

            const dataPath = [
                dataUrlPrefixPath, geneId, 'subjects', subj, 'observations', `${localFilePrefix}.json`
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
                    const subjectId = myJson.subjects[0].subject_id
                    subjects[subjectId] = {
                        subjectType: subjectType,
                        annotations: {}
                    };

                    for (const f of myJson.subjects[0].features) {
                        f['featureId'] = f['feature_id'];
                        delete f['feature_id'];
                        if (!featureIds.includes(f['featureId'])) {
                            featureIds.push(f['featureId']);
                            features.push({
                                featureId: f['featureId'],
                                featureType: featureType
                            });
                        }
                    }

                    data.subjects.push({
                        subjectId: subjectId,
                        //@ts-ignore
                        features: myJson.subjects[0].features
                    })

                    if (subjectIds.length === Object.keys(subjects).length) {
                        console.log('resolved')
                        resolve(1);
                    }
                }); 

        }, Promise.resolve());
    });

    // now fetch subject annotations
    let subjectAnnoFields: string[] = [];
    for (const subjectId in subjects) {
        const { annoFields, annotations } = await fetchSubjectAnnotations(geneId, subjectId)
        for (const field of annoFields) {
            if (!subjectAnnoFields.includes(field)) subjectAnnoFields.push(field)
        }
        subjects[subjectId].annotations = annotations
    }

    //@ts-ignore
    return { subjects, subjectAnnoFields, featureIds, features, data };
}


export async function fetchSubjectAnnotations(
    geneId: string,
    subjectId: string
) {
    const dataPath = [
        dataUrlPrefixPath, geneId, 'subjects', subjectId, 'annotations.json'
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
