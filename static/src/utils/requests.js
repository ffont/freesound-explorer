export const loadJSON = (url, postData) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open(postData ? 'post' : 'get', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    const { status } = xhr;
    if (status === 200) {
      resolve(xhr.response);
    } else {
      reject(xhr.response);
    }
  };
  xhr.onerror = () => reject();
  if (postData) {
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(postData));
  } else {
    xhr.send();
  }
});
