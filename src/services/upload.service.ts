import { api } from "./api";

type UploadResult = {
  url: string;
  thumb_url: string;
};

export async function uploadImage(uri: string): Promise<UploadResult> {
  const filename = uri.split("/").pop() ?? "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: filename,
    type,
  } as unknown as Blob);

  const res = await api.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}
