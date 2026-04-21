export declare const linkedShape: {
    <T extends typeof import("@_linked/core/shapes/Shape").Shape>(constructor: T): void;
    <T_1 extends typeof import("@_linked/core/shapes/Shape").Shape>(config?: import("@_linked/core/utils/Package").ShapeConfig): (constructor: T_1) => void;
}, linkedUtil: (constructor: any) => any, linkedOntology: (allFileExports: any, nameSpace: (term: string) => import("@_linked/core/utils/NodeReference").NodeReferenceValue, suggestedPrefixAndFileName: string, loadDataFunction?: () => Promise<any>, dataSource?: string | string[]) => void, registerPackageExport: (exportedObject: any) => void, packageExports: any, packageName: string;
