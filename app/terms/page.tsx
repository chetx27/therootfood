import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Terms of Service | TheRootFood",
  description: "Terms of Service for TheRootFood",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 md:px-6 py-24 max-w-3xl">
        <h1 className="text-4xl font-bold font-heading mb-8">Terms of Service</h1>
        <div className="space-y-4 leading-relaxed text-white/85 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            Welcome to TheRootFood. By accessing or using our website, you agree to comply with and be bound by these Terms of Service.
          </p>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          <h2>2. Use of Service</h2>
          <p>
            You agree to use our website and services only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else&apos;s use and enjoyment of the website.
          </p>
          <h2>3. Orders and Enquiries</h2>
          <p>
            All orders and enquiries placed through our website are subject to availability and acceptance. We reserve the right to refuse or cancel any order or enquiry for any reason at any time.
          </p>
          <h2>4. Modifications</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. We do so by posting and drawing attention to the updated terms on the Site. Your decision to continue to visit and make use of the Site after such changes have been made constitutes your formal acceptance of the new Terms of Service.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
