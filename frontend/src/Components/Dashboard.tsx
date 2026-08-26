import { useEffect, useState } from "react";
import {
  Cloud,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  LogOut,
  MoreVertical,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";

interface FileMetadata {
  userId: string;
  fileId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  s3Key: string;
  status: string;
  createdAt: string;
}

const API_URL = "http://localhost:5000/api";

export function Dashboard() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showUpload, setShowUpload] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<globalThis.File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [uploadError, setUploadError] =
    useState("");


  /* =========================================
     GET FILES
     ========================================= */

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not authenticated."
        );
      }

      const response = await fetch(
        `${API_URL}/files`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch files"
        );
      }

      setFiles(result.files || []);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load files"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchFiles();
  }, []);


  /* =========================================
     LOGOUT
     ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };


  /* =========================================
     DOWNLOAD
     ========================================= */

  const handleDownload = async (
    fileId: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not authenticated."
        );
      }

      const response = await fetch(
        `${API_URL}/files/${fileId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Download failed"
        );
      }

      // Backend returns a presigned URL
      window.open(
        result.downloadUrl,
        "_blank"
      );

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Download failed"
      );
    }
  };


  /* =========================================
     DELETE
     ========================================= */

  const handleDelete = async (
    fileId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not authenticated."
        );
      }

      const response = await fetch(
        `${API_URL}/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete file"
        );
      }

      // Remove deleted file from UI
      setFiles((currentFiles) =>
        currentFiles.filter(
          (file) =>
            file.fileId !== fileId
        )
      );

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );
    }
  };


  /* =========================================
     UPLOAD
     ========================================= */

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError(
        "Please select a file."
      );
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not authenticated."
        );
      }


      /* -------------------------------------
         STEP 1
         Ask backend for presigned URL
      ------------------------------------- */

      const uploadUrlResponse =
        await fetch(
          `${API_URL}/files/upload-url`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              fileName:
                selectedFile.name,

              contentType:
                selectedFile.type,

              fileSize:
                selectedFile.size,
            }),
          }
        );


      const uploadData =
        await uploadUrlResponse.json();


      if (!uploadUrlResponse.ok) {
        throw new Error(
          uploadData.message ||
            "Failed to create upload URL"
        );
      }


      /* -------------------------------------
         STEP 2
         Upload directly to S3
      ------------------------------------- */

      const s3Response =
        await fetch(
          uploadData.uploadUrl,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                selectedFile.type,
            },
            body: selectedFile,
          }
        );


      if (!s3Response.ok) {
        throw new Error(
          "Failed to upload file to S3"
        );
      }


      /* -------------------------------------
         STEP 3
         Tell backend upload is complete
      ------------------------------------- */

      const completeResponse =
        await fetch(
          `${API_URL}/files/complete`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              fileId:
                uploadData.fileId,

              s3Key:
                uploadData.s3Key,

              fileName:
                uploadData.fileName,

              contentType:
                uploadData.contentType,

              fileSize:
                uploadData.fileSize,
            }),
          }
        );


      const completeData =
        await completeResponse.json();


      if (!completeResponse.ok) {
        throw new Error(
          completeData.message ||
            "Failed to complete upload"
        );
      }


      /* -------------------------------------
         STEP 4
         Refresh file list
      ------------------------------------- */

      await fetchFiles();

      setSelectedFile(null);
      setShowUpload(false);

    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };


  /* =========================================
     SEARCH
     ========================================= */

  const filteredFiles =
    files.filter((file) =>
      file.fileName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


  /* =========================================
     USER
     ========================================= */

  const storedUser =
    localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;


  /* =========================================
     FORMAT FILE SIZE
     ========================================= */

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes === 0) {
      return "0 Bytes";
    }

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const index = Math.floor(
      Math.log(bytes) /
        Math.log(1024)
    );

    return `${(
      bytes /
      Math.pow(1024, index)
    ).toFixed(1)} ${units[index]}`;
  };


  /* =========================================
     FILE ICON
     ========================================= */

  const getFileIcon = (
    contentType: string
  ) => {
    if (
      contentType.includes("pdf")
    ) {
      return (
        <FileText
          size={19}
        />
      );
    }

    if (
      contentType.includes(
        "spreadsheet"
      ) ||
      contentType.includes("excel")
    ) {
      return (
        <FileSpreadsheet
          size={19}
        />
      );
    }

    if (
      contentType.startsWith(
        "image/"
      )
    ) {
      return (
        <FileImage
          size={19}
        />
      );
    }

    return (
      <File size={19} />
    );
  };


  return (
    <main className="min-h-screen bg-background">

      {/* =====================================
          NAVBAR
      ====================================== */}

      <nav className="border-b border-border bg-white/80 backdrop-blur">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">

              <Cloud size={18} />

            </div>

            <span className="text-lg font-bold tracking-tight">
              lumen
            </span>

          </div>


          {/* User */}

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold">
                {user?.name ||
                  "User"}
              </p>

              <p className="text-xs text-muted-foreground">
                {user?.email || ""}
              </p>

            </div>


            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium transition hover:bg-gray-50"
            >

              <LogOut size={15} />

              <span className="hidden sm:block">
                Log out
              </span>

            </button>

          </div>

        </div>

      </nav>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">


        {/* Header */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">

              <ShieldCheck size={14} />

              Secure workspace

            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              My Files
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Store, manage and access your
              files securely.
            </p>

          </div>


          <button
            onClick={() =>
              setShowUpload(true)
            }
            className="auth-button flex items-center justify-center gap-2 px-5"
          >

            <Upload size={17} />

            Upload file

          </button>

        </div>


        {/* =====================================
            SEARCH + STATS
        ====================================== */}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative max-w-md flex-1">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={17}
            />

            <input
              type="text"
              placeholder="Search your files..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="h-11 w-full rounded-lg border border-border bg-white pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

          </div>


          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5">

            <Cloud
              size={16}
              className="text-primary"
            />

            <span className="text-sm font-medium">
              {files.length}{" "}
              {files.length === 1
                ? "file"
                : "files"}
            </span>

          </div>

        </div>


        {/* =====================================
            FILE LIST
        ====================================== */}

        <section className="mt-6 overflow-hidden rounded-xl border border-border bg-white shadow-sm">

          {/* Table header */}

          <div className="hidden grid-cols-[1fr_120px_120px_80px] gap-4 border-b border-border bg-gray-50/70 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid">

            <span>
              File
            </span>

            <span>
              Size
            </span>

            <span>
              Status
            </span>

            <span>
              Actions
            </span>

          </div>


          {/* Loading */}

          {loading && (
            <div className="flex min-h-64 items-center justify-center">

              <div className="text-center">

                <div className="mx-auto size-7 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

                <p className="mt-3 text-sm text-muted-foreground">
                  Loading your files...
                </p>

              </div>

            </div>
          )}


          {/* Error */}

          {!loading && error && (
            <div className="p-8 text-center">

              <p className="text-sm text-red-500">
                {error}
              </p>

              <button
                onClick={fetchFiles}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Try again
              </button>

            </div>
          )}


          {/* Empty */}

          {!loading &&
            !error &&
            filteredFiles.length ===
              0 && (
              <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">

                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">

                  <Cloud size={25} />

                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {search
                    ? "No files found"
                    : "Your workspace is empty"}
                </h3>

                <p className="mt-2 max-w-sm text-sm text-muted-foreground">

                  {search
                    ? "Try searching for a different file name."
                    : "Upload your first file to get started."}

                </p>

                {!search && (
                  <button
                    onClick={() =>
                      setShowUpload(true)
                    }
                    className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                  >

                    <Upload size={15} />

                    Upload your first file

                  </button>
                )}

              </div>
            )}


          {/* Files */}

          {!loading &&
            !error &&
            filteredFiles.length >
              0 && (

              <div>

                {filteredFiles.map(
                  (file) => (

                    <div
                      key={file.fileId}
                      className="group grid grid-cols-1 gap-4 border-b border-border px-5 py-4 transition hover:bg-purple-50/30 sm:grid-cols-[1fr_120px_120px_80px] sm:items-center sm:gap-4"
                    >

                      {/* File */}

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">

                          {getFileIcon(
                            file.contentType
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold">
                            {file.fileName}
                          </p>

                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {file.contentType}
                          </p>

                        </div>

                      </div>


                      {/* Size */}

                      <div className="text-sm text-muted-foreground">

                        <span className="sm:hidden">
                          Size:{" "}
                        </span>

                        {formatFileSize(
                          file.fileSize
                        )}

                      </div>


                      {/* Status */}

                      <div>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">

                          <span className="size-1.5 rounded-full bg-green-500" />

                          {file.status}

                        </span>

                      </div>


                      {/* Actions */}

                      <div className="flex items-center gap-1">

                        <button
                          onClick={() =>
                            handleDownload(
                              file.fileId
                            )
                          }
                          title="Download"
                          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                        >

                          <Download
                            size={16}
                          />

                        </button>


                        <button
                          onClick={() =>
                            handleDelete(
                              file.fileId
                            )
                          }
                          title="Delete"
                          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-500"
                        >

                          <Trash2
                            size={16}
                          />

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </section>

      </div>


      {/* =====================================
          UPLOAD MODAL
      ====================================== */}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-5 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">

            {/* Modal header */}

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Upload file
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select a file to upload
                  securely.
                </p>

              </div>

              <button
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                  setUploadError("");
                }}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-gray-100"
              >

                <X size={17} />

              </button>

            </div>


            {/* File input */}

            <div className="mt-6">

              <label
                htmlFor="file-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-gray-50 px-6 py-10 text-center transition hover:border-primary/40 hover:bg-purple-50/30"
              >

                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">

                  <Upload size={22} />

                </div>

                <p className="mt-4 text-sm font-semibold">

                  {selectedFile
                    ? selectedFile.name
                    : "Choose a file"}

                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Click to browse files
                </p>

              </label>

              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(event) => {
                  const file =
                    event.target.files?.[0];

                  if (file) {
                    setSelectedFile(file);
                    setUploadError("");
                  }
                }}
              />

            </div>


            {/* Selected file information */}

            {selectedFile && (
              <div className="mt-4 rounded-lg bg-purple-50 p-3">

                <div className="flex items-center gap-3">

                  <File
                    size={18}
                    className="text-primary"
                  />

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </p>

                  </div>

                </div>

              </div>
            )}


            {/* Upload error */}

            {uploadError && (
              <p className="mt-4 text-sm text-red-500">
                {uploadError}
              </p>
            )}


            {/* Buttons */}

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                disabled={uploading}
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                  setUploadError("");
                }}
                className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  uploading ||
                  !selectedFile
                }
                onClick={handleUpload}
                className="auth-button flex flex-1 items-center justify-center gap-2"
              >

                <Upload size={16} />

                {uploading
                  ? "Uploading..."
                  : "Upload"}

              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}