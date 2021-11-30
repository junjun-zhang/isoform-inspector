import { types, Instance } from 'mobx-state-tree';


const Subject = () => {
    return types
    .model('Subject', {
        subjectId: types.string,
        subjectType: types.maybe(types.string),
    })
}

export default Subject
export type SubjectStateModel = ReturnType<typeof Subject>
export interface SubjectModel extends Instance<SubjectStateModel> {}
