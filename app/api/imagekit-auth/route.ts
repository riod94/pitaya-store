import { getUploadAuthParams } from "@imagekit/next/server"
import { validateAdminAccess } from "@/lib/auth-admin";

export async function GET() {
  try {
    // Validate admin access
    const authResult = await validateAdminAccess();
    if (!authResult.isValid) {
      return Response.json(
        { error: authResult.error || "Unauthorized" },
        { status: authResult.status || 401 }
      );
    }

    // Generate authentication parameters for ImageKit upload
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });

    return Response.json({
      token,
      expire,
      signature,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
    });
  } catch (error) {
    console.error("Error generating ImageKit auth:", error);
    return Response.json(
      { error: "Failed to generate authentication" },
      { status: 500 }
    );
  }
}
