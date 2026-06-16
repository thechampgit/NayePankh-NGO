import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Heart, ArrowRight, ShieldCheck, Download, Calendar, Mail, User, X } from 'lucide-react';

export default function DonationSuccess() {
  const location = useLocation();
  const { amount, paymentId, email, name, category } = location.state || {
    amount: 1500,
    paymentId: 'rzp_test_mock1234567',
    email: 'guest@example.com',
    name: 'Guest Donor',
    category: 'General'
  };

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const g = (n) => {
      if (n < 20) return a[n];
      const digit = n % 10;
      return b[Math.floor(n / 10)] + (digit ? '-' + a[digit] : '');
    };
    
    const c = (n) => {
      let str = '';
      if (n >= 100) {
        str += a[Math.floor(n / 100)] + 'Hundred ';
        n %= 100;
      }
      if (n > 0) {
        str += g(n);
      }
      return str;
    };

    if (num === 0) return 'Zero';
    let words = '';
    if (Math.floor(num / 10000000) > 0) {
      words += c(Math.floor(num / 10000000)) + 'Crore ';
      num %= 10000000;
    }
    if (Math.floor(num / 100000) > 0) {
      words += c(Math.floor(num / 100000)) + 'Lakh ';
      num %= 100000;
    }
    if (Math.floor(num / 1000) > 0) {
      words += c(Math.floor(num / 1000)) + 'Thousand ';
      num %= 1000;
    }
    if (num > 0) {
      words += c(num);
    }
    return words.trim() + ' Rupees Only';
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-70 md:py-82 overflow-hidden bg-cover bg-[center_35%] bg-no-repeat border-b border-slate-200 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/donate-bg.jpg')" }}
      >
        {/* Semi-transparent light overlay for image visibility and text readability */}
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-[2px] z-0" />
        
        {/* Soft decorative gradient glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[100px] z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="flex justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              Contribution Received
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-slate-900 drop-shadow-sm">
            Thank You for Sponsoring!
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm max-w-xl mx-auto leading-relaxed font-bold">
            Your support gives wings to our initiatives, helping us expand child learning centers and deliver basic resources directly to communities.
          </p>
        </div>
      </section>

      {/* Detail Summary Area */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-8 sm:p-12 shadow-lg space-y-8 relative overflow-hidden text-slate-800 dark:text-slate-200">
            {/* Top success badge */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/30 shadow-inner group">
                <CheckCircle2 className="h-12 w-12 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display">Payment Successful!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Your transaction has been recorded. Reference ID: <span className="font-mono font-bold text-slate-700">{paymentId}</span>
              </p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="border border-slate-150 dark:border-slate-750 rounded-2xl p-6 bg-slate-50/45 dark:bg-slate-900/30 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-150 pb-2">
                Donation Summary
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-slate-450 dark:text-slate-400 font-bold block text-xs uppercase tracking-wider">Sponsor Name</span>
                  <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 font-bold">
                    <User className="h-4 w-4 text-slate-400" />
                    <span>{name}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-450 font-bold block text-xs uppercase tracking-wider">Registered Email</span>
                  <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 font-bold">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-450 font-bold block text-xs uppercase tracking-wider">Contribution Date</span>
                  <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 font-bold">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{today}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-450 font-bold block text-xs uppercase tracking-wider">Tax Exemption Section</span>
                  <div className="flex items-center space-x-1.5 text-emerald-650 font-bold">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Section 80G Certified</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-200 my-4" />

              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-black text-slate-900 dark:text-white">Total Contribution:</span>
                <span className="text-3xl font-black text-primary-600 font-display">
                  ₹{parseInt(amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Tax receipt generation info */}
            <div className="p-5 bg-primary-50/45 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 rounded-2xl flex items-start space-x-4">
              <ShieldCheck className="h-6 w-6 text-primary-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="text-sm font-extrabold text-slate-900">Tax Exemption Details (80G)</h4>
                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Your donation qualifies for a 50% tax exemption under Section 80G of the Income Tax Act. A formal receipt containing our registration credentials has been sent to <strong className="text-slate-900 dark:text-white">{email}</strong>.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => setShowReceiptModal(true)}
                className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-750 text-white font-bold text-sm text-center shadow transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer animate-pulse"
              >
                <Download className="h-4 w-4" />
                <span>Download / Print 80G Tax Receipt</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I just donated ₹${parseInt(amount).toLocaleString('en-IN')} to NayePankh Foundation ❤️`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm text-center shadow transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer hover:shadow-emerald-500/10 hover:-translate-y-0.5"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.463h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Share on WhatsApp</span>
              </a>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/donation-history"
                  className="w-full sm:w-1/2 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm text-center shadow transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>View Donation History</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-1/2 py-4 rounded-xl border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-bold text-sm text-center transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Heart className="h-4 w-4 fill-primary-500 text-primary-500" />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Printable Receipt CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt-content, #printable-receipt-content * {
            visibility: visible !important;
          }
          #printable-receipt-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 800px !important;
            z-index: 99999 !important;
            background: white !important;
            padding: 30px !important;
            margin: 0 auto !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {showReceiptModal && (
        <div id="printable-receipt-container" className="fixed inset-0 bg-slate-955/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative border border-slate-200">
            {/* Modal Actions - hidden when printing */}
            <div className="flex justify-between items-center mb-6 no-print">
              <h4 className="text-lg font-bold text-slate-955 font-display flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-primary-600" />
                <span>Tax Exemption Receipt (80G)</span>
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-750 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Print Receipt / PDF</span>
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-450 hover:text-slate-600 dark:text-slate-300 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Content Frame */}
            <div id="printable-receipt-content" className="bg-white border-2 border-slate-300 p-8 sm:p-12 text-slate-800 rounded-2xl relative font-sans text-sm" style={{ minHeight: '600px', color: '#1e293b' }}>
              {/* Receipt Header Grid */}
              <div className="grid grid-cols-12 gap-4 border-b-2 border-slate-200 pb-6 items-center">
                <div className="col-span-3">
                  <img src="/logo.png" className="h-20 w-20 object-contain bg-white rounded-2xl p-1 border border-slate-100 shadow-sm" alt="NayePankh Logo" />
                </div>
                <div className="col-span-9 text-right font-semibold">
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display uppercase">NayePankh Foundation</h2>
                  <p className="text-xs font-bold text-primary-600 mt-0.5">80G Tax-Exempt Contribution Receipt</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">
                    Registered office: 12A/45, Kidwai Nagar, Kanpur, Uttar Pradesh - 208011<br />
                    Email: contact@nayepankh.com | Website: www.nayepankh.com<br />
                    Govt Registration No: URN-AAATN1234F21GP01 (Sec 80G Approval)
                  </p>
                </div>
              </div>

              {/* Title Section */}
              <div className="my-6 text-center bg-slate-55 border border-slate-200 py-2.5 rounded-xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
                  Receipt for Donation under Section 80G of Income Tax Act, 1961
                </span>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-slate-100 pb-6 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Receipt Number</span>
                  <span className="font-mono font-bold text-slate-900">REC-{paymentId?.substring(paymentId.length - 8).toUpperCase() || 'MOCK'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Date of Donation</span>
                  <span className="font-bold text-slate-900">{dateStr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Donor Name</span>
                  <span className="font-bold text-slate-900">{name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Donor Email</span>
                  <span className="font-bold text-slate-900">{email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Payment Method</span>
                  <span className="font-bold text-slate-900 capitalize">ONLINE</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Transaction Reference ID</span>
                  <span className="font-mono text-xs text-slate-600 font-bold">{paymentId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Dedicated Cause / Category</span>
                  <span className="font-bold text-slate-900">{category || 'General Support'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">PAN (Income Tax Dept)</span>
                  <span className="font-mono text-slate-500 font-semibold italic border-b border-slate-300 border-dashed pb-0.5 min-w-[120px] inline-block">As per profile record</span>
                </div>
              </div>

              {/* Amount Statement block */}
              <div className="py-6 border-b border-slate-200 space-y-3">
                <div className="flex justify-between items-center bg-primary-50/5 border border-primary-100/20 p-4 rounded-xl">
                  <span className="text-sm font-bold text-slate-800">Total Amount Received:</span>
                  <span className="text-xl font-black text-primary-600 font-display">₹{amount?.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Amount in Words</span>
                  <span className="font-bold text-slate-800 text-sm">{numberToWords(amount)}</span>
                </div>
              </div>

              {/* Signatures & Seal section */}
              <div className="pt-8 flex justify-between items-center">
                {/* Stamp */}
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-dashed border-primary-500/60 text-center select-none rotate-[-6deg]">
                  <div className="text-[9px] font-black uppercase text-primary-600 p-1 tracking-tighter leading-none">
                    NayePankh Foundation<br />
                    <span className="text-[7px] font-bold text-slate-500">Sec 80G Certified</span><br />
                    ★ KANPUR ★
                  </div>
                </div>

                {/* Signatory */}
                <div className="text-right space-y-1">
                  <span className="font-serif italic font-bold text-primary-600 text-xl block pb-1 border-b border-slate-200">Prashant Shukla</span>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Authorized Signatory</span>
                  <span className="text-xs font-bold text-slate-900 block">Founder & President</span>
                  <span className="text-[10px] text-slate-500 block">NayePankh Foundation</span>
                </div>
              </div>

              {/* Exemption Note */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed text-center space-y-1">
                <p className="font-bold text-slate-700">
                  Donations to NayePankh Foundation are eligible for tax deduction under Section 80G(5)(vi) of the Income Tax Act, 1961.
                </p>
                <p>
                  This is a computer-generated document and does not require a physical signature.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
