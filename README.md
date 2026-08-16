# Mamino Ogrodzenia — landing page

Statyczny landing page (HTML + CSS + vanilla JS) dla Mamino Ogrodzenia —
sprzedaż i montaż ogrodzeń panelowych, płn. Mazowsze. Gotowy do wdrożenia na
Netlify, bez backendu (leady zbiera Netlify Forms).

### Struktura plików

```
index.html           — cała strona (9 sekcji: hero, kalkulator, ...)
css/mamino.css       — zmienne kolorów/typografii z brand kitu, style sekcji
js/calculator.js     — logika kalkulatora ceny + wysyłka formularza leada
js/tracking.js       — wysyłka zdarzeń do dataLayer (GTM) i Meta Pixel
js/animations.js     — cień nagłówka po scrollu + reveal-on-scroll (IntersectionObserver)
assets/              — logo, zdjęcia realizacji, tła SVG
netlify.toml         — konfiguracja deployu
```

### Jak wdrożyć na Netlify

1. Połącz repozytorium z Netlify (branch `claude/mamino-ogrodzenia-landing-uf45d1`
   lub branch docelowy po scaleniu) — build command: brak, publish directory: `.`
2. Strona główna to `index.html`, więc działa pod „/” bez żadnych
   przekierowań (żaden redirect nie jest potrzebny).
3. Po pierwszym deployu w panelu Netlify → **Forms** pojawi się formularz
   `wycena` — tam trafiają leady (imię + telefon + orientacyjna cena).
   Można podpiąć powiadomienia e-mail/Slack w ustawieniach formularza.
4. Podmień treści oznaczone `TODO` / `[MISSING]` w `index.html` przed
   publikacją (patrz sekcja "Do uzupełnienia przed publikacją" niżej).

### Jak wstawić prawdziwy Meta Pixel ID

W pliku `js/tracking.js`:

1. Znajdź linię `var PIXEL_ID = "PIXEL_ID";` (oznaczona „KROK 1") i wstaw
   prawdziwe ID Pixela.
2. Odkomentuj cały blok „KROK 2" tuż poniżej (bootstrap `fbq('init', ...)`).
   Funkcja `track()` sama zacznie wysyłać zdarzenia do Pixela, nic więcej nie
   trzeba zmieniać.
3. Zdarzenia już są spięte z klikami/submitami: `cta_hero`, `cta_final`,
   `cta_header`, `calc_start` (pierwsza interakcja z kalkulatorem),
   `calc_submit` (wysłanie formularza wyceny). Sprawdzisz je w konsoli
   przeglądarki (`console.log("[tracking]", ...)`) albo w Google Tag
   Manager przez `window.dataLayer`.

### Gdzie jest konfiguracja cen kalkulatora

Wszystkie stawki i mnożniki są w jednym miejscu: obiekt `PRICING` na górze
pliku `js/calculator.js`. Aktualne wartości to **przykładowe dane robocze**,
oznaczone komentarzem `// TODO: podtwierdzić w kliencie` — nie są to
potwierdzone ceny. Przed publikacją zastąp je realnym cennikiem:

- `basePricePerMb` — cena bazowa zł/mb zależna od rodzaju panelu:
  `{ "3d": 38, "2d": 60 }` (ceny startowe wg klienta; 103 cm, drut 4 mm,
  słupek 1,5 mm, bez dodatków)
- `heightMultiplier`, `wireMultiplier`, `postMultiplier` — mnożniki ceny/mb
  (wspólne dla 2D i 3D — jeśli mają się różnić, do potwierdzenia z klientem)
- `colorSurchargePerMb` — dopłata za kolor
- `podmurowkaPerMb` — dopłata za podmurówkę systemową
- `furtkaPrice` — cena za sztukę furtki
- `bramaPrice` — cena za bramę (dwuskrzydłową / przesuwną; brak bramy = 0 zł)
- `option` — dopłata/koszt za montaż przez ekipę vs. tylko materiał

Reszta kodu kalkulatora nie wymaga zmian — liczy się automatycznie na
podstawie tego obiektu.

Kalkulator zakłada maksymalnie jedną bramę na wycenę (wybór typu w polu
„Brama” obejmuje już brak/dwuskrzydłową/przesuwną). Jeśli klient potrzebuje
wyceniać więcej niż jedną bramę, trzeba rozbudować to pole o osobną liczbę
sztuk — jak wcześniej przy furtce.

### Animacje

Strona ma subtelne, automatyczne animacje: wejście treści hero przy
załadowaniu, delikatny puls badge z gwiazdkami, "unoszenie się" fali między
sekcjami, płynne pojawianie się kart/kroków/zdjęć przy scrollowaniu (reveal-
on-scroll, `js/animations.js`) oraz puls ceny w kalkulatorze przy każdej
zmianie parametrów. Mikro-interakcje na hover (przyciski, karty, galeria,
pigułki miast) działają zawsze. Wszystkie automatyczne animacje są
wyłączone, gdy użytkownik ma w systemie włączone „ogranicz animacje”
(`prefers-reduced-motion: reduce`) — treść zostaje wtedy w pełni widoczna,
tylko bez ruchu.

### Responsywność (desktop + telefon)

Układ desktopowy jest bazowy, a responsywność dodano na końcu
`css/mamino.css` w sekcji RESPONSYWNOŚĆ (media queries 980 / 600 / 380 px):
kalkulator i siatki zwijają się do jednej/dwóch kolumn, nagłówki i hero
skalują czcionki, w nagłówku na telefonie chowa się długie CTA (pozostaje
klikalny numer + przyciski w hero i na dole). Meta viewport jest już w
`<head>`. Brak poziomego przewijania na 390 px (sprawdzone).

### Do uzupełnienia przed publikacją

W `index.html` oznaczono komentarzami `TODO` / `[MISSING]` miejsca, których
**nie wolno było wypełnić wymyślonymi faktami**:

- Sekcja **Jak montujemy**, gwarancja: brak konkretnego okresu gwarancji,
  do potwierdzenia z klientem.
- Sekcja **Zasięg**: przykładowa lista miejscowości płn. Mazowsza, do
  potwierdzenia dokładnego promienia/listy miast z klientem.
- **Logo** (`assets/logo.svg`) to odtworzony znak (domek z czerwonym dachem
  + MAMINO OGRODZENIA). Jeśli macie oryginalny plik, podmieńcie go.

Gotowe (uzupełnione): **hero** używa prawdziwego zdjęcia (`realizacje-1`),
sekcja **Opinie** ma 4 prawdziwe opinie z Google, a galeria **Realizacje**
pokazuje 6 prawdziwych zdjęć (realizacje-2..7; realizacje-1 jest w hero).

Dane, które **są** podane wprost w briefie i użyte bez zmian: telefon
`518 784 697`, badge „4,8★ w 44 opiniach Google”.