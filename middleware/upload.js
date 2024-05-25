import path from 'node:path';
import multer from 'multer';
import crypto from 'node:crypto';

const storage = multer.diskStorage({
    destination(req, file, cd) {
        console.log(req.body);
        cd(null, path.resolve('tmp'));
    },
    filename(req, file, cd) {
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        const suffix = crypto.randomUUID();

        cd(null, `${basename}-${suffix}${extname}`);
    },
});

export default multer({ storage });
