import UploadFile from './file'
import oss from './lib/drivers/oss'
import server from './lib/drivers/server'
import {mergeConfig} from './lib/default_options'
let drivers = {
    oss,
    server
}

function registerDriver(name, driver) {
    drivers[name] = driver
}

function upload(file, driver, options) {
    if (!drivers.hasOwnProperty(driver)) {
        return Promise.reject({
            message: `unregistered driver [${driver}]`
        })
    }

    let config = mergeConfig(options)
    const uploadFile = new UploadFile(file);
    let valid = config.validate(uploadFile);
    if (valid === true) {
        return drivers[driver].upload(uploadFile, config)
    } else  {
        return Promise.reject({
            code   : 422,
            message: typeof valid === 'string' ? valid : uploadFile.invalidFileMessage
        })
    }

}

export {
    upload,
    UploadFile,
    registerDriver
}
