document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  //Sends email
  document.querySelector('form').onsubmit = function() {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
    load_mailbox('sent')
    return false
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Show the mails in mailbox
    // Query the emails-view element once outside the loop
  const emailsView = document.querySelector('#emails-view');
    //Use API
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
    // Print emails
    console.log(emails)
    emails.forEach((item,index)=> {
      console.log(item)
      const storedReadStatus = localStorage.getItem(`email-${item.id}-read`);
      if (storedReadStatus !== null) {
        item.read = JSON.parse(storedReadStatus);
    }
     // Create a div element for each email
      const emailDiv = document.createElement('div');
      emailDiv.setAttribute('style', 'border-style:solid;padding:50px;border-color:gray');
      emailDiv.id = `email-div${item.id}`;
      // Construct the inner HTML using template literals
      emailDiv.innerHTML = `
      <a>From: ${item.sender}</a>
      <a>${item.timestamp}</a>
      <h2>Subject: ${item.subject}</h2>
      `;
      // Append the emailDiv to the emails-view
      emailsView.appendChild(emailDiv);
      // Gray background if read
      if (item.read) {
        emailDiv.style.backgroundColor = 'gray';
      }
    })

   // Handle click events on email-div elements and change read status if clicked
   emailsView.addEventListener('click', (event) => {
    const clickedDiv = event.target.closest('[id^="email-div"]');
    if (clickedDiv) {
        const emailId = clickedDiv.id.replace('email-div', ''); // Extract the email ID from the div ID
        const email = emails.find(email => email.id === parseInt(emailId));
        if (email && email.read === false) {
            email.read = true; // Set read property to true
            clickedDiv.style.backgroundColor = 'gray';
            localStorage.setItem(`email-${email.id}-read`, true);
        }
        /* if want to unread them
        else if (email && email.read === true){
          email.read = false; // Set read property to true
          clickedDiv.style.backgroundColor = 'white';
          localStorage.setItem(`email-${email.id}-read`, false);
        }
        */
        // Show single email window
        // Use GET request by email ID
        // Add additional html template for displaying content ; update block and none views
        fetch(`/emails/${emailId}`)
        .then(response => response.json())
        .then(email => {
            // Print email
            console.log(email);
            emailsView.innerHTML = '';
            emailsView.style = 'border-style:solid;padding:50px;border-color:gray';
            emailsView.innerHTML += `
            <a>From: ${email.sender}</a>
            <a>${email.timestamp}</a>
            <h2>Subject: ${email.subject}</h2>
            <h5>${email.body}</h5>
            <button id=archive></button>
            <button id=reply>Reply</button>
            `;

            const btn_arch = document.querySelector('#archive')
            btn_arch.innerHTML = email.archived ? "Unarchived" : "Archive";

            document.querySelector('#archive').addEventListener('click', () => {
              // Archive/unarchive button function
              console.log(`Archive clicked for id: ${email.id}`);
              fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: !email.archived
                })
              })
              .then(() => {load_mailbox('archive')})
            });
            // Reply button function
            document.querySelector('#reply').addEventListener('click', () => {
              console.log(`Reply clicked for id: ${emailId}`);
              compose_email();
              document.querySelector('#compose-recipients').value = `${email.sender}`;
              document.querySelector('#compose-subject').value = `Re: ${email.sender}`;
              document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
            });
});
        

        

    }
});

  });
  return false
}