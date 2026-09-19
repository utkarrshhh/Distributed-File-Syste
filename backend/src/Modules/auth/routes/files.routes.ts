import { Router } from "express";

import { createUploadUrlController,completeUploadController ,getUserFilesController,downloadFileController} from "../controller/files.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";
import { deleteFileController } from "../controller/files.controller.js";


const router = Router();

router.post(
  "/upload-url",
  authenticate,
  createUploadUrlController
  );

router.post(
    "/complete",
    authenticate,
    completeUploadController
  );

router.get(
    "/",
    authenticate,
    getUserFilesController
  );
  
router.get(
    "/:fileId/download",
    authenticate,
    downloadFileController
  );

router.delete(
    "/:fileId",
    authenticate,
    deleteFileController
  );


export default router;