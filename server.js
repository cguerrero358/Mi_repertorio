const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const REPERTORIO_FILE = path.join(__dirname, 'repertorio.json');

app.use(express.json());
app.use(express.static('public'));

// Ruta para obtener todas las canciones
app.get('/canciones', (req, res) => {
  fs.readFile(REPERTORIO_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo');
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para agregar una nueva canción
app.post('/canciones', (req, res) => {
  const nuevaCancion = req.body;
  fs.readFile(REPERTORIO_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo');
    }
    const repertorio = JSON.parse(data);
    repertorio.push(nuevaCancion);
    fs.writeFile(REPERTORIO_FILE, JSON.stringify(repertorio), (err) => {
      if (err) {
        return res.status(500).send('Error al escribir en el archivo');
      }
      res.status(201).send('Canción agregada');
    });
  });
});

// Ruta para modificar una canción existente
app.put('/canciones/:id', (req, res) => {
  const { id } = req.params;
  const cancionActualizada = req.body;
  fs.readFile(REPERTORIO_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo');
    }
    let repertorio = JSON.parse(data);
    repertorio = repertorio.map(cancion => cancion.id == id ? cancionActualizada : cancion);
    fs.writeFile(REPERTORIO_FILE, JSON.stringify(repertorio), (err) => {
      if (err) {
        return res.status(500).send('Error al escribir en el archivo');
      }
      res.send('Canción actualizada');
    });
  });
});

// Ruta para eliminar una canción
app.delete('/canciones/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile(REPERTORIO_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer el archivo');
    }
    let repertorio = JSON.parse(data);
    repertorio = repertorio.filter(cancion => cancion.id != id);
    fs.writeFile(REPERTORIO_FILE, JSON.stringify(repertorio), (err) => {
      if (err) {
        return res.status(500).send('Error al escribir en el archivo');
      }
      res.send('Canción eliminada');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});