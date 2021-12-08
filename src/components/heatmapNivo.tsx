import React from "react";
import { observer } from "mobx-react-lite";
import { HeatMapCanvas } from '@nivo/heatmap';


export const HeatmapN = ({ model }: { model: any }) => {
    if (model.dataState !== 'loaded') {
        return null
    }
    console.log(model.nivoData)
    return (
        <HeatMapCanvas
            indexBy={model.configure.subject.subjectType}
            keys={model.features.featureIds}
            data={model.nivoData}
            width={model.heatmapWidth}
            height={model.configure.height}
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

export default observer(HeatmapN);
