declare interface UploadOptions {
    progress ?: (process) => void,
    validate ?: (uploadFile: UploadFile) => boolean,
    chunk ?: boolean,
    chunkSize ?: number,
    name ?: string,
    stsUrl ?: string,
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

declare const upload: (file: File, driver: string, options ?: UploadOptions) => void;

export {
    upload,
    UploadFile,
}
