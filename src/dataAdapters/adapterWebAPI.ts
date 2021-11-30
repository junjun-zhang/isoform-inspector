import { SubjectModel } from "../models/subject";
import { FeatureModel } from "../models/feature";
import { ObservationModel } from '../models/observation';

const dataUrlPrefixPath = "data"

export interface FetchedData {
    subjectIds: string[],
    subjects: SubjectModel[],
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
    var subjects: SubjectModel[] = [];

    var fetchAll = new Promise(async (resolve, reject) => {
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
                    subjects.push({
                        subjectId: myJson.subjects[0].subject_id,
                        subjectType: subjectType
                    });

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
                        //@ts-ignore
                        subjectId: myJson.subjects[0].subject_id,
                        //@ts-ignore
                        features: myJson.subjects[0].features
                    })

                    if (subjectIds.length === subjects.length) {

                        resolve(1);
                    }
                }); 

        }, Promise.resolve());
    });

    await fetchAll;

    //@ts-ignore
    return { subjects, featureIds, features, data }
}
