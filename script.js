// Звук клика
const clickSound = new Audio('click.mp3');

let originalFile;

const dropArea = document.getElementById("dropArea");
const uploadInput = document.getElementById("upload");
const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

// Обновление значения ползунка
function updateSlider() {
  qualityValue.innerText = Math.round(qualitySlider.value*100) + "%";
  qualitySlider.style.background = `linear-gradient(to right, #667eea ${qualitySlider.value*100}%, #ccc ${qualitySlider.value*100}%)`;
}
qualitySlider.addEventListener("input", updateSlider);
updateSlider();

// Загрузка файла
uploadInput.addEventListener("change", handleFile);

// Drag & Drop
dropArea.addEventListener("dragover", function(e){
  e.preventDefault();
  dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", function(){
  dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", function(e){
  e.preventDefault();
  dropArea.classList.remove("dragover");
  const files = e.dataTransfer.files;
  if(files.length){
    uploadInput.files = files;
    handleFile({target:{files}});
  }
});

function handleFile(e){
  const file = e.target.files[0];
  if(!file) return;
  originalFile = file;
  document.getElementById("original").src = URL.createObjectURL(file);
  document.getElementById("originalSize").innerText = (file.size/1024).toFixed(1) + " KB";
}

// Сжатие без изменения размеров
function compress() {
  if(!originalFile) return alert("Сначала выберите изображение!");
  
  const quality = parseFloat(qualitySlider.value);

  const reader = new FileReader();
  reader.readAsDataURL(originalFile);
  reader.onload = function(event){
    const img = new Image();
    img.src = event.target.result;
    img.onload = function(){

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const compressed = canvas.toDataURL("image/jpeg", quality);

      document.getElementById("compressed").src = compressed;
      const size = Math.round((compressed.length*3/4)/1024);
      document.getElementById("compressedSize").innerText = size + " KB";

      const link = document.getElementById("download");
      link.href = compressed;
      link.download = "compressed.jpg";
    }
  }
}

// Звук на кнопку "Сжать"
document.querySelector('button').addEventListener('click', ()=>{
    clickSound.currentTime = 0; // перематываем на начало
    clickSound.play();
});

// Звук на кнопку "Скачать"
document.getElementById('download').addEventListener('click', ()=>{
    clickSound.currentTime = 0;
    clickSound.play();
});

/* открытие инфо */

const modal = document.getElementById("infoModal");
const btn = document.getElementById("infoBtn");
const close = document.querySelector(".close");

btn.addEventListener("click", function() {
  modal.classList.add("show");
});

close.addEventListener("click", function() {
  modal.classList.remove("show");
});

window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.classList.remove("show");
  }
});