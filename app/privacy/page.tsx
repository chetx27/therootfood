import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Privacy Policy | TheRootFood",
  description: "Privacy Policy for TheRootFood",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 md:px-6 py-24 max-w-3xl">
        <h1 className="text-4xl font-bold font-heading mb-8">Privacy Policy</h1>
        <div className="space-y-4 leading-relaxed text-white/85 [&_h2]:mt-10 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            At TheRootFood, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
          </p>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you fill out an enquiry form or contact us via WhatsApp. This may include your name, phone number, email address, and any other details you choose to provide.
          </p>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to respond to your enquiries, process your orders, communicate with you about our products, and improve our services.
          </p>
          <h2>3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <h2>4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at therootfoodsupport@gmail.com.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
