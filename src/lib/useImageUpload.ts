import { useState, useRef, useEffect, useCallback } from "react";

export interface ImageUploadState {
  localPreview: string | null;
  remoteUrl: string;
  publicId?: string;
  status: "idle" | "uploading" | "success" | "error";
  error: string | null;
  file: File | null;
  progress?: number;
}

/**
 * Compresses an image client-side if it exceeds 800KB or 1920px dimensions
 * Prevents sluggish uploads and bandwidth hogs while preserving visual fidelity.
 */
async function compressImageIfNeeded(file: File, maxDimension = 1920, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }
  if (file.size < 800 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
          } else {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, mimeType === "image/jpeg" ? ".jpg" : ".png"), {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        },
        mimeType,
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    img.src = objectUrl;
  });
}

export function useImageUpload(token?: string, initialUrl: string = "") {
  const [state, setState] = useState<ImageUploadState>({
    localPreview: null,
    remoteUrl: initialUrl,
    status: initialUrl ? "success" : "idle",
    error: null,
    file: null,
  });

  const activeObjectUrlRef = useRef<string | null>(null);
  const pendingUploadAbortController = useRef<AbortController | null>(null);

  // Revoke object URL on unmount to prevent browser memory leaks
  useEffect(() => {
    return () => {
      if (activeObjectUrlRef.current) {
        URL.revokeObjectURL(activeObjectUrlRef.current);
        activeObjectUrlRef.current = null;
      }
      if (pendingUploadAbortController.current) {
        pendingUploadAbortController.current.abort();
      }
    };
  }, []);

  const uploadFile = useCallback(async (fileToUpload: File) => {
    if (!token) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "Authentication token missing. Please log in again.",
      }));
      return;
    }

    // Cancel existing in-flight upload if user selected another image
    if (pendingUploadAbortController.current) {
      pendingUploadAbortController.current.abort();
    }
    const controller = new AbortController();
    pendingUploadAbortController.current = controller;

    setState((prev) => ({ ...prev, status: "uploading", error: null }));

    try {
      // Fast client-side optimization before network transmission
      const processedFile = await compressImageIfNeeded(fileToUpload);

      if (controller.signal.aborted) return;

      const formData = new FormData();
      formData.append("image", processedFile);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        signal: controller.signal,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      setState((prev) => ({
        ...prev,
        remoteUrl: data.secure_url || data.url,
        publicId: data.public_id,
        status: "success",
        error: null,
      }));
    } catch (err: any) {
      if (err.name === "AbortError" || controller.signal.aborted) return;
      setState((prev) => ({
        ...prev,
        status: "error",
        error: err.message || "Upload failed. Please check network and retry.",
      }));
    } finally {
      if (pendingUploadAbortController.current === controller) {
        pendingUploadAbortController.current = null;
      }
    }
  }, [token]);

  const selectFile = useCallback((file: File) => {
    // 1. Immediately revoke previous object URL
    if (activeObjectUrlRef.current) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }

    // 2. Generate immediate zero-latency local preview
    const objectUrl = URL.createObjectURL(file);
    activeObjectUrlRef.current = objectUrl;

    setState({
      localPreview: objectUrl,
      remoteUrl: "",
      status: "uploading",
      error: null,
      file,
    });

    // 3. Initiate non-blocking background upload to Cloudinary
    uploadFile(file);
  }, [uploadFile]);

  const retry = useCallback(() => {
    if (state.file) {
      uploadFile(state.file);
    }
  }, [state.file, uploadFile]);

  const removeImage = useCallback(() => {
    if (pendingUploadAbortController.current) {
      pendingUploadAbortController.current.abort();
      pendingUploadAbortController.current = null;
    }
    if (activeObjectUrlRef.current) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }
    setState({
      localPreview: null,
      remoteUrl: "",
      publicId: undefined,
      status: "idle",
      error: null,
      file: null,
    });
  }, []);

  const setManualUrl = useCallback((url: string) => {
    if (activeObjectUrlRef.current) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }
    setState({
      localPreview: null,
      remoteUrl: url,
      publicId: undefined,
      status: url ? "success" : "idle",
      error: null,
      file: null,
    });
  }, []);

  return {
    previewUrl: state.localPreview || state.remoteUrl,
    remoteUrl: state.remoteUrl,
    publicId: state.publicId,
    status: state.status,
    isUploading: state.status === "uploading",
    isSuccess: state.status === "success" && Boolean(state.remoteUrl),
    isError: state.status === "error",
    error: state.error,
    file: state.file,
    selectFile,
    retry,
    removeImage,
    setManualUrl,
  };
}
