'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "b0db7a9707dcbc87bd4b1072a91c2286",
"/": "b0db7a9707dcbc87bd4b1072a91c2286",
"main.dart.js": "f4d3acbd3ecdeb9bae0401eefe65ea0b",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "ef589504d5549ff024649406ba7f4bef",
"assets/images/banner2.png": "40ec85c4f592adc60f225c0884181a17",
"assets/images/2.0x/banner2.png": "b25cc616af385f4be9605f5ef6e5de3e",
"assets/images/2.0x/cat1.png": "3378163537d3f461e59b4ce8ddd2eceb",
"assets/images/2.0x/banner3.png": "d3be6bc6adb4bc227fd46407c4780a1e",
"assets/images/2.0x/banner1.png": "c7288b2e7ab8fa0ba95e5f433fd53884",
"assets/images/2.0x/cat2.png": "eee971480b237f4d250a592bd8011884",
"assets/images/2.0x/cat3.png": "f98149cfd49ee69ff657e3fc9dda632b",
"assets/images/2.0x/banner4.png": "1fbec23f5a7ebdc05f56103992e25305",
"assets/images/2.0x/banner5.png": "c2e87af32dd76cd017b9767bd65ef7ee",
"assets/images/2.0x/cat4.png": "dad68125e0b864f71abd98ef95713145",
"assets/images/2.0x/cat5.png": "37b66899932b8343c28b15952d65bd29",
"assets/images/cat1.png": "38179b21c1c8ccdc29b3fc64460f195d",
"assets/images/banner3.png": "167ea5c7b88fe2c20cfc67d1476d9987",
"assets/images/banner1.png": "76da1db3eb42e238173d70206078e436",
"assets/images/cat2.png": "9336813ea3b02fb71ed29ac048e535d9",
"assets/images/cat3.png": "f59062dcb0f19c9b37ab979360000ac3",
"assets/images/banner4.png": "251a3b2a2de75a5558039e86b4ddf2ae",
"assets/images/banner5.png": "448056ccc3761152e37b7e2415153228",
"assets/images/3.0x/banner2.png": "4ea8752fe6d44db55d125dfe53b72972",
"assets/images/3.0x/cat1.png": "8e2fa819dbb8744866fdcc8f9ea09023",
"assets/images/3.0x/banner3.png": "f1eb6774dbcf477741f48c462814f69e",
"assets/images/3.0x/banner1.png": "75762f96210cc8b4e8f1a4311617a06b",
"assets/images/3.0x/cat2.png": "d3b99a39bee4cd50440fbd6659620379",
"assets/images/3.0x/cat3.png": "f5461418c474a0a6129aec9280744f07",
"assets/images/3.0x/banner4.png": "4596f58ffda5f5d10220654bf43a99c8",
"assets/images/3.0x/banner5.png": "fba5ccfad809d0d9a10c40f09a464739",
"assets/images/3.0x/cat4.png": "f9458c67c0ace750787378ae019216a5",
"assets/images/3.0x/cat5.png": "d15791ddb3b29fdf238ed9f29249ca36",
"assets/images/cat4.png": "732343515a81e8d43a17e0da61f2e77c",
"assets/images/cat5.png": "acdade276710770d7781dfe70b441902",
"assets/images/earthGif.gif": "8338750a2e66aca3facb2e2fece31f35",
"assets/images/earth@3x.png": "b47ee681847bbaea501c8a216d266874",
"assets/images/earthSlow.gif": "f6a2eb1005b00af9ff99ebeaf5221d47",
"assets/images/appBg@3x.png": "68ca4d44da5e98860dfc8fc06721d18a",
"assets/images/icCategoryEnv.png": "357ec322c48971f0b9de23214db2e2e9",
"assets/AssetManifest.json": "2267275746a629a6433334e9e2f50e05",
"assets/NOTICES": "6c3c25acc54b0e8c740b07a4e206a0b9",
"assets/FontManifest.json": "3cbfc4a487d96b1a64119601ee09feef",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/fonts/Wallpoet-Regular.ttf": "d1d4f8933774abc5b24a6a4b617f1968",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data == 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message = 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
