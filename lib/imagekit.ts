// Client-side configuration (untuk upload dari browser)
export const imagekitConfig = {
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
};

// Server-side ImageKit operations
export async function deleteImageKitFile(fileId: string) {
    if (typeof window !== 'undefined') {
        throw new Error('deleteImageKitFile hanya boleh digunakan di server-side');
    }

    const ImageKit = (await import("imagekit")).default;
    const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    });

    return imagekit.deleteFile(fileId);
}
