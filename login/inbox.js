// Mock email data and rendering for Gmail-like inbox
const emails = [
  {
    sender: "Leslie Alexander",
    subject: "Hiya",
    snippet: "Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    time: "10:41 PM",
    unread: true
  },
  {
    sender: "Theresa Webb",
    subject: "Build prototypes without code",
    snippet: "Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim.",
    time: "12:01 PM",
    unread: false
  },
  {
    sender: "Albert Flores",
    subject: "Build prototypes without code",
    snippet: "Nostrud irure ex duis ea quis id quis ad et.",
    time: "11:59 AM",
    unread: true
  },
  {
    sender: "Annette Black",
    subject: "Your account with us",
    snippet: "Non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim.",
    time: "Apr 25",
    unread: false
  },
  {
    sender: "Ralph Edwards",
    subject: "Welcome to startmail!",
    snippet: "Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et.",
    time: "Apr 25",
    unread: false
  },
  {
    sender: "Darlene Robertson",
    subject: "Welcome to our mailing list",
    snippet: "Iure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum.",
    time: "Apr 25",
    unread: false
  }
];

function renderEmails() {
  const emailsDiv = document.getElementById('emails');
  emailsDiv.innerHTML = emails.map(email => `
    <div class="email-item${email.unread ? ' unread' : ''}">
      <span class="sender">${email.sender}</span>
      <span class="subject">${email.subject}</span>
      <span class="snippet">${email.snippet}</span>
      <span class="time">${email.time}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderEmails);
