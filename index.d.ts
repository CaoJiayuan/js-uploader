declare interface UploadOptions {
    progress ?: (process) => void,
    validate?: (uploadFile: UploadFileInstance) => boolean,
    chunk ?: boolean,
    chunkSize ?: number,
    name ?: string,
    stsUrl ?: string,
    url ?: string,
    ossStorageKey ?: string
}
declare interface FileResponse {
    filename ?: string,
    type ?: string,
    url ?: string
}

declare interface UploadFileInstance {
    isImage: () => boolean,
    isVideo: () => boolean,
    getSize: () => number,
    getExtension: () => string,
    notExceeding: (size: number) => boolean,
    invalidFileMessage: string,
}

declare interface Driver {
    upload(uploadFile: UploadFileInstance, options?: UploadOptions): FilePromise
}

declare interface FilePromise extends Promise<FileResponse> {

}


declare const upload: (file: File, driver: string, options?: UploadOptions) => FilePromise;
declare const registerDriver: (name: string, driver : Driver) => void;

declare const UploadFile: {
    new(file: File): UploadFileInstance
    KB: Number;
    MB: Number;
}

export {
    upload,
    registerDriver,
    UploadFile
}
