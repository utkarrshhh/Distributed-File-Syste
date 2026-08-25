import { Router } from "express";

import { createUploadUrlController,completeUploadController ,getUserFilesController} from "../controller/files.controller.ts";
import { authenticate } from "../../../middleware/auth.middleware.ts";


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
)
export default router;