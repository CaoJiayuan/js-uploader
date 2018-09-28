import UploadFile from '../file'


const config = {
    progress : () => {
    },
    validate : uploadFile => true,
    chunk    : false,
    success  : data => {
    },
    error    : data => {

    },
    chunkSize: UploadFile.MB,
    name     : 'file',
    stsUrl   : '/api/sts/auth',
    url   : '/upload',
};

export function mergeConfig(input) {
    return Object.assign(config, input)
}


export default config
