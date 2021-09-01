
const handleSubmit = e => {
  e.preventDefault();
  clearError();
  document.getElementById('countryDataList').innerHTML = '';
  let filename = document.getElementById('filenameInput').value;
  if(!filename.endsWith('.json')) {
    filename = filename + '.json';
  }
  getFileFromServer(filename);
};

const showError = text => {
  document.getElementById('error').textContent = text;
}

const clearError = () => {
  document.getElementById('error').textContent = '';
}

const getFileFromServer = filename => {
  const req = new XMLHttpRequest();
  req.open('GET', filename);
  req.responseType = 'json';
  req.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");

  req.onload = () => {
    if (req.status === 200) {
      updateDOMList(req.response.results);
    }
    else {
      showError('file loading error: ' + req.statusText)
    }
  };

  req.onerror = () => { showError('file loading error: ' + req.statusText) };
  req.onabort = () => { showError('file loading aborted: ' + req.statusText) };

  req.send();
}

const updateDOMList = results => {
  const list = document.getElementById('countryDataList');
  results.forEach(item => {
    const li = document.createElement('li');
    li.innerText = item.countryName + ', ' + item.capitalCity;
    list.appendChild(li);
  });
};
