import React from 'react'
import { observer } from "mobx-react-lite";
import { Bar, BarCanvas } from '@nivo/bar';
import { Line } from '@visx/shape';


export const accentColorDark = '#75daad';

export const SubjectAnnotation = observer(({ model }: { model: any }) => {
    if (model.dataState !== 'loaded') {
        return null
    }
    console.log(model.subjects.subjectIds.toJSON())
    return (
        <BarCanvas
            // indexBy={model.configure.subject.subjectType}
            indexBy='annotation'
            keys={model.subjects.subjectIds.slice().reverse()}
            data={model.subjAnnoData}
            colors={({ id, data }) => String(data[`${id}_Color`])}
            enableLabel={false}
            enableGridX={false}
            enableGridY={false}
            width={model.subjAnnoWidth}
            height={model.configure.height * 0.7}
            margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
            tooltip={({ id, data }) => (
                <h6 style={{ background: 'white' }}>{data[`${id}_Value`]}</h6>
            )}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
        />
    )
});

// export default observer(SubjectAnnotation);

export const SubjectAnnotationNew = ({ model, width, height }: { model: any, width: number, height: number }) => {
    if (model.dataState !== 'loaded') {
        return null
    }
    console.log(model.subjects.subjectIds.toJSON())

    return (
        <>
        <foreignObject x={0} y={40} width={width} height={height}>
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
        {
            model.subjects.currentSubjectId && (
                <g>
                    <Line
                        from={{ x: 0, y: model.subjects.currentSubjectId }}
                        to={{ x: width, y: model.subjects.currentSubjectId  }}
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

export default observer(SubjectAnnotationNew);
