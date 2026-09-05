import { useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import {
  get,
  patch,
  remove,
} from "@/lib/supabase";

type ContactMessage = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] =
    useState<ContactMessage | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    setError("");

    try {
      const rows = await get(
        "contact_messages?select=*&order=created_at.desc"
      );

      setMessages(Array.isArray(rows) ? rows : []);
    } catch (err: any) {
      console.error("Failed to load messages:", err);

      setError(
        err?.message ||
          "Unable to load messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const openMessage = async (
    message: ContactMessage
  ) => {
    setSelected(message);

    if (!message.is_read) {
      try {
        await patch(
          `contact_messages?id=eq.${encodeURIComponent(
            message.id
          )}`,
          {
            is_read: true,
          }
        );

        setMessages((current) =>
          current.map((item) =>
            item.id === message.id
              ? { ...item, is_read: true }
              : item
          )
        );

        setSelected({
          ...message,
          is_read: true,
        });
      } catch (err) {
        console.error(
          "Failed to mark message as read:",
          err
        );
      }
    }
  };

  const toggleRead = async (
    message: ContactMessage
  ) => {
    try {
      const newValue = !message.is_read;

      await patch(
        `contact_messages?id=eq.${encodeURIComponent(
          message.id
        )}`,
        {
          is_read: newValue,
        }
      );

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                is_read: newValue,
              }
            : item
        )
      );

      if (selected?.id === message.id) {
        setSelected({
          ...message,
          is_read: newValue,
        });
      }
    } catch (err) {
      console.error(
        "Failed to update message:",
        err
      );
    }
  };

  const deleteMessage = async (
    message: ContactMessage
  ) => {
    const confirmed = window.confirm(
      "Delete this message permanently?"
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      await remove(
        `contact_messages?id=eq.${encodeURIComponent(
          message.id
        )}`
      );

      setMessages((current) =>
        current.filter(
          (item) => item.id !== message.id
        )
      );

      if (selected?.id === message.id) {
        setSelected(null);
      }
    } catch (err: any) {
      console.error(
        "Failed to delete message:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete message."
      );
    } finally {
      setDeleting(false);
    }
  };

  const unreadCount = messages.filter(
    (message) => !message.is_read
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">
          Loading messages...
        </div>
      </div>
    );
  }

  if (selected) {
    const senderName = [
      selected.first_name,
      selected.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Messages
          </button>

          <button
            type="button"
            onClick={() =>
              toggleRead(selected)
            }
            className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            {selected.is_read ? (
              <>
                <Mail className="w-4 h-4" />
                Mark unread
              </>
            ) : (
              <>
                <MailOpen className="w-4 h-4" />
                Mark read
              </>
            )}
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {senderName}
                </h2>

                {selected.email && (
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {selected.email}
                  </a>
                )}
              </div>

              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(
                  selected.created_at
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="whitespace-pre-wrap text-sm leading-7">
              {selected.message}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex justify-end">
            <button
              type="button"
              disabled={deleting}
              onClick={() =>
                deleteMessage(selected)
              }
              className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Messages
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Messages submitted through the church website.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* UNREAD COUNT */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-sm text-muted-foreground">
          Unread messages
        </div>

        <div className="text-3xl font-bold mt-1">
          {unreadCount}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 border border-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {messages.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <Mail className="w-10 h-10 mx-auto text-muted-foreground mb-3" />

          <h3 className="font-semibold">
            No messages yet
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            Messages submitted from the website will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="divide-y divide-border">
            {messages.map((message) => {
              const senderName = [
                message.first_name,
                message.last_name,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={message.id}
                  className={`p-5 hover:bg-muted/40 transition-colors ${
                    !message.is_read
                      ? "bg-primary/5"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {message.is_read ? (
                        <MailOpen className="w-5 h-5" />
                      ) : (
                        <Mail className="w-5 h-5" />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openMessage(message)
                      }
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`font-semibold truncate ${
                              !message.is_read
                                ? "font-bold"
                                : ""
                            }`}
                          >
                            {senderName}
                          </span>

                          {!message.is_read && (
                            <span className="flex-shrink-0 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                              New
                            </span>
                          )}
                        </div>

                        <span className="flex-shrink-0 text-xs text-muted-foreground">
                          {new Date(
                            message.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      {message.email && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {message.email}
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {message.message}
                      </p>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title={
                          message.is_read
                            ? "Mark unread"
                            : "Mark read"
                        }
                        onClick={() =>
                          toggleRead(message)
                        }
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        {message.is_read ? (
                          <Mail className="w-4 h-4" />
                        ) : (
                          <MailOpen className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() =>
                          deleteMessage(message)
                        }
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

