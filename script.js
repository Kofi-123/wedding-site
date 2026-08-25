const weddingDate = new Date('2026-08-29T10:00:00');
const hero = document.querySelector('.hero');
const calendarButton = document.getElementById('add-to-calendar');
const calendarMessage = document.getElementById('calendar-message');
const weddingInbox = 'owusubarbara30@gmail.com';

function buildCalendarFile() {
  const start = '20260829T100000';
  const end = '20260829T140000';
  const title = 'Nicholas & Aseda Wedding Celebration';
  const location = 'Koforidua, Eastern Region';
  const description = 'Join us as we celebrate our wedding day with love, joy, and cherished memories.';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@wedding-site`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');
}

function addToCalendar() {
  const calendarData = buildCalendarFile();
  const blob = new Blob([calendarData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nicholas-and-aseda-wedding.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
  googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
  googleCalendarUrl.searchParams.set('text', 'Nicholas & Aseda Wedding Celebration');
  googleCalendarUrl.searchParams.set('dates', '20260829T100000/20260829T140000');
  googleCalendarUrl.searchParams.set('location', 'Koforidua, Eastern Region');
  googleCalendarUrl.searchParams.set('details', 'Join us as we celebrate our wedding day with love, joy, and cherished memories.');
  googleCalendarUrl.searchParams.set('ctz', 'Africa/Accra');

  window.open(googleCalendarUrl.toString(), '_blank', 'noopener,noreferrer');

}

calendarButton?.addEventListener('click', addToCalendar);

function updateCountdown() {
  const now = new Date();
  const difference = weddingDate - now;

  if (difference <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

if (hero) {
  hero.style.setProperty('--hero-image', "url('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=80')");
}

const form = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name')?.toString().trim() || 'Guest';
  const email = formData.get('email')?.toString().trim();
  const attendance = formData.get('attendance')?.toString().trim() || 'Not specified';

  const subject = encodeURIComponent(`RSVP from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email || 'Not provided'}\nAttendance: ${attendance}\n\nThank you for celebrating with us.`
  );

  const mailtoLink = `mailto:${email || weddingInbox}?cc=${weddingInbox}&subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;

  if (formMessage) {
    formMessage.textContent = `Thank you, ${name}! Your RSVP details are ready to send to your email app.`;
  }

  form.reset();
});

const messageForm = document.getElementById('message-form');
const messageFormStatus = document.getElementById('message-form-status');

messageForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(messageForm);
  const name = formData.get('name')?.toString().trim() || 'Guest';
  const messageType = formData.get('messageType')?.toString().trim() || 'Message';
  const message = formData.get('message')?.toString().trim() || '';
  const subject = encodeURIComponent(`${messageType} from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nType: ${messageType}\n\n${message}`);

  window.location.href = `mailto:${weddingInbox}?subject=${subject}&body=${body}`;

  if (messageFormStatus) {
    messageFormStatus.textContent = `Thank you, ${name}. Your message is ready to send to the couple.`;
  }

  messageForm.reset();
});
