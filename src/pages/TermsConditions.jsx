
export default function TermsConditions() {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-80 md:py-90 overflow-hidden bg-cover bg-[center_20%] bg-no-repeat border-b border-slate-200 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/policies-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-[2px] z-0" />
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[100px] z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <img 
            src="/logo.png" 
            className="h-20 w-20 object-contain mx-auto bg-white rounded-3xl p-1 shadow-lg mb-4 border border-slate-100 transition-transform duration-300 hover:scale-105" 
            alt="NayePankh Logo" 
          />
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-display text-[#132a13] dark:text-[#a3b899] drop-shadow-sm">
            Terms & Conditions
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-bold">
            Rules and guidelines governing your use of the NayePankh Foundation website.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-8 text-slate-800 dark:text-slate-200">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">1. Acceptance of Terms</h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>Welcome to NayePankh Foundation (“Foundation,” “we,” “us,” or “our”). These Terms and Conditions (“Terms”) govern your use of our website, services, donations, and subscription programs made available through www.nayepankh.com</p>
              <p>By accessing our website, making a donation, or subscribing to our recurring donation program, you agree to be legally bound by these Terms. If you do not agree, you should immediately discontinue the use of our website and services.</p>
              <p>NayePankh Foundation is a registered non-profit organization under the Societies Registration Act, 1860, holding valid 12A and 80G certification under the Income Tax Act, 1961.</p>
              <p>By accessing and using this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree, please do not use this site.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">2. Eligibility</h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>By using this website, you represent and warrant that:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>You are at least 18 years of age or have the consent of a parent/guardian.</li>
                <li>You are legally competent to enter into a binding agreement under the Indian Contract Act, 1872.</li>
                <li>You are not barred by any law, regulation, or governmental authority from making donations or using online payment services.</li>
              </ol>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">3. Use of Site Content</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              All materials including photos, graphics, texts, logos, and layout are copyright of NayePankh Foundation unless stated otherwise. You may view and print content from the website solely for personal, educational, and non-commercial purposes. Any unauthorized reproduction, modification, or distribution is strictly prohibited.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">4. Disclaimer and Limitation of Liability</h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>The website and services are provided “as is” and “as available” without warranties of any kind.</p>
              <p>The Foundation shall not be liable for:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Any errors or delays in processing payments due to banking channels.</li>
                <li>Unauthorized use of your account or payment method.</li>
                <li>Losses arising from system downtime, technical glitches, or cyberattacks.</li>
                <li>Donors acknowledge that contributions are charitable in nature and not commercial transactions, and therefore standard consumer protection laws may not apply.</li>
              </ol>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">5. Indemnification</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              You agree to indemnify and hold harmless NayePankh Foundation, its trustees, employees, and partners from any claims, damages, or expenses arising from your use of the website or violation of these Terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">6. Termination</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              We reserve the right to suspend or terminate your access to the website and services at our sole discretion if you breach these Terms or engage in unlawful activities.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">7. Modifications to Terms</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              The Foundation reserves the right to update, modify, or replace these Terms at any time without prior notice. Continued use of the website constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">8. Governing Law and Jurisdiction</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts located in Ghaziabad, Uttar Pradesh.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">9. Contact Information</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              If you have any questions or require support regarding your transactions:
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Email: <span className="font-semibold text-slate-950">contact@nayepankh.com</span><br />
              Phone: <span className="font-semibold text-slate-950">+91-8318500748</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
