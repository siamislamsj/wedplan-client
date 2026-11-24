export async function uploadImage(file) {
  if (!file?.type?.startsWith("image/")) throw new Error("Only image files are allowed");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5 MB or smaller");

  const formData = new FormData();
  formData.append("image", file);

  let response;
  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Image upload failed. Check your connection and try again.");
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.url) throw new Error(result.message || "Image upload failed. Try again.");
  return result.url;
}
