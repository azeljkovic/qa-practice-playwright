import { test } from "@playwright/test";
import path from "node:path";
import { FileUploadPage } from "./page-objects/file-upload-page";

test("regular file upload", async ({ page }) => {
  const fileUploadPage = new FileUploadPage(page);
  const fileName = "sample.txt";
  const filePath = path.resolve(__dirname, `./fixtures/${fileName}`);

  await fileUploadPage.goto();
  await fileUploadPage.uploadFile(filePath);
  await fileUploadPage.assertFileAttached(fileName);

  await fileUploadPage.submitUpload();
  await fileUploadPage.assertUploadSuccess(fileName);
});

test("executable file upload", async ({ page }) => {
  const fileUploadPage = new FileUploadPage(page);
  const fileName = "file.exe";

  await fileUploadPage.goto();
  await fileUploadPage.uploadFileContent(
    fileName,
    "application/x-msdownload",
    Buffer.from("fake content"),
  );

  await fileUploadPage.submitUpload();
  await fileUploadPage.assertUploadSuccess(fileName);
});

test("large file upload", async ({ page }) => {
  const fileUploadPage = new FileUploadPage(page);
  const fileName = "large.png";
  const largeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB

  await fileUploadPage.goto();
  await fileUploadPage.uploadFileContent(fileName, "image/png", largeBuffer);

  await fileUploadPage.submitUpload();
  await fileUploadPage.assertUploadSuccess(fileName);
});
