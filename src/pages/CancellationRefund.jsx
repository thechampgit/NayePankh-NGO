import { AlertCircle } from 'lucide-react';

export default function CancellationRefund() {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-70 md:py-80 overflow-hidden bg-cover bg-[center_20%] bg-no-repeat border-b border-slate-200 pt-36 md:pt-44"
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
            Cancellation & Refund Policy
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-bold">
            Understand how NayePankh Foundation handles transactions, event registrations, and donation refunds.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-8 text-slate-800 dark:text-slate-200">
          <div className="flex items-start gap-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-6 rounded-2xl text-amber-800 dark:text-amber-400">
            <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base mb-1">Important Information for Donors</h3>
              <p className="text-sm text-amber-850 leading-relaxed">
                As a non-profit organization carrying out charitable activities, NayePankh Foundation utilizes contributions immediately to secure educational kits, medical supplies, and basic food items for underprivileged communities.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">1. Donation Refunds</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              All financial donations made to NayePankh Foundation are voluntary. 
                 Once a donation is processed through Razorpay or any payment gateway linked to our website, it is generally considered non-refundable. The amount is instantly deployed for charitable purposes.
                 Neither partial nor full refunds will be provided, regardless of the reason for the request We request donors to exercise caution and carefully verify the details before making contributions.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">2. Exception Cases</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              If an unauthorized transaction or an accidental duplicate donation occurs due to a technical error in the payment gateway, NayePankh will review requests on a case-by-case basis. To request a refund review:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 text-sm space-y-2">
              <li>Submit a written refund application via email to <strong className="text-slate-900">contact@nayepankh.com</strong> within 7 days of the transaction.</li>
              <li>Provide proof of transaction, payment gateway receipt, and valid proof of identity.</li>
              <li>Allow 10-15 business days for our finance team to review the submission and communicate resolution status.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">3. Event Cancellation</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              For any ticketed fundraising events, campaigns, or volunteer activities, registration fees or passes are non-refundable. In the event that a program is canceled by NayePankh Foundation due to unforeseen circumstances, the registration fees will either be refunded or credited as a direct tax-deductible donation, based on the registered participant's preference.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">4. Donor Responsibility in Providing Correct Details</h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-4">
              <p>Donors are solely responsible for entering accurate personal, email, and payment details when making a donation.</p>
              <p>Incorrect details may result in:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Receipts not being generated.</li>
                <li>80G certificates being delayed or misdirected.</li>
                <li>Subscription cancellation issues.</li>
              </ul>
              <p>NayePankh Foundation will not be held liable for consequences arising from donor errors in submission.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">5. Processing Timelines with Payment Gateways</h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>All payments are processed securely by Razorpay, which follows PCI-DSS standards.</p>
              <p>While we receive donation confirmations instantly, cancellation of recurring subscriptions depends on the gateway’s internal processing timelines.</p>
              <p>NayePankh Foundation has no control over delays caused by the payment processor or the donor’s issuing bank.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">6. Chargebacks & Disputes Handling</h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
              <p>If a donor raises a chargeback (dispute) with their bank or card issuer:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>NayePankh Foundation will provide proof of donation authorization and utilization of funds.</li>
                <li>Since donations are voluntary and instantly applied, chargebacks will generally be denied by banks after review.</li>
              </ul>
              <p>Donors are advised to contact us first for any queries before initiating disputes with financial institutions.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">7. Final Declaration</h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-4">
              <p>By making a donation or subscription through our website, you expressly agree that:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All donations are final and non-refundable.</li>
                <li>You understand that funds are utilized immediately.</li>
                <li>You will not seek chargebacks, disputes, or legal claims for refunds.</li>
              </ul>
              <p>This policy ensures transparency while protecting the sustainability of our programs and beneficiaries who depend on timely financial support.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">8. Contact Information</h2>
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
