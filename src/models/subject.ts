import { types, Instance } from 'mobx-state-tree';


const Subject = () => {
    return types
        .model('Subject', {
            subjectType: types.maybe(types.string),
            subjectIds: types.array(types.string),
            currentSubjectId: types.maybe(types.string),
            subjectAnnoFields: types.maybe(types.array(types.string)),
            // object{key: subjectId, value: object{key: field, value: any}}
            subjects: types.maybe(types.frozen()),
            subjectOrderBy: types.maybe(types.string || types.array(types.string)),
        })
        .actions(self => ({
            setCurrentSubjectId(subjectId: string | undefined) {
                self.currentSubjectId = subjectId;
            },

        })
)
}

export default Subject
export type SubjectStateModel = ReturnType<typeof Subject>
export interface SubjectType extends Instance<SubjectStateModel> {}
