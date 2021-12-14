import React from "react";
import { observer } from "mobx-react-lite";
import { HeatMapCanvas, HeatMap } from '@nivo/heatmap';
import { localPoint } from '@visx/event';
import { Line } from '@visx/shape';

export const accentColorDark = '#75daad';

export const HeatmapN = ({ model }: { model: any }) => {
    if (model.dataState !== 'loaded') {
        return null
    }

    return (
        <HeatMapCanvas
            indexBy={model.configure.subject.subjectType}
            keys={model.features.featureIds}
            data={model.nivoData}
            width={model.heatmapWidth}
            height={model.configure.height * 0.7}
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
    )
};

// export default observer(HeatmapN);

export const HeatmapNew = ({ model, width, height }: { model: any, width: number, height: number }) => {
    if (model.dataState !== 'loaded') {
        return null
    }

    return (
        <>
            <foreignObject x={0} y={40} width={width} height={height}>
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
            <rect x={0} y={40} width={width} height={height} opacity={0}
                onMouseLeave={() => {
                    model.subjects.setCurrentSubjectId(undefined);
                    model.features.setCurrentFeatureId(undefined);
                }}
                onMouseMove={(event) => {
                    const eventSvgCoords = localPoint(event);
                    model.subjects.setCurrentSubjectId(`${eventSvgCoords?.y}`);
                }}
            />
            {
                model.subjects.currentSubjectId && (
                    <g>
                        <Line
                            from={{ x: 0, y: model.subjects.currentSubjectId }}
                            to={{ x: width, y: model.subjects.currentSubjectId }}
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

export default observer(HeatmapNew);
