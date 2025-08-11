import React, { useState, useRef } from "react";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setImageUrl("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8080/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h3>Upload Image to Cloudinary</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          ref={fileInputRef}
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button type="button" onClick={handleChoosePhoto} style={{ padding: "8px 16px", borderRadius: 4, border: "1px solid #ccc", background: "#fafafa", cursor: "pointer" }}>
          Choose Photo
        </button>
        {file && <span style={{ fontSize: 14 }}>{file.name}</span>}
      </div>
      <button onClick={handleUpload} disabled={!file || loading} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 4, background: "#7c3aed", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {imageUrl && (
        <div style={{ marginTop: 16 }}>
          <div>Uploaded Image:</div>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%", borderRadius: 4 }} />
        </div>
      )}
    </div>
  );
} 