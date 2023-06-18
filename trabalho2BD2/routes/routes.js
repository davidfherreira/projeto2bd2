const express = require('express');
const Evento = require('../models/evento');
const router = express.Router();

router.get('/eventos', (req, res) => {
  Evento.find()
    .then(eventos => {
      res.json(eventos);
    })
    .catch(error => {
      console.error('Erro ao buscar eventos:', error);
      res.status(500).json({ error: 'Erro ao buscar eventos' });
    });
});

router.get('/eventossalvos', (req, res) => {
  Evento.find()
    .then(eventos => {
      res.render('eventossalvos', { eventos });
    })
    .catch(error => {
      console.error('Erro ao buscar eventos:', error);
      res.redirect('/');
    });
});

router.post('/eventossalvos/buscar', (req, res) => {
  const { busca } = req.body;
  Evento.find({ $text: { $search: busca } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .then(eventos => {
      res.render('eventossalvos', { eventos });
    })
    .catch(error => {
      console.error('Erro ao buscar eventos:', error);
      res.redirect('/eventossalvos');
    });
});

router.post('/salvarevento', (req, res) => {
  const { titulo, descricao, dataInicio, dataFim, latitude, longitude } = req.body;

  const evento = new Evento({
    titulo,
    descricao,
    dataInicio,
    dataFim,
    localizacao: {
      latitude,
      longitude
    }
  });

  evento.save()
    .then(() => {
      console.log('Evento salvo:', evento);
      res.redirect('/eventossalvos');
    })
    .catch(error => {
      console.error('Erro ao salvar evento:', error);
      res.redirect('/');
    });
});

router.post('/excluirevento/:id', (req, res) => {
  const { id } = req.params;

  Evento.findByIdAndDelete(id)
    .then(() => {
      console.log('Evento excluído:', id);
      res.redirect('/eventossalvos');
    })
    .catch(error => {
      console.error('Erro ao excluir evento:', error);
      res.redirect('/eventossalvos');
    });
});

router.get('/editarevento/:id', (req, res) => {
  const { id } = req.params;
  Evento.findById(id)
    .then(evento => {
      res.render('editarevento', { evento });
    })
    .catch(error => {
      console.error('Erro ao buscar evento:', error);
      res.redirect('/eventossalvos');
    });
});

router.post('/atualizarevento/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, dataInicio, dataFim, latitude, longitude } = req.body;

  Evento.findByIdAndUpdate(
    id,
    {
      titulo,
      descricao,
      dataInicio,
      dataFim,
      localizacao: {
        latitude,
        longitude
      }
    },
    { new: true }
  )
    .then(() => {
      res.redirect('/eventossalvos');
    })
    .catch(error => {
      console.error('Erro ao atualizar evento:', error);
      res.redirect('/eventossalvos');
    });
});

module.exports = router;
