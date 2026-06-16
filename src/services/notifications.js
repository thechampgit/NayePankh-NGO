import { db, isConfigured } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Triggers an email notification to the admin at admintestsprojects@gmail.com
 * by adding a document to the 'mail' Firestore collection and a simulation record to localStorage.
 * 
 * @param {string} type - 'volunteer', 'internship', 'work', or 'donation'
 * @param {object} payload - Form details filled by the applicant or donation details
 */
export async function sendAdminNotification(type, payload) {
  const adminEmail = 'admintestsprojects@gmail.com';
  
  let subject = '';
  let html = '';
  const timestampStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  if (type === 'volunteer') {
    subject = `New Volunteer Registration - ${payload.name}`;
    html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://nayepankh.org/logo.png" alt="NayePankh Foundation" style="height: 60px; object-fit: contain;" onerror="this.src='https://nayepankh.org/wp-content/uploads/2021/05/cropped-NayePankh-Logo-1.png'" />
          <h2 style="color: #0284c7; margin-top: 15px; margin-bottom: 5px; font-weight: 800; font-size: 22px;">New Volunteer Registration</h2>
          <p style="color: #64748b; margin: 0; font-size: 14px;">A volunteer application has been submitted</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Full Name</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${payload.name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Email</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${payload.email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${payload.email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Phone</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${payload.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">City</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${payload.city || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Program</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-transform: capitalize;">${payload.program || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider; vertical-align: top;">Skills</td>
              <td style="padding: 8px 0; color: #334155; font-size: 14px;">
                ${(payload.skills && payload.skills.length > 0) 
                  ? payload.skills.map(s => {
                      const text = (s === 'Others' && payload.otherSkills) ? `Others: ${payload.otherSkills}` : s;
                      return `<span style="display: inline-block; background-color: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 6px; font-size: 12px; margin-right: 5px; margin-bottom: 5px; font-weight: 500;">${text}</span>`;
                    }).join('') 
                  : '<span style="color: #94a3b8;">None specified</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider; vertical-align: top;">Interests</td>
              <td style="padding: 8px 0; color: #334155; font-size: 14px;">
                ${(payload.interests && payload.interests.length > 0) 
                  ? payload.interests.map(i => {
                      const text = (i === 'Others' && payload.otherInterests) ? `Others: ${payload.otherInterests}` : i;
                      return `<span style="display: inline-block; background-color: #f0fdf4; color: #166534; padding: 2px 8px; border-radius: 6px; font-size: 12px; margin-right: 5px; margin-bottom: 5px; font-weight: 500;">${text}</span>`;
                    }).join('') 
                  : '<span style="color: #94a3b8;">None specified</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider; vertical-align: top; border-t: 1px solid #e2e8f0;" colspan="2">Message / Note</td>
            </tr>
            <tr>
              <td style="padding: 0 0 8px 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap; font-style: italic;" colspan="2">
                "${payload.message || 'No additional message provided.'}"
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px; font-weight: 500;">
          Submitted At: ${timestampStr} · Automated Notification Engine
        </div>
      </div>
    `;
  } else if (type === 'internship') {
    const applicantName = payload.applicantName || payload.name;
    subject = `New Internship Application - ${applicantName}`;
    html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://nayepankh.org/logo.png" alt="NayePankh Foundation" style="height: 60px; object-fit: contain;" onerror="this.src='https://nayepankh.org/wp-content/uploads/2021/05/cropped-NayePankh-Logo-1.png'" />
          <h2 style="color: #4f46e5; margin-top: 15px; margin-bottom: 5px; font-weight: 800; font-size: 22px;">New Internship Application</h2>
          <p style="color: #64748b; margin: 0; font-size: 14px;">An internship application has been submitted</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Applicant Name</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${applicantName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Email</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${payload.email}" style="color: #4f46e5; text-decoration: none; font-weight: 600;">${payload.email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Phone</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${payload.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">City</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${payload.city || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Internship Track</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-transform: capitalize;">${payload.internshipTrack || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Duration</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${payload.duration || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider; vertical-align: top; border-t: 1px solid #e2e8f0;" colspan="2">Statement of Purpose / Message</td>
            </tr>
            <tr>
              <td style="padding: 0 0 8px 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap; font-style: italic;" colspan="2">
                "${payload.message || 'No additional message provided.'}"
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px; font-weight: 500;">
          Submitted At: ${timestampStr} · Automated Notification Engine
        </div>
      </div>
    `;
  } else if (type === 'work') {
    const applicantName = payload.applicantName || payload.name;
    subject = `New Job Application (${payload.position || 'Career'}) - ${applicantName}`;
    html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://nayepankh.org/logo.png" alt="NayePankh Foundation" style="height: 60px; object-fit: contain;" onerror="this.src='https://nayepankh.org/wp-content/uploads/2021/05/cropped-NayePankh-Logo-1.png'" />
          <h2 style="color: #d97706; margin-top: 15px; margin-bottom: 5px; font-weight: 800; font-size: 22px;">New Job Application</h2>
          <p style="color: #64748b; margin: 0; font-size: 14px;">A 'Work With Us' application has been submitted</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Applicant Name</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${applicantName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Email</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${payload.email}" style="color: #d97706; text-decoration: none; font-weight: 600;">${payload.email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Phone</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${payload.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">City</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${payload.city || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Desired Position</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-transform: capitalize;">${payload.position || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Expected CTC</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">₹${payload.expectedCtc ? Number(payload.expectedCtc).toLocaleString('en-IN') : 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider; vertical-align: top; border-t: 1px solid #e2e8f0;" colspan="2">Cover Letter / Message</td>
            </tr>
            <tr>
              <td style="padding: 0 0 8px 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap; font-style: italic;" colspan="2">
                "${payload.message || 'No additional message provided.'}"
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px; font-weight: 500;">
          Submitted At: ${timestampStr} · Automated Notification Engine
        </div>
      </div>
    `;
  } else if (type === 'donation') {
    const donorName = payload.userName || 'Guest Donor';
    const donorEmail = payload.userEmail || 'guest@example.com';
    const donorPhone = payload.phone || 'N/A';
    subject = `New Donation Received - ₹${payload.amount} from ${donorName}`;
    html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://nayepankh.org/logo.png" alt="NayePankh Foundation" style="height: 60px; object-fit: contain;" onerror="this.src='https://nayepankh.org/wp-content/uploads/2021/05/cropped-NayePankh-Logo-1.png'" />
          <h2 style="color: #10b981; margin-top: 15px; margin-bottom: 5px; font-weight: 800; font-size: 22px;">Donation Successful!</h2>
          <p style="color: #64748b; margin: 0; font-size: 14px;">A donation payment has been processed via Razorpay</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Donor Name</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${donorName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Email</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${donorEmail}" style="color: #10b981; text-decoration: none; font-weight: 600;">${donorEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Phone</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${donorPhone}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider; border-top: 1px solid #e2e8f0;">Amount</td>
              <td style="padding: 10px 0; color: #10b981; font-weight: 800; font-size: 20px; border-top: 1px solid #e2e8f0;">₹${Number(payload.amount).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Frequency</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-transform: capitalize;">${payload.frequency || 'one-time'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Cause / Category</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${payload.category || 'General Support'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Payment ID</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-family: monospace;">${payload.paymentId || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; font-size: 13px; text-transform: uppercase; tracking-wider;">Payment Method</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-transform: uppercase;">${payload.paymentMethod || 'UPI'}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 25px; text-align: center; color: #94a3b8; font-size: 11px; font-weight: 500;">
          Processed At: ${timestampStr} · Automated Notification Engine
        </div>
      </div>
    `;
  }

  const notificationDoc = {
    to: adminEmail,
    message: {
      subject: subject,
      html: html
    },
    createdAt: new Date().toISOString()
  };

  // Write to firestore 'mail' collection if configured
  if (isConfigured) {
    try {
      await addDoc(collection(db, 'mail'), notificationDoc);
      console.log(`[Notification Engine] Queued Firestore mail notification to ${adminEmail}`);
    } catch (err) {
      console.error("[Notification Engine] Firestore mail document insertion error:", err);
    }
  }

  // Save fallback inside localStorage for local simulation testing
  try {
    const existingLogs = JSON.parse(localStorage.getItem('naye_pankh_admin_notifications') || '[]');
    existingLogs.unshift({
      id: 'notify-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      subject,
      html,
      recipient: adminEmail,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('naye_pankh_admin_notifications', JSON.stringify(existingLogs));
    console.log(`[Notification Engine] Recorded local notification log to localStorage.`);
  } catch (err) {
    console.error("[Notification Engine] LocalStorage write error:", err);
  }
}
