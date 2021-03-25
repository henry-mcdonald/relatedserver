const ImageSchema = require('../model/fileUpload')

module.exports.UploadImage = async (req, res) => {
    const imageUploaded = new ImageSchema({
        image: req.file.path
    })

    try {
        await imageUploaded.save()
    } catch (error) {
        console.log(error);
    }
}