let dati = { voci: [] };

// Carica dal Drive
function loadFromDrive() {
  google.script.run
    .withSuccessHandler((res) => {
      try {
        dati = JSON.parse(res);
      } catch (e) {
        dati = { voci: [] };
      }
      render();
    })
    .loadData();
}

// Salva su Drive
function saveToDrive() {
  google.script.run.saveData(JSON.stringify(dati));
}

// Aggiungi voce
function aggiungiVoce(voce) {
  voce.id = Date.now();
  dati.voci.push(voce);
  saveToDrive();
  render();
}

// Modifica voce
function modificaVoce(id, nuovaVoce) {
  const i = dati.voci.findIndex(v => v.id === id);
  if (i !== -1) {
    dati.voci[i] = { ...dati.voci[i], ...nuovaVoce };
    saveToDrive();
    render();
  }
}

// Elimina voce
function eliminaVoce(id) {
  dati.voci = dati.voci.filter(v => v.id !== id);
  saveToDrive();
  render();
}

// Render UI
function render() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  dati.voci.forEach(v => {
    const el = document.createElement("div");
    el.className = "voce";
    el.innerHTML = `
      <b>${v.nome}</b><br>
      Utente: ${v.utente || ""}<br>
      Password: ${v.password || ""}<br>
      Codice: ${v.codice || ""}<br>
      URL: ${v.url || ""}<br>
      Note: ${v.note || ""}<br>
      <button onclick="eliminaVoce(${v.id})">Elimina</button>
    `;
    lista.appendChild(el);
  });
}

window.onload = loadFromDrive;
