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


export async function fetchFeatures(
    mainFeatureId: string,
    featureDataSource: string | undefined
) {
    const dataPath = [
        dataUrlPrefixPath, 'features', 'genes', mainFeatureId + '.json'
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
    const mainFeature = myJson[mainFeatureId];

    const featureTypes: string[] = ['gene', 'transcript', 'exon', 'junction'];
    let features: { [key: string]: any } = {};
    let featureIds: string[] = [];
    featureIds.push(mainFeatureId);
    features[mainFeatureId] = {
        featureId: mainFeatureId,
        featureType: 'gene',
        name: mainFeature.name,
        parentFeatureIds: [],
        strand: mainFeature.strand,
        chr: mainFeature.chr,
        start: mainFeature.start,
        end: mainFeature.end
    };

    for (const transcript of mainFeature.transcripts) {
        featureIds.push(transcript.id);
        features[transcript.id] = {
            featureId: transcript.id,
            featureType: 'transcript',
            name: transcript.name,
            parentFeatureIds: [mainFeatureId],
            strand: transcript.strand,
            chr: transcript.chr,
            start: transcript.start,
            end: transcript.end
        };

        let junction_start: number | undefined = undefined;
        let junction_end: number | undefined = undefined;
        let previousExonId;
        for (const exon of transcript.exons) {
            const featureId = `${exon.chr.replace('chr', '')}:${exon.start}-${exon.end}`;

            if ((junction_start && exon.strand === '+') || (junction_end && exon.strand === '-')) {
                if (exon.strand === '+') junction_end = exon.start - 1;
                if (exon.strand === '-') junction_start = exon.end + 1;
                const junctionsId = `${exon.chr.replace('chr', '')}:${junction_start}-${junction_end}`;
                if (!featureIds.includes(junctionsId)) {
                    featureIds.push(junctionsId);
                    features[junctionsId] = {
                        featureType: 'junction',
                        featureId: junctionsId,
                        parentFeatureIds: [transcript.id],
                        strand: exon.strand,
                        chr: exon.chr,
                        start: junction_start,
                        end: junction_end,
                        //@ts-ignore
                        len: junction_end - junction_start + 1,
                        offSet: {},  // to be set later
                        renderLen: {},  // to be set later
                        previousExon: {},  // make it contexture to transcriptId
                        nextExon: {}  // make it contexture to transcriptId
                    };
                } else {
                    features[junctionsId].parentFeatureIds.push(transcript.id);
                }
                features[junctionsId].previousExon[transcript.id] = previousExonId;
                features[junctionsId].nextExon[transcript.id] = featureId;
            }
            if (exon.strand === '+') junction_start = exon.end + 1;
            if (exon.strand === '-') junction_end = exon.start - 1;

            previousExonId = featureId;
            if (!featureIds.includes(featureId)) {
                featureIds.push(featureId);
                features[featureId] = {
                    featureType: 'exon',
                    id: exon.id,
                    featureId: featureId,
                    parentFeatureIds: [transcript.id],
                    strand: exon.strand,
                    chr: exon.chr,
                    start: exon.start,
                    end: exon.end,
                    offSet: 0,
                    len: exon.end - exon.start + 1,
                    renderLen: exon.end - exon.start + 1
                };
            } else {
                features[featureId].parentFeatureIds.push(transcript.id);
            }
        }
    }

    // sort features by coordinates
    // const sortedFeatures = features;
    const sortedFeatures = Object.entries(features).sort((a: any, b: any) => {
        if (a[1].strand === '+') {
            if (a[1].start < b[1].start) {
                return -1;
            } else if (a[1].start === b[1].start && a[1].end > b[1].end) {
                return -1;
            }
            return 0;
        } else {
            if (a[1].end > b[1].end) {
                return -1;
            } else if (a[1].end === b[1].end && a[1].start < b[1].start) {
                return -1;
            }
            return 0;
        }
    }).reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    // add offset of each exon/junction from the start position of the first exon
    // let's do that for all exons first, then junctions
    let totalBasesToRender = 0;
    let offSet = 0;
    let offSetLookup: {[key: string]: number} = {};
    const intronBases = 50;  // 50 bases for rendering an intron
    Object.keys(sortedFeatures).map((f) => {
        //@ts-ignore
        if (sortedFeatures[f].featureType === 'exon') {
            //@ts-ignore
            const feature = sortedFeatures[f];
            feature.offSet = offSet;
            offSet += feature.end - feature.start + 1 + intronBases;

            offSetLookup[feature.featureId] = feature.offSet;
        }
    })
    totalBasesToRender = offSet - intronBases;

    Object.keys(sortedFeatures).map((f) => {
        //@ts-ignore
        if (sortedFeatures[f].featureType === 'junction') {
            //@ts-ignore
            const feature = sortedFeatures[f];
            for (const transcriptId of feature.parentFeatureIds) {
                const previousExon = feature.previousExon[transcriptId];
                const nextExon = feature.nextExon[transcriptId];
                //@ts-ignore
                feature.offSet[transcriptId] = offSetLookup[previousExon] + sortedFeatures[previousExon].len;
                const offSetForEnd = offSetLookup[nextExon] - 1;
                feature.renderLen[transcriptId] = offSetForEnd - feature.offSet[transcriptId] + 1;
            }
        }
    })

    return { featureTypes, featureIds: Object.keys(sortedFeatures), features: sortedFeatures, totalBasesToRender }
}
