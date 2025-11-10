// Bu fonksiyon flower.html'deki görünür butona tıklandığında çalışır.
window.startMusic = function() {
    const audioEl = document.querySelector('audio');
    const button = document.getElementById('musicButton');

    if (audioEl) {
        audioEl.play().then(() => {
            // Başarılı olursa sesi aç
            audioEl.muted = false;

            // Butonu kaybet ve kaldır
            if (button) {
                // Kaybolma animasyonu (CSS transition kullanılır)
                button.style.opacity = '0';
                button.style.transform = 'scale(0.8)';

                // CSS geçişi bittikten sonra butonu DOM'dan kaldır
                setTimeout(() => {
                    button.remove();
                }, 300); // CSS transition süresi ile eşleşmeli
            }
        }).catch(error => {
            console.error("Müzik çalma hatası:", error);
            // Hata durumunda da butonu kaldırabiliriz.
            if (button) {
                button.remove();
            }
        });
    }
};

onload = () =>{
    document.body.classList.remove("container");

    // Ses elemanını anim.js için hazırla.
    const audioEl = document.querySelector('audio');
    if(audioEl) {
        audioEl.load();
    }
};