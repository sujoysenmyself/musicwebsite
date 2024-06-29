document.getElementById('share').addEventListener('click', function() {
  const shareData = {
    title: 'Music Website',
    text: 'Check out this amazing music website!',
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('Successfully shared'))
      .catch(error => console.log('Error sharing:', error));
  } else {
    alert('Your browser does not support the Web Share API. Here is the link: ' + window.location.href);
  }
});