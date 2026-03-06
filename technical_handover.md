# Instrukcja Techniczna: Tracking, SEO i Konfiguracja

Ten dokument zawiera wszystkie niezbędne informacje do zakończenia konfiguracji Twojego landing page'a.

## 1. Miejsca do uzupełnienia (Placeholdery)

W plikach HTML (szukaj `CTRL+F`) znajdują się następujące znaczniki, które powinieneś zastąpić swoimi ID:

- `[[GTM_ID]]` — Twój GTM Container ID (np. GTM-W2NR9XZZ).
- `[[GSC_VERIFICATION]]` — Kod weryfikacyjny z Google Search Console.
- `[[ADS_CONV_ID]]` — ID konwersji Google Ads (np. 123456789).
- `[[ADS_CONV_LABEL]]` — Etykieta konwersji Google Ads (np. abcdefg123).
- `[[PHONE_NUMBER]]` — Numer telefonu (format: +48 123 456 789).
- `[[EMAIL_ADDRESS]]` — Adres e-mail (np. kontakt@restartis.pl).

---

## 2. Instrukcja SSL / HTTPS

Twoja strona na GitHub Pages automatycznie obsługuje SSL, ale musisz go wymusić:

1. Przejdź do swojego repozytorium na GitHubie.
2. Kliknij **Settings** → **Pages**.
3. W sekcji **Custom domain** upewnij się, że Twoja domena `restartis.pl` jest dodana.
4. Zaznacz checkbox **Enforce HTTPS**.
   - *Uwaga*: Jeśli opcja jest nieaktywna, poczekaj ok. 15-30 minut, aż GitHub zweryfikuje certyfikat dla Twojej domeny.
5. Wszystkie linki w kodzie zostały już przygotowane jako relatywne lub HTTPS.

---

## 3. Google Search Console (GSC)

1. Wejdź na [search.google.com/search-console/](https://search.google.com/search-console/).
2. Dodaj nową usługę (Property) typu **URL Prefix** i wpisz `https://restartis.pl/`.
3. Wybierz metodę weryfikacji **HTML Tag**.
4. Skopiuj wartość atrybutu `content="..."` i wklej ją w miejsce `[[GSC_VERIFICATION]]` w plikach `index.html`.
5. Po wypchnięciu kodu na GitHub, kliknij **Verify** w GSC.
6. Przejdź do zakładki **Sitemaps** i dodaj: `https://restartis.pl/sitemap.xml`.

---

## 4. Konfiguracja GTM (Google Tag Manager)

Wszystkie zdarzenia (`form_submit`, `phone-click`, `email-click`) są wysyłane do `dataLayer`. Musisz w GTM stworzyć:

- **Triggery**: 
  - Custom Event: `form_submit`
  - Click - Just Links: Kliknięcia w linki z atrybutem `data-track`.
- **Tagi**:
  - Google Tag (GA4 Configuration) z Twoim Measurement ID.
  - GA4 Event: `generate_lead` (triggerowany przez `form_submit`).
  - Google Ads Conversion Tracking (triggerowany przez `form_submit` na stronie `/thank-you`).

---

## 5. Pliki Techniczne
- `sitemap.xml` — Mapa strony dla Google.
- `robots.txt` — Instrukcje dla robotów (blokuje indeksację strony `/thank-you`).
