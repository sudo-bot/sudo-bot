export interface TemplateFunction {
    (modifiedFiles: string[]): string;
}
export default interface TemplateInterface {
    commitMessage: TemplateFunction;
    prMessage: TemplateFunction;
    prContent: TemplateFunction;
    prBranch: TemplateFunction;
}
