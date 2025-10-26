import MatchForm from "@/components/MatchForm";
import dynamic from "next/dynamic";

const StatsSection = dynamic(() => import("@/components/StatsSection"));

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MatchForm />
        <StatsSection />
      </div>
    </main>
  );
}
