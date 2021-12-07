import React from 'react';
import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { SubjectAnnotation } from './subjectAnnotation';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { observer } from "mobx-react-lite";
import { localPoint } from '@visx/event';
import { HeatmapN } from './heatmapNivo';


export const background = '#ffffff'; // '#28272c';
export const accentColorDark = '#75daad';

const Heatmap = ({model}) => {
    const width = model.configure.width;
    const height = model.configure.height;
    // const events = false;
    const margin = { top: 20, left: 20, right: 20, bottom: 20 };
    const separation = 5

    const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
        useTooltip();

    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        // TooltipInPortal is rendered in a separate child of <body /> and positioned
        // with page coordinates which should be updated on scroll. consider using
        // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
        scroll: true,
    });

    if (model.dataState !== 'loaded') {
        return null
    }

    const binData = model.visxData;

    if (binData.length === 0) return null;

    function max(data, value) {
        return Math.max(...data.map(value));
    }

    // accessors
    const bins = (d) => d.bins;

    const bucketSizeMax = max(binData, (d) => bins(d).length);

    // scales
    const xScale = scaleLinear({
        domain: [0, binData.length],
    });
    const yScale = scaleLinear({
        domain: [0, bucketSizeMax],
    });

    const tooltipStyles = {
        ...defaultStyles,
        minWidth: 60,
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: 'white',
    };
    let tooltipTimeout;


    // bounds
    const size =
        width > margin.left + margin.right ? width - margin.left - margin.right : width;
    const xMax = size;
    const yMax = height - margin.bottom - margin.top;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    xScale.range([0, xMax]);
    yScale.range([0, yMax]);

    return width < 10 ? null : (
        <div style={{ position: 'relative' }}>
            <svg ref={containerRef} width={width} height={height}>
                <Group top={0} left={margin.left}>
                    <foreignObject x={0} y={0} width={model.subjAnnoWidth} height={height}>
                        <SubjectAnnotation model={model} />
                    </foreignObject>
                </Group>
                <Group top={0} left={margin.left + width * 0.2 + separation}>
                    <foreignObject x={0} y={0} width={model.heatmapWidth} height={height}>
                        <HeatmapN model={model} />
                    </foreignObject>
                </Group>
                {tooltipData && (
                    <g>
                        <Line
                            from={{ x: tooltipLeft, y: margin.top }}
                            to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                            stroke={accentColorDark}
                            strokeWidth={2}
                            pointerEvents="none"
                            strokeDasharray="5,2"
                        />
                        <Line
                            from={{ x: margin.left, y: tooltipTop }}
                            to={{ x: innerWidth + separation + margin.left, y: tooltipTop }}
                            stroke={accentColorDark}
                            strokeWidth={2}
                            pointerEvents="none"
                            strokeDasharray="5,2"
                        />
                    </g>
                )}
                <rect x={0} y={0} width={width} height={height} fill={background} opacity={0}
                    onMouseLeave={() => {
                        tooltipTimeout = window.setTimeout(() => {
                            hideTooltip();
                        }, 300);
                    }}
                    onMouseMove={(event) => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        // TooltipInPortal expects coordinates to be relative to containerRef
                        // localPoint returns coordinates relative to the nearest SVG, which
                        // is what containerRef is set to in this example.
                        const eventSvgCoords = localPoint(event);
                        showTooltip({
                            tooltipData: { count: 9999, row: eventSvgCoords?.x, column: eventSvgCoords?.y },
                            tooltipTop: eventSvgCoords?.y,
                            tooltipLeft: eventSvgCoords?.x,
                        });
                    }}
                />
            </svg>
            {tooltipOpen && tooltipData && (
                <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                    <div>Sample: {model.subjects.subjectIds[tooltipData.row]}, x: {tooltipData.row}</div>
                    <div>Junction: {model.features.featureIds[tooltipData.column]}, y: {tooltipData.column}</div>
                    <div>Value: {tooltipData.count}</div>
                </TooltipInPortal>
            )}
        </div>
    );
};

export default observer(Heatmap);
