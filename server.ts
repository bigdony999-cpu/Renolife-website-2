import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API router rules
  app.post("/api/send-confirmation", async (req, res) => {
    try {
      const { fullName, email, phone, address, quantity, totalPrice, currency, lang } = req.body;

      if (!fullName || !email || !phone || !address || !quantity || !totalPrice) {
        return res.status(400).json({ 
          success: false, 
          message: lang === 'sw' ? 'Tafadhali jaza taarifa zote zinazohitajika' : 'Please provide all required fields' 
        });
      }

      // Format currency
      const formattedPrice = lang === 'sw' 
        ? `${Number(totalPrice).toLocaleString()} TZS` 
        : `$${Number(totalPrice)} USD`;

      // Define localized email subject and templates
      const subject = lang === 'sw' 
        ? "Uhakiki wa Agizo Lako - RenoLife+" 
        : "Order Confirmation - RenoLife+";

      const brandColor = "#1D3B2B"; // deep Swiss green
      const accentColor = "#D4AF37"; // gold accent

      const swHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f4; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .header { background-color: ${brandColor}; padding: 40px 20px; text-align: center; border-bottom: 3px solid ${accentColor}; }
            .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 1px; }
            .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
            .content h2 { color: ${brandColor}; font-size: 20px; margin-top: 0; font-weight: 600; }
            .details-box { background-color: #f7faf8; border-left: 4px solid ${brandColor}; padding: 25px; margin: 25px 0; border-radius: 4px; }
            .details-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #e1eae3; padding-bottom: 10px; }
            .details-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .details-label { font-weight: bold; color: #555555; font-size: 14px; }
            .details-value { color: #222222; font-size: 14px; text-align: right; }
            .footer { background-color: #1a1a1a; padding: 30px 20px; text-align: center; color: #888888; font-size: 12px; }
            .footer p { margin: 5px 0; }
            .btn-whatsapp { display: inline-block; background-color: #25D366; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; tracking-wide: 1px; margin-top: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>RenoLife+ Stem Cells</h1>
            </div>
            <div class="content">
              <h2>Habari ${fullName},</h2>
              <p>Asante kwa kuchagua RenoLife+. Tumepokea agizo lako la boksi asilia za seli za mimea asilia kutoka Uswisi. Ombi lako linafanyiwa kazi sasa hivi na mtaalamu wetu atakupigia simu muda mrefu ili kukamilisha uwasilishaji.</p>
              
              <div class="details-box">
                <div class="details-row">
                  <div class="details-label">Mteja:</div>
                  <div class="details-value">${fullName}</div>
                </div>
                <div class="details-row">
                  <div class="details-label">Namba ya Simu:</div>
                  <div class="details-value">${phone}</div>
                </div>
                <div class="details-row">
                  <div class="details-label">Anwani:</div>
                  <div class="details-value">${address}</div>
                </div>
                <div class="details-row">
                  <div class="details-label">Idadi ya Maboksi:</div>
                  <div class="details-value">${quantity} boksi</div>
                </div>
                <div class="details-row" style="border-bottom: none; padding-top: 10px;">
                  <div class="details-label" style="font-size: 16px; color: ${brandColor};">Jumla Kuu:</div>
                  <div class="details-value" style="font-size: 16px; font-weight: bold; color: ${brandColor};">${formattedPrice}</div>
                </div>
              </div>

              <p>Ikiwa una maswali yoyote au unahitaji uwasilishaji wa haraka, tafadhali bonyeza kitufe kilicho chini kuwasiliana nasi moja kwa moja kupitia WhatsApp yetu:</p>
              
              <div style="text-align: center;">
                <a href="https://wa.me/255696218901?text=Habari%2C%20nahitaji%20msaada%20kuhusu%20agizo%20langu%20la%20RenoLife%2B" target="_blank" class="btn-whatsapp">Wasiliana Nasi WhatsApp</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 RenoLife+ Swiss Plant Stem Cells. Haki zote zimehifadhiwa.</p>
              <p>Mawasiliano Helpline: +255 696 218 901 | Huduma ya masaa 24</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const enHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f4; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .header { background-color: ${brandColor}; padding: 40px 20px; text-align: center; border-bottom: 3px solid ${accentColor}; }
            .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 1px; }
            .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
            .content h2 { color: ${brandColor}; font-size: 20px; margin-top: 0; font-weight: 600; }
            .details-box { background-color: #f7faf8; border-left: 4px solid ${brandColor}; padding: 25px; margin: 25px 0; border-radius: 4px; }
            .details-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #e1eae3; padding-bottom: 10px; }
            .details-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .details-label { font-weight: bold; color: #555555; font-size: 14px; }
            .details-value { color: #222222; font-size: 14px; text-align: right; }
            .footer { background-color: #1a1a1a; padding: 30px 20px; text-align: center; color: #888888; font-size: 12px; }
            .footer p { margin: 5px 0; }
            .btn-whatsapp { display: inline-block; background-color: #25D366; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; tracking-wide: 1px; margin-top: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>RenoLife+ Stem Cells</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName},</h2>
              <p>Thank you for choosing RenoLife+. We have received your order for certified Swiss plant stem cell therapy. Your reservation is being processed immediately, and our clinical coordinator will reach out to you via call shortly to finalize shipping details.</p>
              
              <div class="details-box">
                <div class="details-row">
                  <div class="details-label">Client Name:</div>
                  <div class="details-value">${fullName}</div>
                </div>
                <div class="details-row">
                  <div class="details-label">Phone Number:</div>
                  <div class="details-value">${phone}</div>
                </div>
                <div class="details-row">
                  <div class="details-label">Delivery Address:</div>
                  <div class="details-value">${address}</div>
                </div>
                <div class="details-row">
                  <div class="details-label">Quantity:</div>
                  <div class="details-value">${quantity} box(es)</div>
                </div>
                <div class="details-row" style="border-bottom: none; padding-top: 10px;">
                  <div class="details-label" style="font-size: 16px; color: ${brandColor};">Total Cost:</div>
                  <div class="details-value" style="font-size: 16px; font-weight: bold; color: ${brandColor};">${formattedPrice}</div>
                </div>
              </div>

              <p>For urgent questions or scheduling updates, please click below to contact our customer care desk directly on WhatsApp:</p>
              
              <div style="text-align: center;">
                <a href="https://wa.me/255696218901?text=Hello%2C%20I%20need%20assistance%20regarding%20my%20recent%20RenoLife%2B%20order" target="_blank" class="btn-whatsapp">Contact Care Desk on WhatsApp</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 RenoLife+ Swiss Plant Stem Cells. All rights reserved.</p>
              <p>Helpline: +255 696 218 901 | 24/7 Professional Support</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const htmlContent = lang === 'sw' ? swHtml : enHtml;

      // Lazy Initialization of SMTP Transporter to prevent crashes if missing environment key
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpFrom = process.env.SMTP_FROM || `"RenoLife+ Support" <orders@renolife.com>`;

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject: subject,
          html: htmlContent
        });

        console.log(`[SMTP_DISPATCH] Successfully dispatched automated confirmation email to ${email}`);
        return res.json({ success: true, mode: "real_smtp", message: "Confirmation email sent." });
      } else {
        // Safe Visual Console Auditing fall-back
        console.log("======================================= EMAIL DEV SIMULATION =======================================");
        console.log(`Target Recipient : ${email}`);
        console.log(`Subject          : ${subject}`);
        console.log("======================================= HTML EMAIL RENDER =======================================");
        console.log(htmlContent);
        console.log("=================================================================================================");
        return res.json({ 
          success: true, 
          mode: "dev_log", 
          message: "Confirmation log printed to backend terminal (unconfigured SMTP variables in .env)" 
        });
      }
    } catch (err: unknown) {
      console.error("[CONFIRMATION_FAIL]", err);
      res.status(500).json({ 
        success: false, 
        message: err instanceof Error ? err.message : "Internal Server Error during email trigger" 
      });
    }
  });

  // Vite development vs production assets middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULLSTACK] Server running actively on http://0.0.0.0:${PORT}`);
  });
}

startServer();
