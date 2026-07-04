ALTER TABLE "Course" ADD COLUMN "isEnquiryEnabled" BOOLEAN NOT NULL DEFAULT true;

UPDATE "Course" SET "syllabus" = 'Fundamentals of Computer
Microsoft Windows
Microsoft Office
DTP
Tally Prime
HTML Basics
Internet & Multimedia' WHERE UPPER("name") = 'ADCA' AND ("syllabus" IS NULL OR "syllabus" = '');

UPDATE "Course" SET "syllabus" = 'Fundamentals of Computer
Microsoft Windows
Microsoft Office
HTML Basics
Internet & Multimedia
File & Folder Management' WHERE UPPER("name") = 'DCA' AND ("syllabus" IS NULL OR "syllabus" = '');

UPDATE "Course" SET "syllabus" = 'Adobe PageMaker
Adobe Photoshop
Adobe Illustrator
CorelDRAW
Canva
Album, poster, card and certificate design' WHERE UPPER("name") = 'DTP' AND ("syllabus" IS NULL OR "syllabus" = '');

UPDATE "Course" SET "syllabus" = 'Computer Fundamentals
Accounting Fundamentals
Tally Prime
GST Basics
Microsoft Excel
Practical Business Accounting' WHERE UPPER("name") = 'CFA' AND ("syllabus" IS NULL OR "syllabus" = '');

UPDATE "Course" SET "syllabus" = 'Fundamentals of Computer
Microsoft Office
Accounting Fundamentals
Tally Prime
Taxation
Advanced Excel
Banking & Finance
Practical Training' WHERE UPPER("name") = 'DFA' AND ("syllabus" IS NULL OR "syllabus" = '');

UPDATE "Course" SET "syllabus" = 'Introduction to Computer
Computer Fundamentals
Operating System (Windows)
Internet & Multimedia
Practical Training' WHERE UPPER("name") = 'CCC' AND ("syllabus" IS NULL OR "syllabus" = '');

UPDATE "Course" SET "syllabus" = 'Microsoft Word
Microsoft Excel
Microsoft PowerPoint
Microsoft Access
Microsoft Outlook' WHERE UPPER("name") = 'MS OFFICE' AND ("syllabus" IS NULL OR "syllabus" = '');

UPDATE "Course" SET "syllabus" = 'English Typing
Hindi Typing
Remington Gail Layout
Typing speed improvement
Accuracy and productivity practice' WHERE UPPER("name") = 'TYPING' AND ("syllabus" IS NULL OR "syllabus" = '');

UPDATE "Course" SET "syllabus" = 'Basic Accounting
Tally Prime
GST & TDS
Voucher Creation
Stock Maintenance
Reports & Financial Statements' WHERE UPPER("name") = 'ACCOUNTING' AND ("syllabus" IS NULL OR "syllabus" = '');

UPDATE "Course" SET "syllabus" = 'Photoshop
CorelDRAW
Illustrator
Canva
Poster and banner design
Certificate and card design' WHERE UPPER("name") = 'GRAPHICS' AND ("syllabus" IS NULL OR "syllabus" = '');
