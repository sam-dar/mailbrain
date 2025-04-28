"use client";

import React, { useState } from "react";

const SendEmailPage = () => {
  const [subject, setSubject] = useState("");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Form submission started");
    try {
      const emailData = {
        subject,
        sender,
        recipient: recipient
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean),
        cc: cc
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean),
        bcc: bcc
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean),
        body,
      };
      console.log("Email data to be sent:", emailData);

      const response = await fetch("/api/store-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        alert("Email data submitted successfully!");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000); // 1000ms = 1 second delay before redirecting
      } else {
        console.error("Failed to submit email data. Response:", response);
        alert("Failed to submit email data.");
      }
    } catch (error) {
      console.error("Error submitting email data:", error);
    } finally {
      setIsLoading(false);
      console.log("Form submission ended");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600  px-8 rounded-2xl">

    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-12">Store Email</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          name="sender"
          placeholder="Sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="recipient"
          placeholder="Recipient (comma separated)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="cc"
          placeholder="CC (comma separated)"
          value={cc}
          onChange={(e) => setCc(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="bcc"
          placeholder="BCC (comma separated)"
          value={bcc}
          onChange={(e) => setBcc(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          name="body"
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className={`w-full p-2 rounded ${isLoading ? "bg-gray-400" : "bg-blue-500 text-white"}`}
          disabled={isLoading}
        >
          {isLoading ? "Storing..." : "Store Email"}
        </button>
      </form>
    </div>
    </main>
  );
};

export default SendEmailPage;
