import { useState, useEffect } from "react";
import { 
  fetchCategories, 
  createCategory, 
  deleteCategory, 
  toggleCategory 
} from "../services/categoryServices";

// ── Slug generator ─────────────────────────────────────────────────────────────
const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

// ── Common emoji list for picker ───────────────────────────────────────────────
const EMOJI_OPTIONS = [
  "🛒","🏪","🍔","🍕","🍜","🥗","🧃","☕","🍰","🥩",
  "🧴","💊","👗","👟","📱","💻","🛋️","🔧","📚","🎮",
  "🌿","🐾","🚗","✈️","🎵","🎨","🧹","💈","🏋️","🧁",
];

function AddCategory() {
  const [form, setForm] = useState({ name: "", slug: "", icon: "📦", description: "" });
  const [slugManual, setSlugManual] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Load existing categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoadingList(true);
    try {
      const data = await fetchCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    } finally {
      setLoadingList(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: slugManual ? prev.slug : toSlug(value),
      }));
    } else if (name === "slug") {
      setSlugManual(true);
      setForm((prev) => ({ ...prev, slug: toSlug(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) { 
      setFormError("Category name is required."); 
      return; 
    }
    if (!form.slug.trim()) { 
      setFormError("Slug is required."); 
      return; 
    }

    setSubmitting(true);
    try {
      await createCategory({
        name: form.name.trim(),
        slug: form.slug.trim(),
        icon: form.icon,
        description: form.description.trim(),
      });

      setSubmitted(true);
      setForm({ name: "", slug: "", icon: "📦", description: "" });
      setSlugManual(false);
      await loadCategories(); // Refresh the list
      setTimeout(() => setSubmitted(false), 2500);
    } catch (err) {
      setFormError(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      alert(error.message || "Could not delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (cat) => {
    setTogglingId(cat._id);
    try {
      await toggleCategory(cat._id, !cat.isActive);
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (error) {
      alert(error.message || "Could not update category.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="ac-page">
      <div className="ac-orb ac-orb1" />
      <div className="ac-orb ac-orb2" />

      <div className="ac-layout">

        {/* ── Left: Form ─────────────────────────────── */}
        <form className="ac-card" onSubmit={handleSubmit}>
          <div className="ac-header">
            <div className="ac-header-icon">🗂️</div>
            <div>
              <h2>Add Category</h2>
              <p>Admin panel · Manage shop categories</p>
            </div>
          </div>

          <div className="ac-divider" />

          <div className="ac-body">

            {/* Icon picker */}
            <div className="ac-field">
              <label className="ac-label">Icon</label>
              <div className="ac-icon-row">
                <button
                  type="button"
                  className="ac-icon-preview"
                  onClick={() => setShowPicker((v) => !v)}
                  title="Pick an icon"
                >
                  {form.icon}
                </button>
                <span className="ac-icon-hint">Click to choose an emoji</span>
              </div>

              {showPicker && (
                <div className="ac-emoji-grid">
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      className={`ac-emoji-btn ${form.icon === em ? "ac-emoji-active" : ""}`}
                      onClick={() => {
                        setForm((prev) => ({ ...prev, icon: em }));
                        setShowPicker(false);
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="ac-field">
              <label className="ac-label">Category Name</label>
              <div className="ac-input-wrap">
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Fast Food"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Slug */}
            <div className="ac-field">
              <label className="ac-label">
                Slug
                <span className="ac-label-hint">· auto-generated</span>
              </label>
              <div className="ac-input-wrap ac-slug-wrap">
                <span className="ac-slug-prefix">/</span>
                <input
                  type="text"
                  name="slug"
                  placeholder="fast-food"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Description */}
            <div className="ac-field">
              <label className="ac-label">
                Description
                <span className="ac-label-hint">· optional</span>
              </label>
              <div className="ac-input-wrap">
                <textarea
                  name="description"
                  placeholder="Short description of this category"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  disabled={submitting}
                />
              </div>
            </div>

            {formError && <p className="ac-error">{formError}</p>}

            <button
              type="submit"
              className={`ac-submit-btn ${submitted ? "ac-submitted" : ""}`}
              disabled={submitting || submitted}
            >
              {submitted
                ? "✅ Category Added!"
                : submitting
                ? "Saving…"
                : "Add Category"}
            </button>
          </div>
        </form>

        {/* ── Right: Existing categories ──────────────── */}
        <div className="ac-list-panel">
          <div className="ac-list-header">
            <h3>All Categories</h3>
            <span className="ac-list-count">{categories.length}</span>
          </div>

          {loadingList ? (
            <div className="ac-list-empty">Loading…</div>
          ) : categories.length === 0 ? (
            <div className="ac-list-empty">No categories yet. Add one!</div>
          ) : (
            <ul className="ac-list">
              {categories.map((cat) => (
                <li key={cat._id} className={`ac-list-item ${!cat.isActive ? "ac-inactive" : ""}`}>
                  <span className="ac-list-icon">{cat.icon}</span>

                  <div className="ac-list-info">
                    <span className="ac-list-name">{cat.name}</span>
                    <span className="ac-list-slug">/{cat.slug}</span>
                  </div>

                  <div className="ac-list-actions">
                    {/* Active toggle */}
                    <button
                      type="button"
                      className={`ac-toggle-btn ${cat.isActive ? "ac-toggle-on" : "ac-toggle-off"}`}
                      onClick={() => handleToggle(cat)}
                      disabled={togglingId === cat._id}
                      title={cat.isActive ? "Deactivate" : "Activate"}
                    >
                      {togglingId === cat._id ? "…" : cat.isActive ? "Active" : "Inactive"}
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      className="ac-delete-btn"
                      onClick={() => handleDelete(cat._id)}
                      disabled={deletingId === cat._id}
                      title="Delete category"
                    >
                      {deletingId === cat._id ? "…" : "🗑"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default AddCategory;