import MessagesView from "@/components/candidate/messages/MessagesView";
import SEO from "@/components/SEO";

export default function MessagesPage() {
  return (
    <>
      <SEO
        props={{
          title: "Messages | AIJobFit",
          description: "Communicate directly with recruiters and employers on the AIJobFit platform.",
          keywords: "messages, recruiter chat, AIJobFit messages",
          url: "/candidate/messages",
        }}
      />
      <main className="w-full min-h-screen bg-surface">
        <MessagesView />
      </main>
    </>
  );
}
