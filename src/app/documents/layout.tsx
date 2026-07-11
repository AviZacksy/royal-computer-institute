export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex justify-center py-5 print:bg-white print:py-0 print:block print:min-h-0">
      <style>{`
        @media print {
          body, html {
            height: auto !important;
            min-height: auto !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="flex w-full flex-col items-center">
        {children}
      </div>
    </div>
  );
}
