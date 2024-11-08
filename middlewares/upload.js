import multer from "multer";
import {multerSaveFilesOrg} from "multer-save-files-org";

export const dogListingUpload = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/barkbox/dog-listings/*',
    }),
    preservePath: true
});



