// Sincronizar las letras con la canción
// Müzik çalma sorumluluğu main.js'teki startMusic() fonksiyonuna devredilmiştir.
var audio = document.querySelector("audio"); 
// Yeni div'ler tanımlandı
var lyricsLeft = document.querySelector("#lyricsLeft"); 
var lyricsRight = document.querySelector("#lyricsRight"); 
var lyricsCenter = document.querySelector("#lyricsCenter"); 

// Array de objetos: Şarkı sözleri ve pozisyonları, kullanıcı tarafından belirlenen time değerleri korunmuştur.
var lyricsData = [
  // Giriş/Verse 1 (ZAMANLAR AYNI KALDI)
  { text: "The feeling was stronger", time: 1, position: 'left' }, 
  { text: "The shock hit eleven, got lost in your eyes", time: 5, position: 'right' }, 
  
  // Nakarat 1 (ZAMANLAR AYNI KALDI)
  { text: "I can't do well when I think you're gonna leave", time: 13, position: 'left' }, 
  { text: "But I know I try", time: 15, position: 'right' }, 
  { text: "Are you gonna leave me now?", time: 19, position: 'left' }, 
  { text: "Can't you be believing now?", time: 23, position: 'right' }, 
  
  // Nakarat 2 (ZAMANLAR AYNI KALDI)
  { text: "I can't do well when I think you're gonna leave", time: 27, position: 'left' }, 
  { text: "But I know I try", time: 29, position: 'right' }, 
  { text: "Are you gonna leave me now?", time: 32, position: 'left' }, 
  { text: "Can't you be believing now?", time: 35, position: 'right' }, 

  // Enstrümantal Kısmın Devamı (Bu satırlar en son +3 saniye kaydırılmıştı)
  { text: "Can you remember and humanize?", time: 43, position: 'left' }, 
  { text: "It was still where we'd energised", time: 46, position: 'right' },
  { text: "Lie in the sand and visualise", time: 49, position: 'left' },
  { text: "Like it's '75 again", time: 52, position: 'right' },
  
  // Bu satırlar (+3) +3 saniye kaydırılmıştı
  { text: "We are the people that rule the world", time: 59, position: 'left' }, 
  { text: "A force running in every boy and girl", time: 62, position: 'right' }, 
  
  // BU SATIRLAR (+2) +2 SANİYE KAYDIRILMIŞTI
  { text: "All rejoicing in the world", time: 67, position: 'left' }, 
  { text: "Take me now", time: 69, position: 'right' },
  { text: "We can try", time: 71, position: 'left' },
	
  // Bu satırlar en son +1 saniye kaydırılmıştı (+2 saniye eklenmişti)
  { text: "I can't do well", time: 73, position: 'right' }, 
  { text: "When I think you're gonne leave me", time: 75, position: 'left' }, 
  { text: "But I know I try", time: 78, position: 'right' }, 
  { text: "Are you gonna leave me now?", time: 80, position: 'left' }, 

  { text: "Can't you be believing now?", time: 83, position: 'right' }, 
  { text: "I can't do well", time: 87, position: 'left' }, 
  { text: "When I think you're gonna leave me", time: 89, position: 'right' }, 
  { text: "But I know I try", time: 92, position: 'left' }, 
  
  { text: "Are you gonna leave me now?", time: 94, position: 'right' }, 
  { text: "Can't you be believing now?", time: 97, position: 'left' }, 
    
  // BU SATIR VE SONRASINDAKİ TÜM ZAMANLARA EKSTRA 3 SANİYE EKLENDİ.
  // 101 + 3 = 104
  { text: "I know everything about you", time: 104, position: 'right' }, 
  { text: "You know everything about me", time: 108, position: 'left' }, // 104 + 3 = 107
    
  // Nakarat Tekrarı
  { text: "We know everything about us ", time: 113, position: 'right' }, // 107 + 3 = 110
  { text: "I know everythin about you", time: 120, position: 'left' }, // 114 + 3 = 117
  { text: "You know everything about me", time: 124, position: 'right' }, // 118 + 3 = 121
  { text: "We know everything about us", time: 128, position: 'left' }, // 122 + 3 = 125

  // Özel Mesajlar (Ortada gösterilecek)
  { text: "DOĞUM GÜNÜN KUTLU OLSUN!", time: 133, position: 'center' }, // 130 + 3 = 133
  { text: "UMARIM HER YAŞIN KENDİN KADAR GÜZEL OLUR...", time: 137, position: 'center' }, // 134 + 3 = 137
	{ text:"BEN BURDA OLMASAM BİLE BU SİTE HER ZAMAN SENİN İÇİN BURADA OLACAK",time:147,position: 'center'},
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
  
  var foundIndex = -1;

  // O anda gösterilmesi gereken satırı bul
  for (let i = 0; i < lyricsData.length; i++) {
        // Şu anki zaman, bu satırın başlangıç zamanından büyük veya eşit mi?
        if (time >= lyricsData[i].time) {
            // Eğer bu son satır değilse (bir sonraki satır var)
            if (i < lyricsData.length - 1) {
                // Bir sonraki satırın zamanı gelmediyse, bu satırı göster.
                if (time < lyricsData[i + 1].time) {
                    foundIndex = i;
                    break;
                }
            } else {
                // Bu son satırsa, şarkı bitene kadar göster.
                // Şarkının bitişini tahmin etmek için 6 saniye daha ekleyelim.
                if (time < lyricsData[i].time + 6) { 
                    foundIndex = i;
                    break;
                }
            }
        }
  }
  
  resetLyrics(); 

  if (foundIndex !== -1) {
        let currentLine = lyricsData[foundIndex];
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

// Başlık gizleme zamanı (En son özel mesaj 137. saniyede başlıyor, 6 saniye sonra gizlensin.)
setTimeout(ocultarTitulo, 143000); // 137 + 6 = 143 saniye -> 143000 milisaniye
