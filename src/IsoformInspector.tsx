import React from "react";
import { InputForm } from "./components/inputForm";
import HeatmapN from "./components/heatmapNivo";
import HeatmapV from './components/heatmapVisx';
import Heatmap from './components/mainHeatmap';
import SubjectAnnotation from './components/subjectAnnotation';
import { observer } from "mobx-react-lite";
import { useStore } from "./models/IsoformInspector";
import { Grid } from '@material-ui/core';


const IsoformInspector = observer(({model}: {model: any}) => {

    return (
        <div>
            <h3>Transcript Isoform Inspector</h3>
            {/* <InputForm model={model} />
            <Heatmap model={model} />
            <HeatmapV model={model} /> */}

            <Grid container spacing={0} alignItems="flex-start">
                <Grid item xs={12}>
                    <InputForm model={model} />
                    { !model.configure.geneId && <p>Please choose a gene!</p> }
                </Grid>
                <Grid item xs={12}>
                    <HeatmapV model={model} />
                </Grid>
                <Grid item xs={12}>
                    <Heatmap model={model} />
                </Grid>
                <Grid item xs={3}>
                    <SubjectAnnotation model={model} />
                </Grid>
                <Grid item xs={9}>
                    <HeatmapN model={model} />
                </Grid>
            </Grid>
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
