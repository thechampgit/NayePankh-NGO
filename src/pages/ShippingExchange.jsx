import { Truck } from 'lucide-react';

export default function ShippingExchange() {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-70 md:py-85 overflow-hidden bg-cover bg-[center_20%] bg-no-repeat border-b border-slate-200 pt-36 md:pt-44"
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
            Shipping & Exchange Policy
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-bold">
            Policy regarding delivery of certificates, receipts, materials, and charity items.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-8 text-slate-800 dark:text-slate-200">
          <div className="flex items-start gap-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900/30 p-6 rounded-2xl text-primary-800 dark:text-primary-400">
            <Truck className="h-6 w-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base mb-1">Receipts & Official Documents Delivery</h3>
              <p className="text-sm text-primary-850 leading-relaxed">
                NayePankh Foundation provides physical and digital tax benefit certificates (Form 10BE / 80G receipts) and donor certification directly to our contributors.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">1. Digital Delivery</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Upon successful completion of a donation, a digital payment confirmation receipt is sent instantly to your registered email address. Official 80G Tax Benefit certificates are generated quarterly or annually and sent via email. There are no shipping charges for digital certificate distribution.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">2. Physical Shipping of Campaign Kits</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              If you request printed certificates, donor appreciation shields, or volunteer training manuals:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 text-sm space-y-2">
              <li>Documents and kits are dispatched via registered domestic courier partners within 7-10 working days.</li>
              <li>Estimated delivery timelines range between 3 to 7 working days depending on the location.</li>
              <li>We only ship to valid residential or commercial physical addresses in India. We do not ship to P.O. boxes.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">3. Exchange & Replacement Policy</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Since physical materials shipped are non-commercial items (volunteer t-shirts, welcome kits, badges), we do not offer typical commercial exchanges. However:
            </p>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 text-sm space-y-2">
              <li>If you receive a damaged appreciation certificate or wrong size volunteer t-shirt, notify us within 5 days of delivery.</li>
              <li>We will gladly reprint and ship a replacement document or kit free of charge.</li>
              <li>Requests can be initiated by writing to <strong className="text-slate-900">contact@nayepankh.com</strong> along with photos of the damaged item.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
