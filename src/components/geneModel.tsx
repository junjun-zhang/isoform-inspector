import React from "react";
import { observer } from "mobx-react-lite";
import { localPoint } from '@visx/event';


export const GeneModel = ({ model, width, height }: { model: any, width: number, height: number }) => {
    if (model.dataState !== 'loaded') {
        return null
    }

    console.log(model.transcripts);
    return (
        <>
            {
                Object.entries(model.transcripts).map(
                    //@ts-ignore
                    ([k, t], i) => t.exonAndJunctions.map(
                        (c: any, j: number) => (
                            <rect
                                key={c.featureId}
                                //@ts-ignore
                                width={c.renderLen * t.pixelsPerBase * 0.95}
                                height={c.featureType === 'exon' ? model.configure.featureHeight * 0.7 : 3}
                                //@ts-ignore
                                x={c.offSet * t.pixelsPerBase * 0.95}
                                y={i * model.configure.featureHeight + 20 + (c.featureType === 'junction' ? 6 : 0)}
                                stroke={model.features.currentFeatureId === `${c.featureId}` ? "red" : "black"}
                                fill={model.features.currentFeatureId === `${c.featureId}` ? "red" : "#ddd"}
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
                                    model.features.setCurrentFeatureId(`${c.featureId}`);
                                }}
                            />
                        )
                    )
                )
            }
            {/* {
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
            } */}
        </>
    );
};

export default observer(GeneModel)
