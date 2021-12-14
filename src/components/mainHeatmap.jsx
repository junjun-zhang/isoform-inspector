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

    const transcripts = {
        "ENST00000426820.6": {
            transcript_id: "ENST00000426820.6",
            number_of_exons: 5,
            total_exon_length: 1750,
            "exons": [
                {
                    exon_id: "ENSE00002224072.1",
                    chromosome: "chr1",
                    start: 113929192,
                    end: 113929532,
                    x: 0,
                    length: 341,
                },
                {
                    exon_id: "ENSE00002224072.2",
                    chromosome: "chr1",
                    start: 113940382,
                    end: 113941459,
                    x: 341,
                    length: 1078,
                },
                {
                    exon_id: "ENSE00002224072.3",
                    chromosome: "chr1",
                    start: 113952766,
                    end: 113952889,
                    x: 1419,
                    length: 124,
                },
                {
                    exon_id: "ENSE00002224072.4",
                    chromosome: "chr1",
                    start: 113954651,
                    end: 113954770,
                    x: 1543,
                    length: 120,
                },
                {
                    exon_id: "ENSE00002224072.5",
                    chromosome: "chr1",
                    start: 113955563,
                    end: 113955649,
                    x: 1663,
                    length: 87,
                }
            ]
        }
    }

    return width < 10 ? null : (
        <div style={{ position: 'relative' }}>
            <svg ref={containerRef} width={width} height={height}>
                <Group top={0} left={margin.left}>
                    <foreignObject x={0} y={40} width={model.subjAnnoWidth} height={height * 0.7}>
                        <SubjectAnnotation model={model} />
                    </foreignObject>
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

                </Group>
                <Group top={0} left={margin.left + width * 0.1 + separation}>
                    <text y={30} >Junction read counts</text>
                    <foreignObject x={0} y={40} width={model.heatmapWidth} height={height * 0.7}>
                        <HeatmapN model={model} />
                    </foreignObject>
                    {/* <rect x={0} y={0} width={width} height={height} fill={background} opacity={0}
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
                            model.subjects.setCurrentSubjectId('SA507135')
                            showTooltip({
                                tooltipData: {
                                    count: 9999,
                                    row: eventSvgCoords?.x,
                                    column: eventSvgCoords?.y
                                },
                                tooltipTop: eventSvgCoords?.y,
                                tooltipLeft: eventSvgCoords?.x,
                            });
                        }}
                    /> */}
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

                </Group>
                <Group top={height * 0.7 + 80} left={margin.left + width * 0.1 + separation}>
                    <text>Transcript Isoforms</text>
                    {
                        <rect key={`transcript-1`} width={width * 0.85} height={2} x={0} y={30} />
                    }
                    {
                        transcripts["ENST00000426820.6"].exons.map(
                            (exon) => <rect
                                key= {`exon-${exon.exon_id}`}
                                width={exon.length / 3}
                                height={20}
                                x={exon.x / 1.63}
                                y={20}
                                stroke="black"
                                fill="#dddddd"
                            />
                        )
                    }
                </Group>
            </svg>
            {tooltipOpen && tooltipData && (
                <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
                    <div>Sample: {model.subjects.subjectIds[tooltipData.row]}, {model.subjects.currentSubjectId}, x: {tooltipData.row}</div>
                    <div>Junction: {model.features.featureIds[tooltipData.column]}, y: {tooltipData.column}</div>
                    <div>Value: {tooltipData.count}</div>
                </TooltipInPortal>
            )}
        </div>
    );
};

export default observer(Heatmap);
