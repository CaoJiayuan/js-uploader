import UploadFile from './file'
import oss from './drivers/oss'
import server from './drivers/server'
let drivers = {
    oss,
    server
}

function registerDriver(name, driver) {
    drivers[name] = driver
}

function upload(file, driver, options) {
    return drivers[driver].upload(new UploadFile(file), options)
}

export {
    upload,
    UploadFile
}
