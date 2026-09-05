import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Messages from "./Messages";
import {
  LogOut,
  Save,
  Trash2,
  Plus,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";

import {
  EventItem,
  ScheduleItem,
  useSiteContent,
} from "@/context/SiteContentContext";

import {
  SUPABASE_URL,
  get,
  patch,
  post,
  remove,
  getSession,
  signOut,
  verifyAdmin,
  getCurrentChurchId,
} from "@/lib/supabase";

const HERO_BUCKET = "site-assets";

const groups: Record<string, string[]> = {
  Site: ["site.name", "site.heroImage"],

  Hero: [
    "hero.est",
    "hero.title1",
    "hero.title2",
    "hero.sub",
    "hero.cta1",
    "hero.cta2",
  ],

  About: [
    "about.eyebrow",
    "about.title1",
    "about.title2",
    "about.v1.title",
    "about.v1.desc",
    "about.v2.title",
    "about.v2.desc",
    "about.v3.title",
    "about.v3.desc",
    "about.verse",
    "about.ref",
  ],

  Schedule: [
    "schedule.eyebrow",
    "schedule.title1",
    "schedule.title2",
    "schedule.sub",
    "schedule.monthly.title1",
    "schedule.monthly.title2",
    "schedule.m1.date",
    "schedule.m1.name",
    "schedule.m1.desc",
    "schedule.m2.date",
    "schedule.m2.name",
    "schedule.m2.desc",
    "schedule.m3.date",
    "schedule.m3.name",
    "schedule.m3.desc",
  ],

  Events: [
    "events.eyebrow",
    "events.title1",
    "events.title2",
    "events.featured",
  ],

  Contact: [
    "contact.eyebrow",
    "contact.title1",
    "contact.title2",
    "contact.findus",
    "contact.address.label",
    "contact.address.val",
    "contact.phone.label",
    "contact.phone.val",
    "contact.email.label",
    "contact.email.val",
    "contact.follow",
    "contact.facebook",
    "contact.youtube",
    "contact.instagram",
    "contact.form.title",
    "contact.form.fname",
    "contact.form.lname",
    "contact.form.email",
    "contact.form.message",
    "contact.form.placeholder.fname",
    "contact.form.placeholder.lname",
    "contact.form.placeholder.email",
    "contact.form.placeholder.message",
    "contact.form.submit",
  ],

  Footer: ["footer.rights", "footer.verse"],
};

function Input({
  value,
  onChange,
  multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return multiline ? (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm"
    />
  ) : (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm"
    />
  );
}

function isLong(key: string) {
  return (
    key.includes(".desc") ||
    key.includes(".sub") ||
    key.includes(".verse") ||
    key.includes("address.val")
  );
}

/**
 * Hero image uploader
 */
function HeroImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const uploadImage = async (file: File) => {
    const session = getSession();

    if (!session?.access_token) {
      setUploadError(
        "Your admin session has expired. Please sign in again."
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be smaller than 10 MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `hero-${Date.now()}.${extension}`;

      const uploadUrl =
        `${SUPABASE_URL}/storage/v1/object/${HERO_BUCKET}/${fileName}`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: session.access_token,
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: file,
      });

      if (!response.ok) {
        let errorMessage = "Failed to upload image.";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData?.message ||
            errorData?.error ||
            errorMessage;
        } catch {
          // Ignore JSON parsing error.
        }

        throw new Error(errorMessage);
      }

      const publicUrl =
        `${SUPABASE_URL}/storage/v1/object/public/${HERO_BUCKET}/${fileName}`;

      onChange(publicUrl);
    } catch (error: any) {
      console.error("Hero image upload error:", error);

      setUploadError(
        error?.message || "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange("");
    setUploadError("");
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs uppercase tracking-wider text-muted-foreground">
        Hero Image
      </label>

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={value}
            alt="Current hero"
            className="w-full h-64 object-cover"
          />

          <div className="absolute top-3 right-3 flex gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 bg-black/70 text-white px-3 py-2 rounded-lg text-sm hover:bg-black/80">
              <Upload className="w-4 h-4" />

              {uploading ? "Uploading..." : "Replace"}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    uploadImage(file);
                  }

                  e.target.value = "";
                }}
              />
            </label>

            <button
              type="button"
              onClick={removeImage}
              disabled={uploading}
              className="inline-flex items-center justify-center bg-red-600/90 text-white w-10 h-10 rounded-lg hover:bg-red-700 disabled:opacity-50"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="cursor-pointer block border-2 border-dashed border-border rounded-xl p-10 text-center hover:bg-muted transition">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />

          <p className="font-semibold text-sm">
            {uploading
              ? "Uploading image..."
              : "Upload hero image"}
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, WEBP — maximum 10 MB
          </p>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                uploadImage(file);
              }

              e.target.value = "";
            }}
          />
        </label>
      )}

      {uploadError && (
        <div className="rounded-lg bg-red-50 text-red-700 border border-red-200 px-4 py-3 text-sm">
          {uploadError}
        </div>
      )}

      {value && (
        <div className="text-xs text-muted-foreground break-all">
          <span className="font-semibold">Image URL:</span>{" "}
          {value}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        The image will be uploaded to Supabase Storage. Click
        <strong> Save content </strong>
        after selecting the image to permanently save it as the website
        hero.
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const nav = useNavigate();

  const {
    content,
    schedule,
    events,
    refresh,
  } = useSiteContent();

  const [authed, setAuthed] =
    useState<boolean | null>(null);

  const [tab, setTab] = useState("Site");

  const [draft, setDraft] = useState(content);

  const [sch, setSch] =
    useState<ScheduleItem[]>(schedule);

  const [ev, setEv] =
    useState<EventItem[]>(events);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      const session = getSession();

      if (!session) {
        setAuthed(false);
        return;
      }

      try {
        const valid = await verifyAdmin(
          session.access_token
        );

        setAuthed(valid);
      } catch (error) {
        console.error("Admin authentication error:", error);

        setAuthed(false);
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  useEffect(() => {
    setSch(schedule);
  }, [schedule]);

  useEffect(() => {
    setEv(events);
  }, [events]);

  const keys = useMemo(
    () => groups[tab] || [],
    [tab]
  );

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking access…
      </div>
    );
  }

  if (!authed) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  /**
   * Save website content.
   *
   * The current church is determined from:
   *
   * authenticated user
   *        ↓
   * admin_users
   *        ↓
   * church_id
   *        ↓
   * site_content
   */
  const saveContent = async () => {
    const session = getSession();

    if (!session?.access_token) {
      setMessage(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const churchId =
        await getCurrentChurchId();

      console.log(
        "Saving content for church:",
        churchId
      );

      /**
       * Find this church's site_content row.
       *
       * No hardcoded row ID is used.
       */
      const rows = await get(
        `site_content?church_id=eq.${churchId}&select=id&limit=1`
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error(
          "No site content record exists for this church."
        );
      }

      const siteContentId = rows[0]?.id;

      if (
        siteContentId === null ||
        siteContentId === undefined
      ) {
        throw new Error(
          "Unable to determine the site content record."
        );
      }

      await patch(
        `site_content?id=eq.${encodeURIComponent(
          String(siteContentId)
        )}&church_id=eq.${churchId}`,
        {
          content: draft,
          updated_at:
            new Date().toISOString(),
        }
      );

      await refresh();

      setMessage(
        "Content saved successfully."
      );
    } catch (e: any) {
      console.error(
        "SAVE CONTENT ERROR:",
        e
      );

      setMessage(
        e?.message ||
          "Failed to save content."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Save weekly schedule.
   *
   * Only the current church's rows are deleted.
   * New rows receive the current church_id.
   */
  const saveSchedules = async () => {
    const session = getSession();

    if (!session?.access_token) {
      setMessage(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const churchId =
        await getCurrentChurchId();

      console.log(
        "Saving schedule for church:",
        churchId
      );

      /**
       * Delete ONLY this church's schedule.
       */
      await remove(
        `schedule_items?church_id=eq.${churchId}`
      );

      /**
       * Build a clean database payload.
       *
       * Do not send the existing UUID.
       * Supabase generates a new one.
       */
      const payload = sch.map(
        (x, i) => ({
          church_id: churchId,

          day: x.day || "",

          time: x.time || "",

          name_en:
            x.name_en || "",

          name_ta:
            x.name_ta || "",

          location_en:
            x.location_en || "",

          location_ta:
            x.location_ta || "",

          sort_order: i,
        })
      );

      console.log(
        "Schedule payload:",
        payload
      );

      if (payload.length > 0) {
        await post(
          "schedule_items",
          payload
        );
      }

      await refresh();

      setMessage(
        "Schedule saved successfully."
      );
    } catch (e: any) {
      console.error(
        "SAVE SCHEDULE ERROR:",
        e
      );

      setMessage(
        e?.message ||
          e?.details ||
          "Failed to save schedule."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Save events.
   *
   * Only the current church's events are deleted.
   * New events receive the current church_id.
   */
  const saveEvents = async () => {
    const session = getSession();

    if (!session?.access_token) {
      setMessage(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const churchId =
        await getCurrentChurchId();

      console.log(
        "Saving events for church:",
        churchId
      );

      /**
       * Delete ONLY this church's events.
       */
      await remove(
        `events?church_id=eq.${churchId}`
      );

      /**
       * Build a clean payload.
       */
      const payload = ev.map(
        (x, i) => ({
          church_id: churchId,

          event_date:
            x.event_date || "",

          title_en:
            x.title_en || "",

          title_ta:
            x.title_ta || "",

          time_en:
            x.time_en || "",

          time_ta:
            x.time_ta || "",

          location_en:
            x.location_en || "",

          location_ta:
            x.location_ta || "",

          description_en:
            x.description_en || "",

          description_ta:
            x.description_ta || "",

          featured:
            Boolean(x.featured),

          sort_order: i,
        })
      );

      console.log(
        "Events payload:",
        payload
      );

      if (payload.length > 0) {
        await post(
          "events",
          payload
        );
      }

      await refresh();

      setMessage(
        "Events saved successfully."
      );
    } catch (e: any) {
      console.error(
        "SAVE EVENTS ERROR:",
        e
      );

      setMessage(
        e?.message ||
          e?.details ||
          "Failed to save events."
      );
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    signOut();

    nav(
      "/admin/login",
      {
        replace: true,
      }
    );
  };

  const tabs = [
    ...Object.keys(groups),
    "Weekly Schedule",
    //"Events",
    "Messages",
  ];

  const heroImage =
    draft["site.heroImage"] || "";

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-navy text-primary-foreground sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold">
              Church Admin
            </h1>

            <p className="text-xs text-primary-foreground/60">
              Website content manager
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-lg border border-white/15 text-sm"
            >
              <ExternalLink className="inline w-4 h-4 mr-1" />
              View site
            </a>

            <button
              onClick={logout}
              className="px-3 py-2 rounded-lg bg-white/10 text-sm"
            >
              <LogOut className="inline w-4 h-4 mr-1" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-6 grid lg:grid-cols-[230px_1fr] gap-6">
        <aside className="bg-card border border-border rounded-2xl p-3 h-fit lg:sticky lg:top-24">
          {tabs.map((x) => (
            <button
              key={x}
              onClick={() => {
                setTab(x);
                setMessage("");
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 ${
                tab === x
                  ? "bg-gold/15 text-gold font-bold"
                  : "hover:bg-muted"
              }`}
            >
              {x}
            </button>
          ))}
        </aside>

        <main className="bg-card border border-border rounded-2xl p-5 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-7">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold mb-1">
                Admin portal
              </p>

              <h2 className="font-display text-3xl font-bold">
                {tab}
              </h2>
            </div>

            {tab === "Weekly Schedule" ? (
              <button
                onClick={saveSchedules}
                disabled={saving}
                className="bg-gold px-5 py-2.5 rounded-full font-bold"
              >
                <Save className="inline w-4 h-4 mr-1" />

                {saving
                  ? "Saving…"
                  : "Save schedule"}
              </button>
            ) : tab === "Events" ? (
              <button
                onClick={saveEvents}
                disabled={saving}
                className="bg-gold px-5 py-2.5 rounded-full font-bold"
              >
                <Save className="inline w-4 h-4 mr-1" />

                {saving
                  ? "Saving…"
                  : "Save events"}
              </button>
            ) : tab === "Messages" ? null : (
              <button
                onClick={saveContent}
                disabled={saving}
                className="bg-gold px-5 py-2.5 rounded-full font-bold"
              >
                <Save className="inline w-4 h-4 mr-1" />

                {saving
                  ? "Saving…"
                  : "Save content"}
              </button>
            )}
          </div>

          {message && (
            <div className="mb-5 rounded-lg bg-muted px-4 py-3 text-sm">
              {message}
            </div>
          )}

          {/* MESSAGES */}
          {tab === "Messages" && (
            <Messages />
          )}

          {/* SITE */}
          {tab === "Site" && (
            <div className="space-y-7">
              {/* Site name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                  Site Name
                </label>

                <Input
                  value={
                    draft["site.name"] || ""
                  }
                  onChange={(v) =>
                    setDraft((d) => ({
                      ...d,
                      "site.name": v,
                    }))
                  }
                />

                <div className="mt-2">
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Tamil
                  </label>

                  <Input
                    value={
                      draft["ta.site.name"] || ""
                    }
                    onChange={(v) =>
                      setDraft((d) => ({
                        ...d,
                        "ta.site.name": v,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Hero image */}
              <HeroImageUploader
                value={heroImage}
                onChange={(url) =>
                  setDraft((d) => ({
                    ...d,
                    "site.heroImage": url,
                  }))
                }
              />
            </div>
          )}

          {/* OTHER CONTENT GROUPS */}
          {groups[tab] &&
            tab !== "Site" && (
              <div className="grid md:grid-cols-2 gap-5">
                {keys.map((key) => (
                  <div key={key}>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                      {key}
                    </label>

                    <Input
                      value={
                        draft[
                          `en.${key}`
                        ] || ""
                      }
                      onChange={(v) =>
                        setDraft((d) => ({
                          ...d,
                          [`en.${key}`]:
                            v,
                        }))
                      }
                      multiline={isLong(key)}
                    />

                    <div className="mt-2">
                      <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                        Tamil
                      </label>

                      <Input
                        value={
                          draft[
                            `ta.${key}`
                          ] || ""
                        }
                        onChange={(v) =>
                          setDraft((d) => ({
                            ...d,
                            [`ta.${key}`]:
                              v,
                          }))
                        }
                        multiline={isLong(key)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* WEEKLY SCHEDULE */}
          {tab === "Weekly Schedule" && (
            <div className="space-y-4">
              {sch.map((x, i) => (
                <div
                  key={i}
                  className="border border-border rounded-xl p-4 grid md:grid-cols-7 gap-3"
                >
                  <Input
                    value={x.day}
                    onChange={(v) =>
                      setSch((a) =>
                        a.map((z, j) =>
                          j === i
                            ? {
                                ...z,
                                day: v,
                              }
                            : z
                        )
                      )
                    }
                  />

                  <Input
                    value={x.time}
                    onChange={(v) =>
                      setSch((a) =>
                        a.map((z, j) =>
                          j === i
                            ? {
                                ...z,
                                time: v,
                              }
                            : z
                        )
                      )
                    }
                  />

                  <Input
                    value={x.name_en}
                    onChange={(v) =>
                      setSch((a) =>
                        a.map((z, j) =>
                          j === i
                            ? {
                                ...z,
                                name_en: v,
                              }
                            : z
                        )
                      )
                    }
                  />

                  <Input
                    value={x.name_ta}
                    onChange={(v) =>
                      setSch((a) =>
                        a.map((z, j) =>
                          j === i
                            ? {
                                ...z,
                                name_ta: v,
                              }
                            : z
                        )
                      )
                    }
                  />

                  <Input
                    value={x.location_en}
                    onChange={(v) =>
                      setSch((a) =>
                        a.map((z, j) =>
                          j === i
                            ? {
                                ...z,
                                location_en: v,
                              }
                            : z
                        )
                      )
                    }
                  />

                  <Input
                    value={x.location_ta}
                    onChange={(v) =>
                      setSch((a) =>
                        a.map((z, j) =>
                          j === i
                            ? {
                                ...z,
                                location_ta: v,
                              }
                            : z
                        )
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setSch((a) =>
                        a.filter(
                          (_, j) =>
                            j !== i
                        )
                      )
                    }
                    className="text-red-600"
                  >
                    <Trash2 className="inline w-4 h-4" />{" "}
                    Delete
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setSch((a) => [
                    ...a,
                    {
                      day: "Sunday",
                      time: "",
                      name_en:
                        "New service",
                      name_ta:
                        "புதிய ஆராதனை",
                      location_en:
                        "",
                      location_ta:
                        "",
                      sort_order:
                        a.length,
                    },
                  ])
                }
                className="border border-border rounded-lg px-4 py-2"
              >
                <Plus className="inline w-4 h-4" />{" "}
                Add service
              </button>
            </div>
          )}

          {/* EVENTS */}
          {tab === "Events" && (
            <div className="space-y-5">
              {ev.map((x, i) => (
                <div
                  key={i}
                  className="border border-border rounded-xl p-4 space-y-3"
                >
                  <div className="grid md:grid-cols-3 gap-3">
                    <Input
                      value={
                        x.event_date
                      }
                      onChange={(v) =>
                        setEv((a) =>
                          a.map(
                            (z, j) =>
                              j === i
                                ? {
                                    ...z,
                                    event_date:
                                      v,
                                  }
                                : z
                          )
                        )
                      }
                    />

                    <Input
                      value={
                        x.title_en
                      }
                      onChange={(v) =>
                        setEv((a) =>
                          a.map(
                            (z, j) =>
                              j === i
                                ? {
                                    ...z,
                                    title_en:
                                      v,
                                  }
                                : z
                          )
                        )
                      }
                    />

                    <Input
                      value={
                        x.title_ta
                      }
                      onChange={(v) =>
                        setEv((a) =>
                          a.map(
                            (z, j) =>
                              j === i
                                ? {
                                    ...z,
                                    title_ta:
                                      v,
                                  }
                                : z
                          )
                        )
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      value={
                        x.time_en
                      }
                      onChange={(v) =>
                        setEv((a) =>
                          a.map(
                            (z, j) =>
                              j === i
                                ? {
                                    ...z,
                                    time_en:
                                      v,
                                  }
                                : z
                          )
                        )
                      }
                    />

                    <Input
                      value={
                        x.time_ta
                      }
                      onChange={(v) =>
                        setEv((a) =>
                          a.map(
                            (z, j) =>
                              j === i
                                ? {
                                    ...z,
                                    time_ta:
                                      v,
                                  }
                                : z
                          )
                        )
                      }
                    />

                    <Input
                      value={
                        x.location_en
                      }
                      onChange={(v) =>
                        setEv((a) =>
                          a.map(
                            (z, j) =>
                              j === i
                                ? {
                                    ...z,
                                    location_en:
                                      v,
                                  }
                                : z
                          )
                        )
                      }
                    />

                    <Input
                      value={
                        x.location_ta
                      }
                      onChange={(v) =>
                        setEv((a) =>
                          a.map(
                            (z, j) =>
                              j === i
                                ? {
                                    ...z,
                                    location_ta:
                                      v,
                                  }
                                : z
                          )
                        )
                      }
                    />

                    <Input
                      value={
                        x.description_en
                      }
                      onChange={(v) =>
                        setEv((a) =>
                          a.map(
                            (z, j) =>
                              j === i
                                ? {
                                    ...z,
                                    description_en:
                                      v,
                                  }
                                : z
                          )
                        )
                      }
                    />

                    <Input
                      value={
                        x.description_ta
                      }
                      onChange={(v) =>
                        setEv((a) =>
                          a.map(
                            (z, j) =>
                              j === i
                                ? {
                                    ...z,
                                    description_ta:
                                      v,
                                  }
                                : z
                          )
                        )
                      }
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(
                          x.featured
                        )}
                        onChange={(e) =>
                          setEv((a) =>
                            a.map(
                              (z, j) =>
                                j === i
                                  ? {
                                      ...z,
                                      featured:
                                        e
                                          .target
                                          .checked,
                                    }
                                  : z
                            )
                          )
                        }
                        className="mr-2"
                      />
                      Featured event
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setEv((a) =>
                          a.filter(
                            (_, j) =>
                              j !== i
                          )
                        )
                      }
                      className="text-red-600"
                    >
                      <Trash2 className="inline w-4 h-4" />{" "}
                      Delete event
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setEv((a) => [
                    ...a,
                    {
                      event_date:
                        new Date()
                          .toISOString()
                          .slice(
                            0,
                            10
                          ),

                      title_en:
                        "New event",

                      title_ta:
                        "புதிய நிகழ்வு",

                      time_en: "",

                      time_ta: "",

                      location_en:
                        "",

                      location_ta:
                        "",

                      description_en:
                        "",

                      description_ta:
                        "",

                      featured:
                        false,

                      sort_order:
                        a.length,
                    },
                  ])
                }
                className="border border-border rounded-lg px-4 py-2"
              >
                <Plus className="inline w-4 h-4" />{" "}
                Add event
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}