declare interface UploadOptions {
    progress ?: (process) => void,
    validate ?: (uploadFile: UploadFile) => boolean,
    chunk ?: boolean,
    chunkSize ?: number,
    name ?: string,
    stsUrl ?: string,
    url ?: string
}
declare interface FileResponse {
    filename ?: string,
    type ?: string,
    url ?: string
}

declare interface UploadFile {
    isImage: () => boolean,
    isVideo: () => boolean,
    getSize: () => number,
    getExtension: () => string,
    notExceeding: (size: number) => boolean,
    invalidFileMessage: string,
}

declare interface Driver {
    upload(uploadFile: UploadFile, options?: UploadOptions): FilePromise
}

declare interface FilePromise extends Promise<FileResponse> {

}


declare const upload: (file: File, driver: string, options?: UploadOptions) => FilePromise;
declare const registerDriver: (name: string, driver : Driver) => void;

export {
    upload,
    UploadFile,
    registerDriver
}
