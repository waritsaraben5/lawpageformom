/** Text formatted for pasting into Facebook / Instagram post composer. */
export function buildSocialPostText(
  title: string,
  summary: string,
  pageUrl: string
): string {
  return `${title.trim()}\n\n${summary.trim()}\n\n${pageUrl}`;
}

export type CopyForSocialResult = {
  textCopied: boolean;
  imageCopied: boolean;
  message: string;
};

async function fetchImageBlob(imageUrl: string): Promise<Blob | null> {
  try {
    const res = await fetch(imageUrl, { mode: "cors" });
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

/**
 * Copies post text and cover image (when available) to the clipboard
 * for pasting into Facebook or Instagram.
 */
export async function copyArticleForSocial(options: {
  title: string;
  summary: string;
  pageUrl: string;
  imageUrl?: string | null;
}): Promise<CopyForSocialResult> {
  const text = buildSocialPostText(
    options.title,
    options.summary,
    options.pageUrl
  );

  if (!navigator.clipboard?.write) {
    return {
      textCopied: false,
      imageCopied: false,
      message: "เบราว์เซอร์ไม่รองรับการคัดลอก — ลองใช้ Chrome หรือ Edge",
    };
  }

  const imageBlob = options.imageUrl
    ? await fetchImageBlob(options.imageUrl)
    : null;

  try {
    if (imageBlob && typeof ClipboardItem !== "undefined") {
      const type = imageBlob.type.startsWith("image/")
        ? imageBlob.type
        : "image/png";
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" }),
          [type]: imageBlob.type.startsWith("image/")
            ? imageBlob
            : new Blob([await imageBlob.arrayBuffer()], { type }),
        }),
      ]);
      return {
        textCopied: true,
        imageCopied: true,
        message:
          "คัดลอกข้อความและรูปแล้ว — ไปที่ Facebook สร้างโพสต์ แล้วกด Ctrl+V (หรือ วาง)",
      };
    }

    await navigator.clipboard.writeText(text);
    return {
      textCopied: true,
      imageCopied: false,
      message: options.imageUrl
        ? "คัดลอกข้อความแล้ว (รูปคัดลอกไม่ได้ — อัปโหลดรูปจากลิงก์ด้านล่างแทน)"
        : "คัดลอกข้อความแล้ว — เพิ่มรูปในโพสต์ด้วยตนเอง",
    };
  } catch {
    try {
      await navigator.clipboard.writeText(text);
      return {
        textCopied: true,
        imageCopied: false,
        message:
          "คัดลอกข้อความแล้ว — รูปให้กดคัดลอกรูปแยก หรือดาวน์โหลดจากตัวอย่างด้านล่าง",
      };
    } catch {
      return {
        textCopied: false,
        imageCopied: false,
        message: "คัดลอกไม่สำเร็จ — อนุญาตการเข้าถึงคลิปบอร์ดในเบราว์เซอร์",
      };
    }
  }
}
