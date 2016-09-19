export const loadJSON = url => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const { status } = xhr;
    if (status === 200) {
      resolve(xhr.response);
    } else {
      reject();
    }
  };
  xhr.onerror = () => reject();
  xhr.send();
});
