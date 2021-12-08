// hardcoded for now
export const subjectType = 'sample';

// hardcoded for now
export const subjectIds = [
    "SA407918",
    "SA407986",
    "SA408414",
    "SA408530",
    "SA408570",
    "SA408706",
    "SA408758",
    "SA408891",
    "SA409186",
    "SA409258",
    "SA409310",
    "SA409342",
    "SA409446",
    "SA409498",
    "SA409543",
    "SA409622",
    "SA409662",
    "SA409711",
    "SA409775",
    "SA410118",
    "SA410207",
    "SA410234",
    "SA410263",
    "SA410310",
    "SA410311",
    "SA410350",
    "SA410383",
    "SA410410",
    "SA410535",
    "SA410582",
    "SA410687",
    "SA410742",
    "SA410750",
    "SA410758",
    "SA410763",
    "SA410859",
    "SA410883",
    "SA410899",
    "SA410911",
    "SA411001",
    "SA411029",
    "SA411189",
    "SA411209",
    "SA411241",
    "SA411305",
    "SA411397",
    "SA411406",
    "SA411430",
    "SA411557",
    "SA411578",
    "SA411721",
    "SA411745",
    "SA411769",
    "SA411797",
    "SA411833",
    "SA411923",
    "SA412076",
    "SA412212",
    "SA412299",
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
    "SA507587",
    "SA518603",
    "SA518614",
    "SA518615",
    "SA518630",
    "SA518637",
    "SA518665",
    "SA518695",
    "SA518704",
    "SA518716",
    "SA518750",
    "SA518765",
    "SA518806",
    "SA518817",
    "SA528675",
    "SA528687",
    "SA528695",
    "SA528709",
    "SA528761",
    "SA528768",
]

// hardcoded for now
export const colorCode: {[key: string]: {[key: string]: string}}= {
    project: {
        "PACA-AU": "green",
        "RECA-EU": "blue"
    },
    specimen_type: {
        "Primary tumour - solid tissue": "red",
        "Primary tumour": "purple",
        "Normal - tissue adjacent to primary": "yellow",
    }
}

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
    subjectAnnoFields: string[] | undefined,
    subjectIds: string[] | undefined,
    subjects: { [key: string]: any } | undefined,
) {
    if (subjectAnnoFields === undefined || subjectIds === undefined || subjects === undefined) return;

    let annoData: any[] = [];
    for (const field of subjectAnnoFields) {
        console.log(field);
        if (field !== 'specimen_type' && field !== 'project') continue;
        let anno: { [key: string]: any } = {
            annotation: field
        };
        for (const subjectId of subjectIds) {
            anno[subjectId] = 5;
            anno[`${subjectId}_Value`] = `${subjectId}: ${subjects.get(subjectId)[field]}`;
            anno[`${subjectId}_Color`] = colorCode[field][subjects.get(subjectId)[field]];
        }
        annoData.push(anno);
    }
    console.log(annoData)
    return annoData
}
