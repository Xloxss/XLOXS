// Sincronizar las letras con la canción
// Müzik çalma sorumluluğu main.js'teki startMusic() fonksiyonuna devredilmiştir.
var audio = document.querySelector("audio"); 
// Yeni div'ler tanımlandı
var lyricsLeft = document.querySelector("#lyricsLeft"); 
var lyricsRight = document.querySelector("#lyricsRight"); 
var lyricsCenter = document.querySelector("#lyricsCenter"); 

// Array de objetos que içerir, kullanıcı tarafından belirlenen yeni zamanları ve pozisyonları.
// Ekranda kalma süresi 6 saniye olarak ayarlanmıştır.
var lyricsData = [
  // Çiçeklerin SAĞ ve SOL tarafında sırayla gösterilecek sözler
  { text: "Fikrimin ince gülü", time: 19, position: 'left' }, 
  { text: "Kalbimin şen bülbülü", time: 24, position: 'right' },
  { text: "Fikrimin ince gülü", time: 28, position: 'left' },
  { text: "Kalbimin şen bülbülü", time: 33, position: 'right' },
  
  { text: "O gün ki gördüm seni", time: 38, position: 'left' },
  { text: "Yaktın ah yaktın beni", time: 43, position: 'right' },
  { text: "O gün ki gördüm seni", time: 47, position: 'left' },
  { text: "Yaktın ah yaktın beni", time: 52, position: 'right' },
  
  // Enstrümantal Ara (Boşluklar)
  
  { text: "Gördüğüm günden beri", time: 57, position: 'left' }, 
  { text: "Olmuşum inan deli", time: 61, position: 'right' },
  { text: "Gördüğüm günden beri", time: 67, position: 'left' },
  { text: "Olmuşum inan deli", time: 71, position: 'right' },
  
  { text: "O gün ki gördüm seni", time: 76, position: 'left' }, 
  { text: "Yaktın ah yaktın beni", time: 80, position: 'right' }, 
  { text: "O gün ki gördüm seni", time: 85, position: 'left' }, 
  { text: "Yaktın ah yaktın beni", time: 90, position: 'right' }, 
  
  // *** BURADAKİ ZAMAN DEĞİŞTİ: 94 + 43 = 137 ***
  { text: "Ateşli dudakların", time: 133, position: 'left' }, 
  { text: "Gamzeli yanakların", time: 137, position: 'right' }, // 137 + 6 = 143
  { text: "Ateşli dudakların", time: 142, position: 'left' }, // 143 + 6 = 149
  { text: "Gamzeli yanakların", time: 147, position: 'right' }, // 149 + 6 = 155

  { text: "O gün ki gördüm seni", time: 152, position: 'left' }, // 155 + 6 = 161
  { text: "Yaktın ah yaktın beni", time: 156, position: 'right' }, // 161 + 6 = 167
  { text: "O gün ki gördüm seni", time: 162, position: 'left' }, // 167 + 6 = 173
  { text: "Yaktın ah yaktın beni", time: 166, position: 'right' }, // 173 + 6 = 179

  { text: "Ellerin ellerimde", time: 170, position: 'left' }, // 179 + 6 = 185
  { text: "Leblerin leblerimde", time: 175, position: 'right' }, // 185 + 6 = 191
  { text: "Ellerin ellerimde", time: 180, position: 'left' }, // 191 + 6 = 197
  { text: "Leblerin leblerimde", time: 185, position: 'right' }, // 197 + 6 = 203

  { text: "O gün ki gördüm seni", time: 190, position: 'left' }, // 203 + 6 = 209
  { text: "Yaktın ah yaktın beni", time: 194, position: 'right' }, // 209 + 6 = 215
  { text: "O gün ki gördüm seni", time: 199, position: 'left' }, // 215 + 6 = 221
  { text: "Yaktın ah yaktın beni", time: 204, position: 'right' }, // 221 + 6 = 227

  // Son Tekrarlar
  { text: "O gün ki gördüm seni", time: 208, position: 'left' }, // 227 + 6 = 233
  { text: "Yaktın ah yaktın beni", time: 213, position: 'right' }, // 233 + 6 = 239
  { text: "O gün ki gördüm seni", time: 217, position: 'left' }, // 239 + 6 = 245
  
  // Özel Mesajlar (Ortada gösterilecek)
  { text: "Doğum Günün Kutlu Olsun!", time: 222, position: 'center' }, // 245 + 6 = 251
  { text: "Mutlu Yıllar!", time: 225, position: 'center' }, // 251 + 6 = 257
];

// Sözleri sıfırlayan yardımcı fonksiyon
function resetLyrics() {
    lyricsLeft.style.opacity = 0;
    lyricsLeft.innerHTML = "";
    lyricsRight.style.opacity = 0;
    lyricsRight.innerHTML = "";
    lyricsCenter.style.opacity = 0;
    lyricsCenter.innerHTML = "";
}

// Animar las letras
function updateLyrics() {
  // Müzik henüz başlamadıysa sözleri göstermeyi engelle
  if (audio.paused && audio.currentTime === 0 && !audio.ended) {
    resetLyrics();
    return; 
  }

  var time = Math.floor(audio.currentTime);
  
  // Tüm alanları önce gizle
  resetLyrics();

  // O anda gösterilmesi gereken satırı bul
  var currentLine = lyricsData.find(
    // EKRANDA KALMA SÜRESİ 6 SANİYEYE AYARLANDI.
    (line) => time >= line.time && time < line.time + 6
  );

  if (currentLine) {
    // Satırı pozisyonuna göre ilgili div'e yazdır ve görünür yap (opaklık 1)
    if (currentLine.position === 'left') {
        lyricsLeft.innerHTML = currentLine.text;
        lyricsLeft.style.opacity = 1;
    } else if (currentLine.position === 'right') {
        lyricsRight.innerHTML = currentLine.text;
        lyricsRight.style.opacity = 1;
    } else if (currentLine.position === 'center') {
        lyricsCenter.innerHTML = currentLine.text;
        lyricsCenter.style.opacity = 1;
    }
  } 
  // Eğer currentLine yoksa, resetLyrics zaten tüm alanları gizlemiştir.
}

// Sözleri saniyede bir güncelle
setInterval(updateLyrics, 1000);

//funcion titulo
// Función para ocultar el título después de 216 segundos
function ocultarTitulo() {
  var titulo = document.querySelector(".titulo");
  titulo.style.animation =
    "fadeOut 3s ease-in-out forwards"; /* Duración y función de temporizasyon de la desaparición */
  setTimeout(function () {
    titulo.style.display = "none";
  }, 3000); // 3 saniye sonra tamamen kaldır
}

// Başlık gizleme zamanı (Son söz 257. saniyede başlıyor. Ek olarak 6 saniye sonra gizlensin.)
setTimeout(ocultarTitulo, 263000); // 257 + 6 = 263 saniye -> 263000 milisaniye