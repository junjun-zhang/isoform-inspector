import React from 'react'
import { observer } from "mobx-react-lite";
import { Bar } from '@nivo/bar';

export const SubjectAnnotation = ({ model }: { model: any }) => {
    if (model.dataState !== 'done') {
        return null
    }

    return (
        <Bar
            indexBy={model.subjectType}
            keys={model.subjectAnnoFields}
            data={model.subjAnnoData('nivo')}
            layout='horizontal'
            enableLabel={false}
            width={model.subjAnnoWidth()}
            height={model.height}
            margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={null}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
        />
    )
};

export default observer(SubjectAnnotation);
