// hardcoded for now
export const subjectType = 'sample';

// hardcoded for now
export const subjectIds = [
    "SA507131",
    "SA507134",
    "SA507135",
    "SA507144",
    "SA507147",
    "SA507155",
    "SA507158",
    "SA507167",
    "SA507174",
    "SA507176",
    "SA507177",
    "SA507179",
    "SA507194",
    "SA507197",
    "SA507216",
    "SA507217",
    "SA507219",
    "SA507228",
    "SA507232",
    "SA507237",
    "SA507240",
    "SA507249",
    "SA507252",
    "SA507253",
    "SA507261",
    "SA507262",
    "SA507264",
    "SA507271",
    "SA507272",
    "SA507275",
    "SA507285",
    "SA507305",
    "SA507308",
    "SA507315",
    "SA507317",
    "SA507320",
    "SA507324",
    "SA507339",
    "SA507341",
    "SA507344",
    "SA507351",
    "SA507372",
    "SA507375",
    "SA507376",
    "SA507379",
    "SA507384",
    "SA507387",
    "SA507388",
    "SA507396",
    "SA507399",
    "SA507408",
    "SA507411",
    "SA507424",
    "SA507439",
    "SA507442",
    "SA507446",
    "SA507455",
    "SA507458",
    "SA507466",
    "SA507467",
    "SA507469",
    "SA507487",
    "SA507492",
    "SA507494",
    "SA507495",
    "SA507497",
    "SA507504",
    "SA507506",
    "SA507507",
    "SA507509",
    "SA507539",
    "SA507542",
    "SA507557",
    "SA507566",
    "SA507575",
    "SA507578",
    "SA507587"
]

export function getNivoData(
    subjectIds: string[],
    featureIds: string[],
    subjectType: string,
    featureType: string,
    observations: any
) {
    let nivoData: any[] = [];
    for (const subjectId of subjectIds) {
        let count_info: { [key: string]: any } = {};
        count_info[subjectType] = subjectId;

        for (const featureId of featureIds) {
            count_info[featureId] = observations[featureType].subjects[subjectId].features[featureId];
        }
        nivoData.push(count_info);
    }
    return nivoData
}

export function getVisxData(
    subjectIds: string[],
    featureIds: string[],
    featureType: string,
    observations: any
) {
    var visxData: any[] = [];
    let i = 0;
    for (const subjectId of subjectIds) {
        let j = 0;
        for (const featureId of featureIds) {
            if (i === 0) {
                visxData.push({
                    bin: j,
                    bins: [{
                        bin: subjectIds.length - i - 1,
                        count: observations[featureType].subjects[subjectId].features[featureId]
                    }]
                })
            } else {
                visxData[j].bins.push({
                    bin: subjectIds.length - i - 1,
                    count: observations[featureType].subjects[subjectId].features[featureId]
                })
            }
            j++;
        }
        i++;
    }

    return visxData
}

export function getSubjAnnoData(
    subjectType: string,
    subjectIds: string[],
    subjects: { [key: string]: any } | undefined,
) {
    if (subjects === undefined) return;

    let annoData: any[] = [];
    for (const subjectId of subjectIds) {
        let anno: { [key: string]: any } = {};
        anno[subjectType] = subjectId;

        for (const field in subjects[subjectId].annotations) {
            anno[field] = subjects[subjectId].annotations[field];
        }
        annoData.push(anno);
    }
    return annoData
}
