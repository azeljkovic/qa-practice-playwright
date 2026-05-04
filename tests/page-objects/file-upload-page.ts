import { expect, type Locator, type Page } from "@playwright/test";

// creates a reusable TypeScript type from Playwright’s setInputFiles method signature
type FileUpload = Parameters<Locator["setInputFiles"]>[0];

export class FileUploadPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly uploadResponse: Locator;
  readonly url = "/file-upload";

  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.locator("#file_upload");
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.uploadResponse = page.locator("#file_upload_response");
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async uploadFile(file: FileUpload) {
    await this.fileInput.setInputFiles(file);
  }

  async uploadFileContent(fileName: string, mimeType: string, buffer: Buffer) {
    await this.uploadFile({
      name: fileName,
      mimeType,
      buffer,
    });
  }

  async submitUpload() {
    await this.submitButton.click();
  }

  async assertFileAttached(fileName: string) {
    await expect(this.fileInput).toHaveValue(new RegExp(fileName));
  }

  async assertUploadSuccess(fileName: string) {
    await expect(this.uploadResponse).toBeVisible();
    await expect(this.uploadResponse).toContainText(
      "You have successfully uploaded",
    );
    await expect(this.uploadResponse).toContainText(fileName);
  }
}
