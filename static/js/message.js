document.addEventListener('DOMContentLoaded', function() {
  var messageBox = document.getElementById('message-box');
  var message = document.getElementById('message');

  // Show the message box
  messageBox.classList.remove('hidden');

  // Hide the message box after 6 seconds
  setTimeout(function() {
      messageBox.classList.add('hidden');
  }, 3000);
});
