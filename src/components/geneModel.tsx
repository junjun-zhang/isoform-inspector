import React from "react";
import { observer } from "mobx-react-lite";
import { localPoint } from '@visx/event';

const transcripts = {
    "ENST00000426820.6": {
        transcript_id: "ENST00000426820.6",
        number_of_exons: 5,
        total_exon_length: 1750,
        "exons": [
            {
                exon_id: "ENSE00002224072.1",
                chromosome: "2",
                start: 54092711,
                end: 54093221,
                x: 0,
                length: 341,
            },
            {
                exon_id: "ENSE00002224072.2",
                chromosome: "2",
                start: 54093361,
                end: 54093883,
                x: 341,
                length: 1078,
            },
            {
                exon_id: "ENSE00002224072.3",
                chromosome: "2",
                start: 54094018,
                end: 54096512,
                x: 1419,
                length: 124,
            },
            {
                exon_id: "ENSE00002224072.4",
                chromosome: "2",
                start: 54094018,
                end: 54101475,
                x: 1543,
                length: 120,
            },
            {
                exon_id: "ENSE00002224072.5",
                chromosome: "2",
                start: 54096676,
                end: 54101475,
                x: 1663,
                length: 102,
            }
        ]
    }
}

export const GeneModel = ({ model, width, height }: { model: any, width: number, height: number }) => {
    if (model.dataState !== 'loaded') {
        return null
    }

    return (
        <>
            <text>Transcript Isoforms</text>
            {
                <rect key={`transcript-1`} width={width} height={2} x={0} y={30} />
            }
            {
                transcripts["ENST00000426820.6"].exons.map(
                    (exon) => <rect
                        key={`${exon.chromosome}:${exon.start}-${exon.end}`}
                        width={exon.length / 3}
                        height={20}
                        x={exon.x / 1.63}
                        y={20}
                        stroke={model.features.currentFeatureId === `${exon.chromosome}:${exon.start}-${exon.end}` ? "red" : "black"}
                        fill={model.features.currentFeatureId === `${exon.chromosome}:${exon.start}-${exon.end}` ? "red" : "#ddd"}
                        onMouseLeave={() => {
                            model.setCurrentPanel(undefined);
                            model.setCurrentX(undefined)
                            model.setCurrentY(undefined)
                            model.subjects.setCurrentSubjectId(undefined);
                            model.features.setCurrentFeatureId(undefined);
                        }}
                        onMouseMove={(event) => {
                            const eventSvgCoords = localPoint(event);
                            model.setCurrentPanel('feature');
                            model.setCurrentX(eventSvgCoords?.x)
                            model.setCurrentY(eventSvgCoords?.y)
                            model.subjects.setCurrentSubjectId(undefined);
                            model.features.setCurrentFeatureId(`${exon.chromosome}:${exon.start}-${exon.end}`);
                        }}
                    />
                )
            }
        </>
    );
};

export default observer(GeneModel)
