import React from 'react'
import { observer } from "mobx-react-lite";
import { Bar, BarCanvas } from '@nivo/bar';

export const SubjectAnnotation = ({ model }: { model: any }) => {
    if (model.dataState !== 'loaded') {
        return null
    }

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
            height={model.configure.height}
            margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
            tooltip={({ id, data }) => (
                <h6 style={{ background: 'white' }}>{data[`${id}_Value`]}</h6>
            )}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
        />
    )
};

export default observer(SubjectAnnotation);
