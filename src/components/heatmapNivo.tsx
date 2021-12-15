import React from "react";
import { observer } from "mobx-react-lite";
import { HeatMapCanvas, HeatMap } from '@nivo/heatmap';
import { localPoint } from '@visx/event';
import { Line } from '@visx/shape';

export const accentColorDark = '#75daad';

function featureIdToX(featureIdIdx: number | undefined): number | undefined {
    if (featureIdIdx !== undefined && featureIdIdx >= 0) {
        return featureIdIdx * 20 + 12
    }
    return undefined
}


export const HeatmapN = ({ model, width, height }: { model: any, width: number, height: number }) => {
    if (model.dataState !== 'loaded') {
        return null
    }

    return (
        <>
            <foreignObject x={0} y={0} width={width} height={height}>
                <HeatMapCanvas
                    indexBy={model.configure.subject.subjectType}
                    keys={model.features.featureIds}
                    data={model.nivoData}
                    width={width}
                    height={height}
                    colors='reds'
                    enableLabels={false}
                    hoverTarget='rowColumn'
                    cellHoverOpacity={1}
                    cellHoverOthersOpacity={0.25}
                    margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={null}
                    cellOpacity={1}
                    cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
                    tooltip={({ xKey, yKey, value }) => {
                        return (
                            <div style={{ color: 'black' }}>
                                {xKey} / {yKey}: {value}
                            </div>)
                    }}
                />
            </foreignObject>
            <rect x={0} y={0} width={width} height={height} opacity={0}
                onMouseLeave={() => {
                    model.setCurrentPanel(undefined);
                    model.setCurrentX(undefined)
                    model.setCurrentY(undefined)
                    model.subjects.setCurrentSubjectId(undefined);
                    model.features.setCurrentFeatureId(undefined);
                }}
                onMouseMove={(event) => {
                    const eventSvgCoords = localPoint(event);
                    model.setCurrentPanel('heatmap');
                    model.setCurrentX(eventSvgCoords?.x)
                    model.setCurrentY(eventSvgCoords?.y)
                    model.subjects.setCurrentSubjectId('SA000099');
                    if (model.uiState.currentX) {
                        const featureIdIdx = Math.floor((model.uiState.currentX - 146) / 20.1);
                        console.log(model.features.featureIds.length);
                        console.log(featureIdIdx);
                        if (featureIdIdx < model.features.featureIds.length) {
                            console.log(model.features.featureIds[featureIdIdx])
                            model.features.setCurrentFeatureId(model.features.featureIds[featureIdIdx]);
                        } else {
                            model.features.setCurrentFeatureId(undefined);
                        }
                    } else {
                        model.features.setCurrentFeatureId(undefined);
                    }
                }}
            />
            {
                model.uiState.currentY && model.uiState.currentY <= height && (
                    <g>
                        <Line
                            from={{ x: 0, y: model.uiState.currentY }}
                            to={{ x: width, y: model.uiState.currentY }}
                            stroke={accentColorDark}
                            strokeWidth={2}
                            pointerEvents="none"
                            strokeDasharray="5,2"
                        />
                    </g>
                )
            }
            {
                model.features?.currentFeatureId && (
                    <g>
                        <Line
                            from={{ x: featureIdToX(model.features.featureIds.indexOf(model.features.currentFeatureId)), y: 0 }}
                            to={{ x: featureIdToX(model.features.featureIds.indexOf(model.features.currentFeatureId)), y: height }}
                            stroke={accentColorDark}
                            strokeWidth={2}
                            pointerEvents="none"
                            strokeDasharray="5,2"
                        />
                    </g>
                )
            }
        </>
    )
};

export default observer(HeatmapN);
