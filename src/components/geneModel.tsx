import React from "react";
import { observer } from "mobx-react-lite";
import { localPoint } from '@visx/event';


export const GeneModel = ({ model, width, height }: { model: any, width: number, height: number }) => {
    if (model.dataState !== 'loaded') {
        return null
    }

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
                                width={(c.featureType === 'exon' ? c.renderLen : c.renderLen[k]) * t.pixelsPerBase * 0.95}
                                height={c.featureType === 'exon' ? model.configure.featureHeight * 0.7 : 3}
                                //@ts-ignore
                                x={(c.featureType === 'exon' ? c.offSet : c.offSet[k]) * t.pixelsPerBase * 0.95}
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
        </>
    );
};

export default observer(GeneModel)
