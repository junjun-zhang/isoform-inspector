import React from "react";
import { InputForm } from "./components/inputForm";
import HeatmapN from "./components/heatmapNivo";
import SubjectAnnotation from './components/subjectAnnotation';
import { observer } from "mobx-react-lite";
import { useStore } from "./models/IsoformInspector";
import { useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { Group } from '@visx/group';
import { GeneModel } from "./components/geneModel";


const IsoformInspector = observer(({model}: {model: any}) => {
    const width = model.configure.width;
    const heatmapHeight = model.configure.heatmapHeight;
    // const events = false;
    const margin = { top: 20, left: 20, right: 20, bottom: 20 };
    const separation = 5

    // const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
    //     useTooltip();

    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        scroll: true,
    });

    const tooltipStyles = {
        ...defaultStyles,
        minWidth: 60,
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: 'white',
    };

    console.log(model)
    return (
        <div>
            <h3>Transcript Isoform Inspector</h3>
            <InputForm model={model} />
            <div style={{ position: 'relative' }}>
                <svg ref={containerRef} width={width} height={heatmapHeight + model.featurePanelHeight}>
                    <Group top={0} left={margin.left}>
                        {/* subject annotation panel */}
                        <SubjectAnnotation model={model} width={model.subjAnnoWidth} height={heatmapHeight} />

                    </Group>
                    <Group top={0} left={margin.left + width * 0.1 + separation}>
                        {/* main heatmap panel */}
                        <HeatmapN model={model} width={model.heatmapWidth - margin.left - separation} height={heatmapHeight} />
                    </Group>
                    <Group top={heatmapHeight + 60} left={margin.left + width * 0.1 + separation}>
                        {/* gene / transcript panel */}
                        {model.dataState === 'loaded' && <text>Transcript Isoforms</text>}
                        <GeneModel model={model} width={model.heatmapWidth} height={model.featurePanelHeight} />
                    </Group>
                </svg>
                {(model.subjects?.currentSubjectId || model.features?.currentFeatureId) && (
                    <TooltipInPortal top={model.uiState.currentY} left={model.uiState.currentX} style={tooltipStyles}>
                        <div>CurrentPanel: {model.uiState.currentPanel}</div>
                        {
                            model.uiState.currentPanel !== 'feature' && model.features.currentFeatureId && model.subjects.currentSubjectId && (
                                <>
                                    <div>CurrentX: {model.uiState.currentX}</div>
                                    <div>CurrentY: {model.uiState.currentY}</div>
                                    <div>Sample: {model.subjects.currentSubjectId}</div>
                                    <div>Value: {model.observations.junction.subjects[model.subjects.currentSubjectId].features[model.features.currentFeatureId]}</div>
                                </>
                            )
                        }
                        <div>Feature: {model.features.currentFeatureId}</div>
                    </TooltipInPortal>
                )}
            </div>
        </div>
    );
});

const IsoformInspectorWrapper = observer(() => {
    const model: any = useStore();

    return (
        <>
            <IsoformInspector model={model} />
        </>
    );
});

export default IsoformInspectorWrapper
export { IsoformInspector, IsoformInspectorWrapper };
