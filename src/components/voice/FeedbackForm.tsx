"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function FeedbackForm() {
  const [memberName, setMemberName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_name: memberName,
          contact_info: contactInfo,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ส่งไม่สำเร็จ");
      }

      setStatus("success");
      setMemberName("");
      setContactInfo("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
  }

  if (status === "success") {
    return (
      <div
        className="card border-[var(--color-accent)] bg-[var(--color-bg)]"
        role="status"
      >
        <p className="text-heading-sm font-bold text-[var(--color-accent)]">
          ขอบคุณสำหรับข้อเสนอแนะ
        </p>
        <p className="prose-accessible mt-2">
          เราได้รับข้อความของท่านแล้ว และจะนำไปพิจารณาอย่างจริงจัง
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          ส่งข้อความใหม่
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6" noValidate>
      <div>
        <label htmlFor="member_name" className="block text-body-lg font-semibold">
          ชื่อ (ไม่บังคับ)
        </label>
        <input
          id="member_name"
          type="text"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          className="mt-2 w-full min-h-touch rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring"
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="contact_info" className="block text-body-lg font-semibold">
          ช่องทางติดต่อ (ไม่บังคับ)
        </label>
        <input
          id="contact_info"
          type="text"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder="เบอร์โทร หรืออีเมล"
          className="mt-2 w-full min-h-touch rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-body-lg font-semibold">
          ข้อความ <span className="text-red-700">*</span>
        </label>
        <textarea
          id="message"
          required
          minLength={10}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-body-lg focus-visible:focus-ring"
          placeholder="กรุณาเขียนข้อเสนอแนะอย่างน้อย 10 ตัวอักษร"
        />
      </div>
      {status === "error" && (
        <p className="text-body font-semibold text-red-700" role="alert">
          {errorMsg}
        </p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "กำลังส่ง..." : "ส่งข้อเสนอแนะ"}
      </Button>
    </form>
  );
}
