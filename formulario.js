{/* <script> */}

  var firmaBase64 = '';

  window.onload = function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var isDrawing = false;
    var lastX = 0;
    var lastY = 0;

    // Set initial canvas background
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawingTouch);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', drawTouch);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function startDrawingTouch(e) {
      isDrawing = true;
      var rect = canvas.getBoundingClientRect();
      [lastX, lastY] = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
      e.preventDefault();
    }

    function draw(e) {
      if (!isDrawing) return;
      drawLine(lastX, lastY, e.offsetX, e.offsetY);
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function drawTouch(e) {
      if (!isDrawing) return;
      var rect = canvas.getBoundingClientRect();
      drawLine(lastX, lastY, e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      [lastX, lastY] = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
      e.preventDefault();
    }

    function stopDrawing() {
      isDrawing = false;
    }

    function drawLine(x1, y1, x2, y2) {
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.strokeStyle = '#000';
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    }
  };

  function guardarDatos() {
    var nombre = document.getElementById('nombre').value.trim();
    var cargo = document.getElementById('cargo').value.trim();
    var cedula = document.getElementById('cedula').value.trim();
    var pregunta1 = document.getElementById('pregunta1').value.trim();
    var antiguedad = document.getElementById('antiguedad').value.trim();
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    firmaBase64 = canvas.toDataURL();

    if (!nombre || !cargo || !cedula || !pregunta1 || !antiguedad) {
      alert('Por favor, complete todos los campos del formulario.');
      return false;
    }

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imageData.data;
    var tieneFirma = Array.from(pixels).some((pixel, i) => i % 4 === 3 && pixel !== 0);

    if (!tieneFirma) {
      alert('Por favor, firme antes de enviar el formulario.');
      return false;
    }

    google.script.run.withSuccessHandler(function() {
      document.getElementById('nombre').value = '';
      document.getElementById('cargo').value = '';
      document.getElementById('cedula').value = '';
      document.getElementById('pregunta1').value = '';
      document.getElementById('antiguedad').value = '';
      limpiarCanvas();
      alert('Formulario Enviado');
    }).guardarDatosYFirma(nombre, cargo, cedula, pregunta1, firmaBase64, antiguedad);

    return false;
  }

  function limpiarCanvas() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    firmaBase64 = '';
  }

{/* </script> */}

