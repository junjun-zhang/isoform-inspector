import React from "react";
import { InputForm } from "./components/inputForm";
import Heatmap from "./components/heatmap";
import HeatmapV from './components/heatmapVisx'
import { observer } from "mobx-react-lite";
import { useStore } from "./models/IsoformInspector"


const IsoformInspector = observer(({model}: {model: any}) => {
    return (
        <div>
            <h3>Transcript Isoform Inspector</h3>
            <InputForm model={model} />
            <Heatmap model={model} />
            <HeatmapV model={model} />
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
