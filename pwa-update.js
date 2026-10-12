if ('serviceWorker' in navigator) {
  const workerUrl = new URL('sw.js', document.currentScript.src);
  let reloading = false;
  const wasControlled = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (wasControlled && !reloading) { reloading = true; location.reload(); }
  });
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(workerUrl, {updateViaCache:'none'});
      await registration.update();
    } catch (_) {}
  });
}
