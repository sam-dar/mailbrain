import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 rounded-2xl">
      <h1 className="text-5xl font-bold mb-6 text-center drop-shadow-lg">MailBrain</h1>
      <p className="text-lg max-w-md text-center mb-8 leading-relaxed">
        With MailBrain, securely stores your emails and lets you ask questions about them. Whether it's finding specific details or summarizing conversations, MailBrain's AI scans your saved emails to generate precise answers.
      </p>
      <div className="flex gap-6">
        <Link href="/store-email" className="px-6 py-3 bg-indigo-700 rounded-md font-semibold text-white hover:bg-indigo-500 transition shadow-md">
          Store Emails
        </Link>
        <Link href="/ask-ai" className="px-6 py-3 bg-purple-700 rounded-md font-semibold text-white hover:bg-purple-500 transition shadow-md">
          Ask AI
        </Link>
      </div>
    </main>
  );
}
