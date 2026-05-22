import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createShop } from "../services/shopServices";
import { fetchCategories } from "../services/categoryServices";
import { uploadFile } from "../services/uploadServices";

const MAX_IMAGES   = 4;
const MAX_SIZE_MB  = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ── Validator ── */
const validate = (form, images) => {
  if (!form.name.trim())
    return "Shop name required hai";
  if (!/^[6-9]\d{9}$/.test(form.mobileNumber))
    return "Valid 10-digit Indian mobile number daalo";
  if (!form.category)
    return "Category select karo";
  if (!form.latitude || !form.longitude)
    return "Pehle location add karo 📍";
  if (images.length === 0)
    return "Kam se kam ek image zaroori hai 🖼️";
  return null;
};

function CreateShop() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobileNumber: "",
    latitude: "",
    longitude: "",
    isOpen: false,
    category: "",
    tags: "",
  });

  const [images, setImages]                   = useState([]);
  const [categories, setCategories]           = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting]           = useState(false);
  const [uploadProgress, setUploadProgress]   = useState(0);
  const [submitted, setSubmitted]             = useState(false);
  const [submitError, setSubmitError]         = useState("");

  const fileInputRef = useRef(null);

  /* Categories load */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Categories load error:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  /* Cleanup object URLs on unmount */
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  /* ── Get Location ── */
  const getMyLocation = () => {
    if (!navigator.geolocation) {
      setSubmitError("Aapka browser geolocation support nahi karta");
      return;
    }
    setLoadingLocation(true);
    setSubmitError("");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((prev) => ({
          ...prev,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));
        setLoadingLocation(false);
      },
      () => {
        // ✅ alert() nahi — state se error dikhao
        setSubmitError(
          "Location permission denied. Browser settings mein location allow karo."
        );
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  /* ── Form Change ── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSubmitError("");
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ── Image Select ── */
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const slots = MAX_IMAGES - images.length;
    if (slots <= 0) return;

    // ✅ Type + size validation
    const invalidType = files.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalidType) {
      setSubmitError("Sirf JPG, PNG, ya WebP images allowed hain");
      e.target.value = "";
      return;
    }

    const tooBig = files.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooBig) {
      setSubmitError(`Har image max ${MAX_SIZE_MB}MB honi chahiye`);
      e.target.value = "";
      return;
    }

    setSubmitError("");

    const newImages = files.slice(0, slots).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  /* ── Remove Image ── */
  const removeImage = (id) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.preview) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // ✅ Validate before submitting
    const err = validate(form, images);
    if (err) { setSubmitError(err); return; }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      // Step 1: Images upload
      const uploadedUrls = [];
      for (let i = 0; i < images.length; i++) {
        const url = await uploadFile(images[i].file);
        uploadedUrls.push(url);
        setUploadProgress(Math.round(((i + 1) / images.length) * 80));
      }

      // Step 2: Shop save
      setUploadProgress(90);
      await createShop({
        name:         form.name.trim(),
        mobileNumber: form.mobileNumber,
        latitude:     Number(form.latitude),
        longitude:    Number(form.longitude),
        isOpen:       form.isOpen,
        category:     form.category || undefined,
        // ✅ lowercase tags
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
          : [],
        image:  uploadedUrls[0],
        images: uploadedUrls,
      });

      setUploadProgress(100);
      setSubmitted(true);

      // Cleanup previews
      images.forEach((img) => URL.revokeObjectURL(img.preview));
      setImages([]);
      setForm({
        name: "", mobileNumber: "", latitude: "",
        longitude: "", isOpen: false, category: "", tags: "",
      });

      // ✅ Map pe redirect
      setTimeout(() => navigate("/map"), 2000);
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || err.message || "Kuch galat hua, dobara try karo.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Button Label ── */
  const btnLabel = () => {
    if (submitted) return "✅ Shop Create Ho Gayi! Redirect ho raha hai…";
    if (submitting && uploadProgress < 80)
      return `Images upload ho rahi hain… ${uploadProgress}%`;
    if (submitting) return "Shop save ho rahi hai…";
    return "🚀 Create Shop";
  };

  return (
    <div className="cs-page">
      <div className="cs-orb cs-orb1" />
      <div className="cs-orb cs-orb2" />

      <form className="cs-card" onSubmit={handleSubmit} noValidate>
        <div className="cs-header">
          <div className="cs-header-icon">🏪</div>
          <div>
            <h2>Add Your Shop</h2>
            <p>List your shop on ShopFinder</p>
          </div>
        </div>

        <div className="cs-divider" />

        <div className="cs-body">

          {/* Shop Name */}
          <div className="cs-field">
            <label className="cs-label">Shop Name</label>
            <div className="cs-input-wrap">
              <span className="cs-input-icon">🏪</span>
              <input
                type="text"
                name="name"
                placeholder="e.g. Sharma Kirana Store"
                value={form.name}
                onChange={handleChange}
                disabled={submitting}
                maxLength={100}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="cs-field">
            <label className="cs-label">Mobile Number</label>
            <div className="cs-input-wrap">
              <span className="cs-input-icon">📱</span>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="e.g. 9876543210"
                value={form.mobileNumber}
                onChange={handleChange}
                disabled={submitting}
                maxLength={10}
              />
            </div>
          </div>

          {/* Category */}
          <div className="cs-field">
            <label className="cs-label">Category</label>
            <div className="cs-input-wrap cs-select-wrap">
              <span className="cs-input-icon">🗂️</span>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loadingCategories || submitting}
              >
                <option value="">
                  {loadingCategories ? "Loading…" : "Select Category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="cs-field">
            <label className="cs-label">Tags (comma separated)</label>
            <div className="cs-input-wrap">
              <span className="cs-input-icon">🏷️</span>
              <input
                type="text"
                name="tags"
                placeholder="e.g. veg, organic, 24x7"
                value={form.tags}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Images */}
          <div className="cs-field">
            <label className="cs-label">
              Shop Images{" "}
              <span className="cs-img-counter">{images.length}/{MAX_IMAGES}</span>
            </label>

            {images.length < MAX_IMAGES && !submitting && (
              <button
                type="button"
                className="cs-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <span>📸</span>{" "}
                {images.length === 0
                  ? "Photos Add Karo"
                  : `Aur Add Karo (${MAX_IMAGES - images.length} baki)`}
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />

            {images.length > 0 && (
              <div className="cs-img-grid">
                {images.map((img, index) => (
                  <div key={img.id} className="cs-img-thumb">
                    <img src={img.preview} alt={`preview ${index + 1}`} />
                    {index === 0 && (
                      <div className="cs-img-main-badge">Cover</div>
                    )}
                    {submitting && (
                      <div className="cs-img-overlay">
                        <div className="cs-img-spinner" />
                      </div>
                    )}
                    {!submitting && (
                      <button
                        type="button"
                        className="cs-img-remove"
                        onClick={() => removeImage(img.id)}
                        title="Remove"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="cs-img-hint">
              Pehli image cover photo hogi · Max {MAX_SIZE_MB}MB · JPG/PNG/WebP
            </p>
          </div>

          {/* Location */}
          <div className="cs-field">
            <label className="cs-label">Location</label>
            <button
              type="button"
              className="cs-loc-btn"
              onClick={getMyLocation}
              disabled={loadingLocation || submitting}
            >
              {loadingLocation
                ? "Location mil rahi hai…"
                : form.latitude
                ? "📍 Location Update Karo"
                : "Meri Location Use Karo 📍"}
            </button>

            {form.latitude && (
              <div className="cs-coords">
                <div className="cs-coord">
                  Latitude
                  <span>{Number(form.latitude).toFixed(6)}</span>
                </div>
                <div className="cs-coord">
                  Longitude
                  <span>{Number(form.longitude).toFixed(6)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Status Toggle */}
          <div className="cs-field">
            <label className="cs-label">Status</label>
            <div className="cs-toggle-row">
              <div>
                <div className="cs-toggle-title">Shop abhi open hai</div>
                <div className="cs-toggle-sub">
                  Customers ko dikhega ki shop khuli hai
                </div>
              </div>
              <label className="cs-toggle">
                <input
                  type="checkbox"
                  name="isOpen"
                  checked={form.isOpen}
                  onChange={handleChange}
                  disabled={submitting}
                />
                <span className="cs-slider" />
              </label>
            </div>
          </div>

          {/* Progress Bar */}
          {submitting && (
            <div className="cs-progress-wrap">
              <div
                className="cs-progress-bar"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Error */}
          {submitError && (
            <p className="cs-error">⚠ {submitError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`cs-submit-btn${submitted ? " cs-submitted" : ""}`}
            disabled={submitting || submitted}
          >
            {btnLabel()}
          </button>

        </div>
      </form>
    </div>
  );
}

export default CreateShop;