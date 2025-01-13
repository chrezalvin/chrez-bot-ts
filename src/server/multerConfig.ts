import multer from "multer";

export const upload = multer({
    dest: "uploads/",
    storage: multer.memoryStorage(),
    limits: {
        // maxsize is 2MB
        fileSize: 2 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (_, file, cb) => {
        const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

        for(const fileType of acceptedFileTypes)
            if(file.mimetype === fileType)
                return cb(null, true);

        return cb(new Error("Invalid file type"));
    }
});

export default upload;