import React from 'react'
import { observer } from "mobx-react-lite";
import { HeatMapCanvas } from '@nivo/heatmap';

export const SubjectAnnotation = ({ model }: { model: any }) => {
    if (model.dataState !== 'done') {
        return null
    }

    return (
        <HeatMapCanvas
            indexBy={model.subjectType}
            keys={model.featureIds}
            data={model.nivoData()}
            width={model.subjAnnoWidth()}
            height={model.height}
            colors={model.colors}
            enableLabels={false}
            hoverTarget='rowColumn'
            cellHoverOpacity={1}
            cellHoverOthersOpacity={0.5}
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
                <strong style={{ color: 'black' }}>
                    {xKey} / {yKey}: {value}
                </strong>)
            }}
        />
    )
};

export default observer(SubjectAnnotation);
