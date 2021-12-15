import React from "react";
import { observer } from "mobx-react-lite";


export const InputForm = ({ model }: { model: any}) => {
    const [geneId, setGeneId] = React.useState("");
    const [orderBy, setOrderBy] = React.useState(model.configure.subject.subjectOrderBy ?? "clustering");

    return (
        <div>
            Gene: <select name="geneId" onChange={async (e) => {
                setGeneId(e.target.value);
            }}>
                <option value=""></option>
                <option value="ENSG00000068878.10">ENSG00000068878.10</option>
                <option value="ENSG00000011114.10">ENSG00000011114.10</option>
                <option value="ENSG00000163349.17">ENSG00000163349.17</option>
                <option value="ENSG00000129007.10">ENSG00000129007.10</option>
                <option value="ENSG00000161800.8">ENSG00000161800.8</option>
            </select>&nbsp;&nbsp;
            Order by: <select name="orderBy" onChange={(e) => setOrderBy(e.target.value)}>
                <option value="clustering">Clustering</option>
                <option value="project">Project</option>
                <option value="specimen_type">Specimen type</option>
            </select>&nbsp;&nbsp;
            <button onClick={() => {
                if (geneId !== model.geneId) {
                    model.setGeneId(geneId);
                }
                if (orderBy !== model.configure.subject.subjectOrderBy) {
                    model.configure.setSubjectOrderBy(orderBy);
                }
            }}>OK</button>
        </div>
    );
};

export default observer(InputForm)
