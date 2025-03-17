window.ui = {
  state: 'loading',
  readyToCollect: false,
  nExamples: 0,
  nTrainings: 0,

  setContent: function(key, value) {
    // Set an element's content based on the data-content key.
    $('[data-content="' + key + '"]').html(value);
  },

  showInfo: function(text, dontFlash) {
    // Show info and beep / flash.
    this.setContent('info', text);
    if (!dontFlash) {
      $('#info').addClass('flash');
      new Audio('hint.mp3').play();
      setTimeout(function() {
        $('#info').removeClass('flash');
      }, 1000);
    }
  },

  onWebcamEnabled: function() {
    this.state = 'finding face';
    this.showInfo("Теперь давай найдём твоё лицо! 🤨", true);
  },

  onFoundFace: function() {
    if (this.state == 'finding face') {
      this.state = 'collecting';
      this.readyToCollect = true;
      this.showInfo(
        "<h3>Давай начнём! 🙂</h3>" +
          'Собирайте точки данных, перемещая мышь по экрану, следя глазами за курсором и несколько раз нажимая клавишу пробела 👀',
        true,
      );
    }
  },

  onAddExample: function(nTrain, nVal) {
    // Call this when an example is added.
    this.nExamples = nTrain + nVal;
    this.setContent('n-train', nTrain);
    this.setContent('n-val', nVal);
    if (nTrain >= 2) {
      $('#start-training').prop('disabled', false);
    }
    if (this.state == 'collecting' && this.nExamples == 5) {
      this.showInfo(
        '<h3>Продолжай дальше!</h3>' +
          'Вам нужно собрать не менее 20 точек данных, чтобы начать видеть результаты.',
      );
    }
    if (this.state == 'collecting' && this.nExamples == 25) {
      this.showInfo(
        '<h3>Хорошая работа! 👌</h3>' +
          "Теперь, когда у вас есть несколько примеров, давайте обучим нейронную сеть!<br> " +
          'Нажмите на кнопку тренировки в правом верхнем углу!',
      );
    }
    if (this.state == 'trained' && this.nExamples == 50) {
      this.showInfo(
        '<h3>Превосходно 👏</h3>' +
          "Вы собрали множество примеров. Давайте попробуем потренироваться еще раз!",
      );
    }
    if (nTrain > 0 && nVal > 0) {
      $('#store-data').prop('disabled', false);
    }
  },

  onFinishTraining: function() {
    // Call this when training is finished.
    this.nTrainings += 1;
    $('#target').css('opacity', '0.9');
    $('#draw-heatmap').prop('disabled', false);
    $('#reset-model').prop('disabled', false);
    $('#store-model').prop('disabled', false);

    if (this.nTrainings == 1) {
      this.state = 'trained';
      this.showInfo(
        '<h3>Здорово! 😍</h3>' +
          'Зелёный кружок будет следовать за твоим взглядом<br>' +
          "Я думаю, это все еще очень плохо... 😅<br>" +
          "Давайте соберем больше тренировочных данных! Продолжайте следить за курсором мыши и нажимайте пробел.",
      );
    } else if (this.nTrainings == 2) {
      this.state = 'trained_twice';
      this.showInfo(
        '<h3>Становится лучше! 🚀</h3>' +
          'Продолжайте собирать и сохранять!<br>' +
          'Вы также можете нарисовать тепловую карту, которая покажет вам, ' +
          ' где у вашей модели есть сильные и слабые стороны.',
      );
    } else if (this.nTrainings == 3) {
      this.state = 'trained_thrice';
      this.showInfo(
        'Если ваша модель перегружена, помните, что вы можете сбросить ее в любое время 👻',
      );
    } else if (this.nTrainings == 4) {
      this.state = 'trained_thrice';
      this.showInfo(
        '<h3>Наслаждайтесь! 🙂</h3>',
      );
    }
  },
};
