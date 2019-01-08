import {BrowserStorage, functions} from 'nerio-js-utils'
let bs = new BrowserStorage();
let {md5} = functions;

function getOssClient(stsUrl, storageKey) {
    let credentials = bs.get(storageKey);

    if (credentials && credentials.expire_at * 1000 > new Date().getTime()) {
        let client = new OSS(credentials);
        client.prefix = credentials.prefix;
        return Promise.resolve(client)
    } else {
        return axios.get(stsUrl).then(re => {
            credentials = re.data;
            bs.put(storageKey, credentials);
            let client = new OSS(credentials);
            client.prefix = credentials.prefix;
            return client;
        })
    }
};

export default {

    /**
     *
     * @param {UploadFile} uploadFile
     * @param options
     */
    upload(uploadFile, options = {}) {
        let progress = options.progress;
        let file = uploadFile.file;
        let fixedProgress = p => {
            progress(Math.round(p * 100));
            return done => {
                done();
            }
        };
        return getOssClient(options.stsUrl, options.ossStorageKey).then(client => {
            let fileId = md5(file.name + new Date().getTime());
            let prefix = client.prefix ? client.prefix + '/' : '';
            let filename = fileId + '.' + uploadFile.getExtension();
            return client.multipartUpload(prefix + filename, file, {
                progress: fixedProgress
            }).then(result => {
                return Promise.resolve({
                    filename: file.name,
                    type    : file.type,
                    url     : result.res.requestUrls[0].replace('http://', 'https://')
                })
            })
        });
    }
}
