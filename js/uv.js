/*global Ultraviolet*/

async function isBareBlocked(url) {
    try {
      var README = await fetch(url);
      var content = await README.json();
      if (content.versions[0] == "v1") {
        // The Bare is not blocked
        return false;
      } else {
        // The Bare is not returning a valid response or is blocked
        return true;
      }
    } catch {
      return true;
    }
  }
  
  async function getBare(cdns) {
    for (let cdn of cdns) {
      var blocked = await isBareBlocked(cdn);
      if (!blocked) {
        return cdn;
      }
    }
    return cdns[0];
  }
const bare = localStorage.getItem("bare")

if (!bare) {
    fetch("./assets/json/bares.json")
      .then((res) => res.json())
      .then(async (bares) => {
        localStorage.setItem("bare", await getBare(bares));
        location.reload();
      });
  }

self.__uv$config = {
    prefix: '/service/',
    bare: bare,
    encodeUrl: Ultraviolet.codec.base64.encode,
    decodeUrl: Ultraviolet.codec.base64.decode,
    handler: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@1.0.11/dist//uv.handler.js',
    client: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@1.0.11/dist//uv.client.js',
    bundle: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@1.0.11/dist//uv.bundle.js',
    config: '/js/uv.js',
    sw: 'https://unpkg.com/@titaniumnetwork-dev/ultraviolet@1.0.11/dist//uv.sw.js',
};

function formatUrl(url) {
    try {
        new URL(url)
        return __uv$config.prefix + __uv$config.encodeUrl(url);
    } catch (e) {
        throw new Error("Invalid url provided")
    } 
}

function registerSW() {
    navigator.serviceWorker.register('sw.js', {
        scope: __uv$config.prefix,
    });
    console.log("UV Service worker registered!")
}