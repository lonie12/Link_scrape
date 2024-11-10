// const injectScript = () => {
//   const container = document.createElement("div");
//   container.id = "floatingLogo";
//   document.body.appendChild(container);

//   const script = document.createElement("script");
//   script.src = chrome.runtime.getURL("contentMain.js");
//   script.type = "module";
//   (document.head || document.documentElement).appendChild(script);
// };

// const addElementToDom = () => {
//   // Créer un nouveau div
//   const container = document.createElement("div");

//   // Appliquer les styles pour positionner l'élément de manière absolue
//   container.style.position = "absolute";
//   container.style.right = "24px";
//   container.style.top = "32px";
//   container.style.zIndex = "1000"; // S'assurer que l'élément est visible
//   container.style.width = "50px"; // Définir la largeur du conteneur
//   container.style.height = "50px"; // Définir la hauteur du conteneur
//   container.style.borderRadius = "50%";

//   // Ajouter un fond ou une bordure si nécessaire
//   container.style.backgroundColor = "white"; // Fond transparent
//   container.style.border = "none"; // Pas de bordure

//   // Créer un élément image
//   const img = document.createElement("img");
//   img.src = chrome.runtime.getURL("assets/logo.png"); // URL de l'image (tu peux la remplacer)
//   img.alt = "Image"; // Texte alternatif pour l'image
//   img.style.width = "100%"; // Faire en sorte que l'image prenne la largeur complète du conteneur
//   img.style.height = "100%"; // Faire en sorte que l'image prenne la hauteur complète du conteneur
//   img.style.borderRadius = "50%";
//   img.style.objectFit = "cover"; // Adapter l'image au conteneur sans déformation
//   img.style.cursor = "pointer";

//   // Ajouter l'image au conteneur
//   container.appendChild(img);

//   // Injecter le conteneur dans le body du document
//   document.body.appendChild(container);
// };

// injectScript();
// addElementToDom();

const scrapeProfileInfo = async () => {
  const profileContent = document.querySelector(
    '#profile-content section[class*="artdeco-card"]'
  );
  const p_uname = profileContent?.querySelector(
    'div[class*="ph5"] span[tabindex="-1"] h1'
  )?.innerHTML;
  const p_title = profileContent?.querySelector(
    'div[class*="ph5"] div[class*="break-words"]'
  )?.innerHTML;
  const nbFollowers =
    profileContent?.querySelector(
      'div[class*="ph5"] li[class*="text-body-small t-black--light inline-block"] a span'
    )?.innerHTML ??
    profileContent?.querySelector(
      'div[class*="ph5"] li[class*="text-body-small t-black--light inline-block"] span'
    )?.innerHTML ??
    "Not defined";
  const nbFollowing =
    profileContent?.querySelector(
      'div[class*="ph5"] li[class*="text-body-small"] a span[class*="link-without-visited-state"] span'
    )?.innerHTML ?? "Not defined";
  return { p_uname, p_title, nbFollowers, nbFollowing };
};

//
const openContactModal = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const contactLink = document.querySelector<HTMLAnchorElement>(
        'a[href*="overlay/contact-info"]'
      );

      if (contactLink) {
        contactLink.click();

        const observer = new MutationObserver(() => {
          const modal = document.querySelector<HTMLElement>(
            "#artdeco-modal-outlet"
          );

          if (modal && modal.innerText.trim() !== "") {
            const emailElement =
              modal.querySelector<HTMLAnchorElement>('a[href*="mailto:"]');
            const email = emailElement?.innerText ?? "Not defined";

            const closeButton = document.querySelector<HTMLButtonElement>(
              'button[class*="artdeco-modal__dismiss"]'
            );

            if (closeButton) {
              closeButton.click();
            }

            observer.disconnect();
            resolve(email);
          }
        });

        // Observe DOM changes
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        reject(new Error('Lien "Coordonnées" non trouvé.'));
      }
    } catch (error) {
      reject(error); // Reject the promise with the error
    }
  });
};

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.startScraping) {
    await Promise.all([scrapeProfileInfo(), openContactModal()]).then(
      (values) => {
        chrome.runtime.sendMessage(values);
      }
    );
    return;
  }
});

chrome.storage.onChanged.addListener((changes, area: string) => {
  if (area === "sync") {
    chrome.runtime.sendMessage({
      auth: changes.auth.newValue,
    });
    return;
  }
});
