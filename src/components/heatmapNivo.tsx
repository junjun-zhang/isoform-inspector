import React from "react";
import { observer } from "mobx-react-lite";
import { HeatMapCanvas, HeatMap } from '@nivo/heatmap';  // HeatMap is SVG based, may be switched to use when user downloads the chart
import { localPoint } from '@visx/event';
import { Line } from '@visx/shape';

export const accentColorDark = '#75daad';


export const HeatmapN = ({ model, width, height }: { model: any, width: number, height: number }) => {
    if (model.dataState !== 'loaded') {
        return null
    }

    const pixelsPerFeature = width / model.heatmapFeatureIds.length;
    const pixelsPerSubject = height / model.subjects.subjectIds.length;

    function featureIdToX(featureIdIdx: number | undefined): number | undefined {
        if (featureIdIdx !== undefined && featureIdIdx >= 0) {
            return (featureIdIdx + 0.5) * pixelsPerFeature;
        }
        return undefined;
    }

    return (
        <>
            <foreignObject x={0} y={0} width={width} height={height}>
                <HeatMapCanvas
                    indexBy={model.configure.subject.subjectType}
                    keys={model.heatmapFeatureIds}
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
                    if (model.uiState.currentY) {
                        const subjectIdIdx = Math.floor((model.uiState.currentY - 2) / pixelsPerSubject);
                        if (subjectIdIdx < model.subjects.subjectIds.length) {
                            model.subjects.setCurrentSubjectId(model.subjects.subjectIds[subjectIdIdx]);
                        } else {
                            model.subjects.setCurrentSubjectId(undefined);
                        }
                    } else {
                        model.subjects.setCurrentSubjectId(undefined);
                    }

                    if (model.uiState.currentX) {
                        const featureIdIdx = Math.floor((model.uiState.currentX - 146) / pixelsPerFeature);
                        if (featureIdIdx < model.heatmapFeatureIds.length) {
                            model.features.setCurrentFeatureId(model.heatmapFeatureIds[featureIdIdx]);
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
                model.features?.currentFeatureId && model.heatmapFeatureIds.includes(model.features.currentFeatureId) && (
                    <g>
                        <Line
                            from={{ x: featureIdToX(model.heatmapFeatureIds.indexOf(model.features.currentFeatureId)), y: 0 }}
                            to={{ x: featureIdToX(model.heatmapFeatureIds.indexOf(model.features.currentFeatureId)), y: height }}
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
