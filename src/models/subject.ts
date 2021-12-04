import { types, Instance } from 'mobx-state-tree';


const Subject = () => {
    return types
        .model('Subject', {
            subjectId: types.identifier,
            subjectType: types.maybe(types.string),
            annotations: types.maybe(types.frozen())
        })
}

export default Subject
export type SubjectStateModel = ReturnType<typeof Subject>
export interface SubjectModel extends Instance<SubjectStateModel> {}
