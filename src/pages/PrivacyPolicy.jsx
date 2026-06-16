
export default function PrivacyPolicy() {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-80 overflow-hidden bg-cover bg-[center_20%] bg-no-repeat border-b border-slate-200 pt-36 md:pt-44"
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
            Privacy & Policy
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-bold">
            How NayePankh Foundation collects, protects, and handles your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-8 text-slate-800 dark:text-slate-200">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">1. Information Collection</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              We collect information you provide voluntarily when making donations, register for events, or apply for volunteering. This includes names, emails, phone numbers, addresses, PAN card details (for tax receipts), and payment information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">2. Use of Information</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Your information is used strictly to process donations, email donation receipts, submit tax returns to statutory bodies (such as the Income Tax Department for 80G tax deductions), register you for requested events, and send newsletters detailing campaign updates.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">3. Data Security</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              We implement industry-standard encryption, SSL protocols, and secure cloud databases (like Firebase Firestore) to protect your personal details from unauthorized access, loss, or alteration. All financial transactions are processed by certified third-party payment gateways (like Razorpay) and no card details are stored directly on our servers.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">4. Third-Party Sharing</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              NayePankh Foundation does not sell, rent, or trade your personal information. Data is shared with third parties only when required by law (e.g. tax filing obligations) or when essential to perform tasks on our behalf (such as secure email services and transaction processing).
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">5. Your Rights</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              You have the right to request access, correction, or deletion of your personal details stored in our databases. To exercise this right, or to unsubscribe from marketing newsletters, please write to us at <strong className="text-slate-900">contact@nayepankh.com</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
