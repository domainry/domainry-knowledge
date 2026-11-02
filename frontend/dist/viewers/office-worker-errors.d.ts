export declare const officeWorkerErrors: {
    readonly archiveUnsafe: "knowledge.auto.30654fbcef2bfa6d";
    readonly archiveExpandedTooLarge: "knowledge.auto.0b9cdfc01f22c494";
    readonly archiveInvalid: "knowledge.auto.552c7361d3d8c8cd";
    readonly formulaResultMissing: "knowledge.auto.42913db3d3b5eff0";
    readonly cellTooLong: "knowledge.auto.fedae91efd350957";
    readonly worksheetsTooMany: "knowledge.auto.ee6efc1447299260";
    readonly worksheetTooLarge: "knowledge.auto.55c85d93fc5e34ac";
    readonly cellsTooMany: "knowledge.auto.5bee4cdb427cff1d";
    readonly cellAddressInvalid: "knowledge.auto.709a2e4b711558dc";
    readonly presentationCountInvalid: "knowledge.auto.6a2a8bf8083cdf60";
    readonly presentationTooLarge: "knowledge.auto.989c40af9fa37547";
    readonly unknown: "knowledge.auto.9412956e890013f9";
};
export type OfficeWorkerErrorCode = typeof officeWorkerErrors[keyof typeof officeWorkerErrors];
export declare function isOfficeWorkerErrorCode(value: unknown): value is OfficeWorkerErrorCode;
