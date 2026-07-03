export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background-color: white !important;
            }
            .no-print {
              display: none !important;
            }
            @page {
              size: auto;
              margin: 0;
            }
          }
          body {
            background-color: #f1f5f9; /* Slate 100 */
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            font-family: system-ui, -apple-system, sans-serif;
          }
        `}</style>
      </head>
      <body>
        <div className="flex w-full flex-col items-center">
          {children}
        </div>
      </body>
    </html>
  );
}
