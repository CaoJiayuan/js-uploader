/**
 *
 * @param {File} file
 * @constructor
 */
export default function UploadFile(file) {
    this.file = file;
}

UploadFile.KB = 1024;
UploadFile.MB = 1024 * 1024;

UploadFile.prototype.isImage = function () {
    return this.file.type.indexOf('image') >= 0;
};

UploadFile.prototype.isVideo = function () {
    return this.file.type.indexOf('video') >= 0;
};

UploadFile.prototype.getSize = function () {
    return this.file.size;
};

UploadFile.prototype.getExtension = function () {
    let partials = this.file.name.split('.');

    return partials[partials.length - 1];
};

UploadFile.prototype.notExceeding = function (size) {
    return this.getSize() <= size;
};

UploadFile.prototype.invalidFileMessage = '文件格式不正确';
