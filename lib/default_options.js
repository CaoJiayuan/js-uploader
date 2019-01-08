import UploadFile from '../file'


const config = {
    progress : () => {
    },
    validate : uploadFile => true,
    chunk    : false,
    chunkSize: UploadFile.MB,
    name     : 'file',
    stsUrl   : '/api/sts/auth',
    url   : '/upload',
    ossStorageKey: 'oss_auth'
};

export function mergeConfig(input) {
    return Object.assign(config, input)
}


export default config
