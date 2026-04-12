import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: file.type as string,
  };
  const compressed = await imageCompression(file, options);
  return new File([compressed], file.name, { type: file.type });
}
