import { useEffect, useMemo, useState } from "react";
import {
  Cloud,
  Download,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  HardDrive,
  LogOut,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  CheckCircle2,
  Clock3,
  Menu,
  Sparkles,
} from "lucide-react";
import "./Dashboard.css";
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

  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] =
    useState<globalThis.File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userName = user?.name || "there";


  /* ==========================================
     FETCH FILES
     ========================================== */

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not authenticated.");
      }

      const response = await fetch(`${API_URL}/files`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch files"
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


  /* ==========================================
     LOGOUT
     ========================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };


  /* ==========================================
     DOWNLOAD
     ========================================== */

  const handleDownload = async (fileId: string) => {
    try {
      setOpenMenu(null);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not authenticated.");
      }

      const response = await fetch(
        `${API_URL}/files/${fileId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Download failed"
        );
      }

      window.open(result.downloadUrl, "_blank");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Download failed"
      );
    }
  };


  /* ==========================================
     DELETE
     ========================================== */

  const handleDelete = async (fileId: string) => {
    setOpenMenu(null);

    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not authenticated.");
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
          result.message || "Failed to delete file"
        );
      }

      setFiles((current) =>
        current.filter(
          (file) => file.fileId !== fileId
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


  /* ==========================================
     UPLOAD
     ========================================== */

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not authenticated.");
      }


      // 1. Get presigned URL

      const uploadUrlResponse = await fetch(
        `${API_URL}/files/upload-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: selectedFile.name,
            contentType: selectedFile.type,
            fileSize: selectedFile.size,
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


      // 2. Upload directly to S3

      const s3Response = await fetch(
        uploadData.uploadUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type": selectedFile.type,
          },
          body: selectedFile,
        }
      );

      if (!s3Response.ok) {
        throw new Error(
          "Failed to upload file to S3"
        );
      }


      // 3. Complete upload

      const completeResponse = await fetch(
        `${API_URL}/files/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileId: uploadData.fileId,
            s3Key: uploadData.s3Key,
            fileName: uploadData.fileName,
            contentType: uploadData.contentType,
            fileSize: uploadData.fileSize,
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


  /* ==========================================
     FILTER
     ========================================== */

  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.fileName
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [files, search]);


  /* ==========================================
     STATISTICS
     ========================================== */

  const totalSize = files.reduce(
    (total, file) => total + file.fileSize,
    0
  );

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB"];

    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(
      bytes / Math.pow(1024, index)
    ).toFixed(1)} ${units[index]}`;
  };


  /* ==========================================
     FILE ICON
     ========================================== */

  const getFileIcon = (
    contentType: string
  ) => {
    if (contentType.includes("pdf")) {
      return <FileText size={19} />;
    }

    if (
      contentType.includes("excel") ||
      contentType.includes("spreadsheet")
    ) {
      return <FileSpreadsheet size={19} />;
    }

    if (contentType.startsWith("image/")) {
      return <FileImage size={19} />;
    }

    return <File size={19} />;
  };


  /* ==========================================
     FILE TYPE
     ========================================== */

  const getFileType = (
    contentType: string
  ) => {
    if (contentType.includes("pdf")) return "PDF";

    if (
      contentType.includes("excel") ||
      contentType.includes("spreadsheet")
    ) {
      return "Spreadsheet";
    }

    if (contentType.startsWith("image/")) {
      return "Image";
    }

    return "File";
  };


  return (
    <div className="dashboard-shell">

      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}

      {sidebarOpen && (
        <div
          className="dashboard-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen
            ? "dashboard-sidebar-open"
            : ""
        }`}
      >

        <div>

          {/* Logo */}

          <div className="dashboard-brand">

            <div className="dashboard-brand-icon">
              <Cloud size={18} />
            </div>

            <span>lumen</span>

          </div>


          {/* Workspace */}

          <div className="dashboard-workspace">

            <div className="workspace-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>

              <p>Personal workspace</p>

              <span>
                {user?.email || "Your workspace"}
              </span>

            </div>

          </div>


          {/* Navigation */}

          <div className="dashboard-nav-label">
            Workspace
          </div>

          <nav className="dashboard-nav">

            <button className="dashboard-nav-item active">
              <FolderOpen size={17} />
              Overview
            </button>

            <button className="dashboard-nav-item">
              <File size={17} />
              My files
            </button>

            <button
              className="dashboard-nav-item"
              onClick={() =>
                setShowUpload(true)
              }
            >
              <Upload size={17} />
              Upload
            </button>

          </nav>


          <div className="dashboard-nav-label">
            Storage
          </div>


          {/* Storage card */}

          <div className="storage-card">

            <div className="storage-card-icon">
              <HardDrive size={17} />
            </div>

            <div className="storage-card-title">
              Cloud storage
            </div>

            <div className="storage-progress">
              <div
                className="storage-progress-value"
                style={{
                  width: "18%",
                }}
              />
            </div>

            <div className="storage-card-footer">
              <span>
                {formatFileSize(totalSize)}
              </span>

              <span>
                18% used
              </span>
            </div>

          </div>

        </div>


        {/* Sidebar bottom */}

        <div className="dashboard-sidebar-bottom">

          <div className="secure-badge">

            <ShieldCheck size={17} />

            <div>

              <strong>
                Your files are private
              </strong>

              <span>
                Secured with authentication
              </span>

            </div>

          </div>


          <button
            onClick={handleLogout}
            className="dashboard-logout"
          >
            <LogOut size={16} />
            Log out
          </button>

        </div>

      </aside>


      {/* ========================================
          MAIN
      ======================================== */}

      <main className="dashboard-main">


        {/* ======================================
            TOP BAR
        ======================================= */}

        <header className="dashboard-topbar">

          <button
            className="dashboard-mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={20} />
          </button>


          {/* Search */}

          <div className="dashboard-global-search">

            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search your files..."
            />

            <span>
              ⌘ K
            </span>

          </div>


          {/* Right */}

          <div className="dashboard-topbar-right">

            <div className="dashboard-secure-status">
              <span />
              Secure
            </div>

            <div className="dashboard-user">

              <div className="dashboard-user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div className="dashboard-user-info">

                <strong>
                  {userName}
                </strong>

                <span>
                  Personal
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ======================================
            CONTENT
        ======================================= */}

        <div className="dashboard-content">


          {/* Greeting */}

          <section className="dashboard-greeting">

            <div>

              <div className="dashboard-eyebrow">

                <Sparkles size={13} />

                Your workspace

              </div>

              <h1>
                Good to see you,{" "}
                {userName.split(" ")[0]}.
              </h1>

              <p>
                Everything you need, right where
                you left it.
              </p>

            </div>


            <button
              className="dashboard-upload-button"
              onClick={() =>
                setShowUpload(true)
              }
            >

              <Upload size={17} />

              Upload file

            </button>

          </section>


          {/* ====================================
              STAT CARDS
          ===================================== */}

          <section className="dashboard-stats">

            <div className="dashboard-stat-card">

              <div className="stat-card-top">

                <div className="stat-icon purple">
                  <File size={18} />
                </div>

                <span className="stat-label">
                  Total files
                </span>

              </div>

              <strong>
                {files.length}
              </strong>

              <span className="stat-description">
                Files in your workspace
              </span>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-card-top">

                <div className="stat-icon blue">
                  <HardDrive size={18} />
                </div>

                <span className="stat-label">
                  Storage used
                </span>

              </div>

              <strong>
                {formatFileSize(totalSize)}
              </strong>

              <span className="stat-description">
                Across all your files
              </span>

            </div>


            <div className="dashboard-stat-card">

              <div className="stat-card-top">

                <div className="stat-icon green">
                  <ShieldCheck size={18} />
                </div>

                <span className="stat-label">
                  Security
                </span>

              </div>

              <strong className="stat-security">
                Protected
              </strong>

              <span className="stat-description">
                Your files are private
              </span>

            </div>

          </section>


          {/* ====================================
              FILES
          ===================================== */}

          <section className="dashboard-files-section">


            <div className="files-section-header">

              <div>

                <h2>
                  Your files
                </h2>

                <p>
                  {filteredFiles.length}{" "}
                  {filteredFiles.length === 1
                    ? "file"
                    : "files"}{" "}
                  in your workspace
                </p>

              </div>


              <button
                className="files-refresh-button"
                onClick={fetchFiles}
              >
                Refresh
              </button>

            </div>


            {/* FILE TABLE */}

            <div className="files-table">


              {/* Header */}

              <div className="files-table-header">

                <span>
                  Name
                </span>

                <span>
                  Type
                </span>

                <span>
                  Size
                </span>

                <span>
                  Added
                </span>

                <span />

              </div>


              {/* Loading */}

              {loading && (
                <div className="files-empty-state">

                  <div className="dashboard-spinner" />

                  <p>
                    Loading your files...
                  </p>

                </div>
              )}


              {/* Error */}

              {!loading && error && (
                <div className="files-empty-state">

                  <div className="empty-icon error">
                    <X size={21} />
                  </div>

                  <h3>
                    Couldn't load your files
                  </h3>

                  <p>
                    {error}
                  </p>

                  <button
                    onClick={fetchFiles}
                    className="empty-action"
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
                  <div className="files-empty-state">

                    <div className="empty-icon">
                      <FolderOpen size={22} />
                    </div>

                    <h3>
                      {search
                        ? "No matching files"
                        : "Your workspace is empty"}
                    </h3>

                    <p>
                      {search
                        ? "Try a different search term."
                        : "Upload your first file to get started."}
                    </p>

                    {!search && (
                      <button
                        onClick={() =>
                          setShowUpload(true)
                        }
                        className="empty-action"
                      >
                        <Upload size={15} />
                        Upload your first file
                      </button>
                    )}

                  </div>
                )}


              {/* FILES */}

              {!loading &&
                !error &&
                filteredFiles.map(
                  (file) => (

                    <div
                      key={file.fileId}
                      className="file-row"
                    >

                      {/* Name */}

                      <div className="file-name-cell">

                        <div className="file-type-icon">
                          {getFileIcon(
                            file.contentType
                          )}
                        </div>

                        <div className="file-name-info">

                          <strong>
                            {file.fileName}
                          </strong>

                          <span>
                            {file.fileId.slice(
                              0,
                              8
                            )}
                          </span>

                        </div>

                      </div>


                      {/* Type */}

                      <span className="file-type-text">
                        {getFileType(
                          file.contentType
                        )}
                      </span>


                      {/* Size */}

                      <span className="file-size-text">
                        {formatFileSize(
                          file.fileSize
                        )}
                      </span>


                      {/* Date */}

                      <span className="file-date-text">
                        {new Date(
                          file.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>


                      {/* Actions */}

                      <div className="file-actions">

                        <button
                          onClick={() =>
                            handleDownload(
                              file.fileId
                            )
                          }
                          title="Download"
                          className="file-action download"
                        >
                          <Download size={16} />
                        </button>


                        <div className="file-more-wrapper">

                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu ===
                                  file.fileId
                                  ? null
                                  : file.fileId
                              )
                            }
                            className="file-action"
                          >
                            <MoreHorizontal
                              size={17}
                            />
                          </button>


                          {openMenu ===
                            file.fileId && (
                            <div className="file-menu">

                              <button
                                onClick={() =>
                                  handleDownload(
                                    file.fileId
                                  )
                                }
                              >
                                <Download
                                  size={15}
                                />
                                Download
                              </button>

                              <button
                                className="danger"
                                onClick={() =>
                                  handleDelete(
                                    file.fileId
                                  )
                                }
                              >
                                <Trash2
                                  size={15}
                                />
                                Delete
                              </button>

                            </div>
                          )}

                        </div>

                      </div>

                    </div>

                  )
                )}

            </div>

          </section>

        </div>

      </main>


      {/* ========================================
          UPLOAD MODAL
      ======================================== */}

      {showUpload && (

        <div className="upload-modal-overlay">

          <div className="upload-modal">


            <div className="upload-modal-header">

              <div>

                <span className="modal-eyebrow">
                  FILE UPLOAD
                </span>

                <h2>
                  Add a new file
                </h2>

                <p>
                  Your file will be uploaded
                  directly to secure cloud storage.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                  setUploadError("");
                }}
              >
                <X size={18} />
              </button>

            </div>


            {/* Drop zone */}

            <label
              htmlFor="dashboard-file-upload"
              className={`upload-dropzone ${
                selectedFile
                  ? "has-file"
                  : ""
              }`}
            >

              <div className="upload-cloud-icon">
                {selectedFile ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <Cloud size={24} />
                )}
              </div>

              <h3>
                {selectedFile
                  ? selectedFile.name
                  : "Choose a file to upload"}
              </h3>

              <p>
                {selectedFile
                  ? formatFileSize(
                      selectedFile.size
                    )
                  : "Click here to browse your computer"}
              </p>

              {!selectedFile && (
                <span className="upload-hint">
                  Files are uploaded securely
                  using a direct cloud connection.
                </span>
              )}

            </label>

            <input
              id="dashboard-file-upload"
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


            {uploadError && (
              <div className="upload-error">
                <X size={15} />
                {uploadError}
              </div>
            )}


            <div className="upload-modal-footer">

              <button
                disabled={uploading}
                className="modal-cancel"
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFile(null);
                  setUploadError("");
                }}
              >
                Cancel
              </button>

              <button
                disabled={
                  uploading ||
                  !selectedFile
                }
                className="modal-upload"
                onClick={handleUpload}
              >

                <Upload size={16} />

                {uploading
                  ? "Uploading..."
                  : "Upload file"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}