let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
const installButton = document.getElementById('install');

let deferredPrompt;

function openCreatePostModal() {
  createPostArea.style.display = 'block';
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

function createCard() {
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/htw-gebaeude-h.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  let cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'Vor der HTW-Mensa';
  cardTitle.appendChild(cardTitleTextElement);
  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'HTW Berlin';
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      createCard();
    });

window.addEventListener('beforeinstallprompt', (event) => {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  installButton.style.display = 'block';
  return false;
});

installButton.addEventListener('click', async () => {
  if (deferredPrompt) {
    await deferredPrompt.prompt();
    // Warten Sie auf die Ergebnisse der Installation
    deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Die App wurde installiert');
        } else {
          console.log('Die App wurde nicht installiert');
        }

        // Setzen Sie das deferredPrompt-Objekt auf Null, da die Installation abgeschlossen ist.
        deferredPrompt = null;
      });
  }
});

window.addEventListener('appinstalled', () => {
  installButton.style.display = 'none';
  console.log('a2hs installed');
});