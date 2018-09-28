import {mergeConfig} from './default_options'
let chunkError

const CancelToken = axios.CancelToken;

function singleUpload(url, name, file, progress) {
    let fd = new FormData();
    fd.append(name, file);
    const onUploadProgress = progressEvent => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progress(percentCompleted, progressEvent)
    };
    let config = {
        onUploadProgress: onUploadProgress,
        headers         : {
            'X-Uploaded-With': 'FileUploader'
        },
        showLoading     : false
    };
    return axios.post(url, fd, config).then(response => {
        return Promise.resolve(response.data)
    })
}

function chunkUpload(url, name, file, progress, chunkSize) {
    chunkError = false
    let total = file.size;
    chunkSize = chunkSize > total ? total : chunkSize;
    let chunks = [], start = 0;
    let fileId = md5(file.name + new Date().getTime());
    let index = 1;
    while (total > 0) {
        if (total < chunkSize) {
            chunkSize = total;
        }
        total -= chunkSize;
        let end = start + chunkSize;
        let blob = file.slice(start, end);
        chunks.push({
            blob      : blob,
            start     : start,
            end       : end,
            total     : file.size,
            filename  : file.name,
            mime_type : file.type,
            file_id   : fileId,
            index     : index,
            chunk_size: chunkSize
        });
        index++;
        start = end;
    }
    let count = chunks.length;
    let i = 0;
    let succeeded = false;
    let cancels = [];
    return new Promise((resolve, reject) => {
        chunks.forEach(chunk => {
            if (chunkError) {
                reject(chunkError)
            } else  {
                uploadChunk(name, url, chunk, count, {
                    cancelToken: new CancelToken(c => cancels.push(c))
                }).then(response => {
                    let data = response.data
                    i++;
                    progress(Math.round((i * 100) / count));
                    if (response.status === 200) {
                        if (!succeeded) {
                            resolve(data);
                            succeeded = true;
                        }
                    }
                }).catch(error => {
                    chunkError || reject(error)
                    chunkError = error
                    cancels.forEach(c => c())
                });
            }
        })
    })
}

function uploadChunk(name, url, {blob, start, end, total, chunk_size, filename, file_id, index, mime_type}, count, config = {}) {

    let fd = new FormData();
    fd.append(name, blob);
    fd.append('chunk_start', start);
    fd.append('filename', filename);
    fd.append('chunk_end', end);
    fd.append('total_length', total);
    fd.append('chunk_size', chunk_size);
    fd.append('mime_type', mime_type);
    fd.append('file_id', file_id);
    fd.append('chunks', count);
    fd.append('chunk_index', index);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            axios.post(url, fd, Object.assign(config, {
                headers    : {
                    'X-Uploaded-With': 'ChunkUpload'
                },
                showLoading: false
            })).then(resolve).catch(reject)
        }, index * 2)
    })
}

export default {
    /**
     *
     * @param {UploadFile} uploadFile
     * @param options
     */
    upload(uploadFile, options = {}) {
        let config = mergeConfig(options)
        let file = uploadFile.file
        if (config.chunk && file.size > config.chunkSize) {
            return chunkUpload(config.url, config.name, file, config.progress, config.chunkSize)
        }
        return singleUpload(config.url, config.name, file, config.progress)
    }
}
