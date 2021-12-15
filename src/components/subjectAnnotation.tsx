import React from 'react'
import { observer } from "mobx-react-lite";
import { Bar, BarCanvas } from '@nivo/bar';
import { Line } from '@visx/shape';
import { localPoint } from '@visx/event';


export const accentColorDark = '#75daad';


export const SubjectAnnotation = ({ model, width, height }: { model: any, width: number, height: number }) => {
    if (model.dataState !== 'loaded') {
        return null
    }

    return (
        <>
        <foreignObject x={0} y={0} width={width} height={height}>
            <BarCanvas
                // indexBy={model.configure.subject.subjectType}
                indexBy='annotation'
                keys={model.subjects.subjectIds.slice().reverse()}
                data={model.subjAnnoData}
                colors={({ id, data }) => String(data[`${id}_Color`])}
                enableLabel={false}
                enableGridX={false}
                enableGridY={false}
                width={width}
                height={height}
                margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
                tooltip={({ id, data }) => (
                    <h6 style={{ background: 'white' }}>{data[`${id}_Value`]}</h6>
                )}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
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
                model.setCurrentPanel('subjectAnnotation');
                model.setCurrentX(eventSvgCoords?.x)
                model.setCurrentY(eventSvgCoords?.y)
                model.subjects.setCurrentSubjectId('SA000000');
                model.features.setCurrentFeatureId(undefined);
            }}
        />
        {
            model.uiState?.currentY && model.uiState.currentY <= height && (
                <g>
                    <Line
                        from={{ x: 0, y: model.uiState.currentY }}
                        to={{ x: width, y: model.uiState.currentY  }}
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

export default observer(SubjectAnnotation);
