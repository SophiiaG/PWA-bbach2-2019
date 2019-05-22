/*
Gestion du cache
*/
const appShell = [     
  './routes-login-page-module.js.map',
  './routes-register-page-module.js',
  './favicon.ico',
  './routes-register-page-module.js.map',
  './img',                                             
  './routes-user-page-module.js',
  './index.html',                                                
  './routes-user-page-module.js.map',
  './main.js',                                                     
  './runtime.js',
  './main.js.map',                                  
  './runtime.js.map',
  './manifest.json',                                                      
  './service-worker.js',
  './polyfills.js',                                                     
  './styles.js',
  './polyfills.js.map',                                                 
  './styles.js.map',
  './routes-home-page-module.js',                                     
  './vendor.js',
  './routes-home-page-module.js.map',                                 
  './vendor.js.map',
  './routes-login-page-module.js',
];
//


/*
Gestion des événements
*/
// Installation du service worker
self.addEventListener('install', async () => {
  // Création d'un cache pour les données statiques
  const staticCache = await caches.open('static-assets');

  // Ajout des données statiques dans le cache 
  staticCache.addAll(appShell);
});

// Récupérer les données depuis le Service Worker
self.addEventListener( 'fetch', (event) => {
  // Récupération des données de la requête
  const request = event.request;

  // Récupération de l'URL de la requête
  const url = new URL(request.url);

  // Gestion des stratégies de cache
  if( url.origin === location.origin ){
      // Récuperer les données depuis le cache
      event.respondWith( caheFirst(request) )
  }
  else{
      // Récupérer les données depuis une API
      event.respondWith( networkFirst(request) );
  };
});
//

/*
Définition des stratégies
*/
const caheFirst = async (req) => {
  // Vérifier la présence de données dans le cache
  const cachedResponse = await caches.match(req);

  // Renvoyer le résultat : données du cache ou depuis le server
  return cachedResponse || fetch(req);
}

const networkFirst = async (req) => {
  // Création d'un cache pour les données dynamiques
  const dynamicCache = await caches.open('dynamic-assets');

  // Récupération des données depuis une API
  try {
      // Ajout des données dans le cache dynamique en mode connecté
      const response = await fetch(req);
      dynamicCache.put( req, response.clone() );

      // Renvoyer le réponse
      return response;

  } catch(err){
      // Récupérer les données du cache en mode hors-connexion
      const cachedResponse = await dynamicCache.match(req);

      // Renvoyer la réponse
      return cachedResponse || await caches.match('./fallback/no-news.json')
  };
}
//