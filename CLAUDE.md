# Ordoflow Automation Savings Calculator — Specyfikacja Projektu

> **Ten plik to "biblia" projektu.** Claude Code czyta go automatycznie na starcie każdej sesji.
> Szczegóły bieżącej fazy i postęp prac → patrz `PLAN.md`

---

## 🎯 KONTEKST

Firma **Ordoflow** — automatyzacja procesów biznesowych (n8n). Aplikacja to **Kalkulator Oszczędności z Automatyzacji** — interaktywny wizard, który pomaga potencjalnym klientom zobaczyć realne korzyści finansowe z wdrożenia automatyzacji.

Aplikacja docelowo będzie:
- Postawiona na **Coolify** (self-hosted PaaS) jako osobny serwis
- Osadzona na stronie głównej Ordoflow (iframe lub subdomena)
- Spójna wizualnie ze stroną główną Ordoflow

---

## 🏗️ STACK TECHNOLOGICZNY

- **Framework:** Next.js 14+ (App Router), TypeScript (strict)
- **Backend/CMS:** Payload CMS 3.x (zintegrowany z Next.js)
- **Baza danych:** PostgreSQL
- **Stylowanie:** Tailwind CSS (konfiguracja skopiowana ze strony głównej Ordoflow — patrz Faza 0)
- **Wykresy:** Recharts
- **Email:** React Email + Resend (fallback: nodemailer)
- **Deployment:** Docker + docker-compose → Coolify
- **Biblioteki UI:** Dopasowane do strony głównej (ustalane w Fazie 0)

---

## 📂 STRUKTURA PROJEKTU

```
ordoflow-calculator/
├── CLAUDE.md                   # TEN PLIK — specyfikacja
├── PLAN.md                     # Stan prac, decyzje, postęp
├── src/
│   ├── app/
│   │   ├── (frontend)/         # Publiczny kalkulator
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (payload)/          # Panel admina Payload
│   │   │   └── admin/
│   │   ├── api/
│   │   │   ├── calculate/route.ts
│   │   │   └── send-report/route.ts
│   │   └── layout.tsx
│   ├── collections/
│   │   ├── Automations.ts
│   │   ├── Categories.ts
│   │   └── Leads.ts
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── StepCategory.tsx
│   │   │   ├── StepAutomations.tsx
│   │   │   ├── StepConfiguration.tsx
│   │   │   ├── StepContact.tsx
│   │   │   └── StepSummary.tsx
│   │   ├── ui/
│   │   └── charts/
│   ├── lib/
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── calculations.ts
│   │   └── format.ts
│   ├── store/                  # Stan globalny (Context lub zustand)
│   ├── emails/                 # Szablony React Email
│   ├── seed/
│   │   ├── data.json           # Dane z Excela (113 automatyzacji)
│   │   └── seed.ts             # Skrypt seedujący Payload
│   └── payload.config.ts
├── public/
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## 📊 MODEL DANYCH (Payload CMS)

### Categories
| Pole | Typ | Opis |
|------|-----|------|
| name | text, required | np. "Social Media & Wideo" |
| slug | text, required, unique | np. "social-media-wideo" |
| icon | text | Nazwa ikony (Lucide) |
| description | textarea | Opis kategorii |
| displayOrder | number (default: 0) | Kolejność wyświetlania |
| isActive | checkbox (default: true) | Widoczność |

### Automations
| Pole | Typ | Opis |
|------|-----|------|
| lp | number, required | Numer porządkowy |
| name | text, required | Nazwa automatyzacji po polsku |
| category | relationship → categories | Kategoria |
| integrations | text | np. "HTTP/Webhook, Sheets, AI" |
| descriptionTechnical | textarea | Opis działania |
| descriptionMarketing | textarea, required | Opis marketingowy (widoczny klientowi) |
| savingsMin | number, required | Min oszczędność h/tyg (np. 8) |
| savingsMax | number, required | Max oszczędność h/tyg (np. 12) |
| automationPercent | number (default: 75, min: 0, max: 100) | Domyślny % automatyzacji |
| isActive | checkbox (default: true) | Widoczność |

### Leads
| Pole | Typ | Opis |
|------|-----|------|
| firstName | text, required | Imię klienta |
| email | email, required | E-mail |
| phone | text | Telefon |
| company | text | Firma (opcjonalne) |
| currency | select: PLN/EUR/USD | Wybrana waluta |
| selectedAutomations | json | Konfiguracje wybranych automatyzacji |
| totalSavingsWeekly | number | Suma oszczędności tygodniowych |
| totalSavingsMonthly | number | Suma oszczędności miesięcznych |
| totalSavingsYearly | number | Suma oszczędności rocznych |
| reportSentAt | date | Data wysłania raportu |

---

## 🧭 FLOW UŻYTKOWNIKA (5 kroków wizarda)

### Krok 1: Wybór kategorii
- 13 kategorii jako kafelki z ikonami + badge z liczbą automatyzacji
- Multi-select (jedna lub wiele kategorii)
- Dane z API Payload (`/api/categories`)
- Przycisk "Dalej" → krok 2

### Krok 2: Wybór automatyzacji
- Lista automatyzacji z wybranych kategorii (z API Payload)
- Każda jako karta z: nazwą, opisem marketingowym (rozwijany), oszczędnością ("8-12h/tyg")
- Checkboxy do zaznaczania
- "Zaznacz wszystkie" per kategoria
- Wyszukiwarka/filtr po nazwie
- Przycisk "Dalej" → krok 3

### Krok 3: Konfiguracja parametrów
- Na górze: **wybór waluty** (PLN/EUR/USD) + **stawka godzinowa** (domyślnie: 50 PLN / 12 EUR / 15 USD)
- Per automatyzacja:
  - **Godziny tygodniowo** — input + slider, domyślna = średnia z zakresu (np. "8-12h" → 10)
  - **% automatyzacji** — suwak 0-100%, domyślna z bazy (75%)
- **Live preview** na dole — aktualizowane real-time:
  - Oszczędność tygodniowa / miesięczna / roczna

### Formuła kalkulacji:
```
oszczędność_tygodniowa = godziny × stawka × (% automatyzacji / 100)
oszczędność_miesięczna = oszczędność_tygodniowa × 4.33
oszczędność_roczna    = oszczędność_tygodniowa × 52
```

### Krok 4: Dane kontaktowe
- Pola: Imię (req), Email (req), Telefon (req), Firma (opt)
- Checkbox RODO (req) + checkbox marketing (opt)
- Honeypot antispam
- Przycisk "Wygeneruj raport"

### Krok 5: Podsumowanie / Raport
- Duże liczby: oszczędność tygodniowa / miesięczna / roczna (animowane count-up)
- Tabela szczegółowa (nazwa, kategoria, godz., %, oszczędności)
- **Wykres kołowy** — oszczędności wg kategorii
- **Wykres słupkowy** — top 5 automatyzacji wg oszczędności rocznych
- Komunikat: "Raport wysłany na [email]"
- CTA: "Umów bezpłatną konsultację"

---

## 📧 SYSTEM E-MAIL

### Do klienta
- Temat: "Twój raport oszczędności z automatyzacji — Ordoflow"
- Treść: powitanie, podsumowanie liczbowe, tabela automatyzacji, CTA

### Powiadomienie do Ordoflow (admin)
- Temat: "Nowy lead z kalkulatora: [Imię] [Firma]"
- Treść: dane kontaktowe, wybrane automatyzacje, oszczędności, link do Payload

---

## 🎨 DESIGN — ANALIZA REPO STRONY ORDOFLOW

### ⚡ KRYTYCZNE (Faza 0)

Przed napisaniem jakiegokolwiek kodu, przeanalizuj repozytorium strony głównej Ordoflow.

**Ścieżka do repo nie jest jeszcze ustalona.** Na początku Fazy 0 ZAPYTAJ użytkownika:
> "Podaj ścieżkę do lokalnego repozytorium strony Ordoflow (np. /home/user/projekty/ordoflow-website):"

Po otrzymaniu ścieżki, zapisz ją w PLAN.md w sekcji "Analiza brandingu" i przystąp do analizy.

**Analizuj w tej kolejności:**
1. `package.json` — zależności, biblioteki UI
2. `tailwind.config.ts/js` — kolory, fonty, spacing, breakpointy, extend
3. `globals.css` / CSS variables
4. `app/layout.tsx` — fonty, globalna struktura
5. Folder komponentów UI — wzorce Button, Card, Input, nagłówki
6. `public/` — logo, favicon, obrazy
7. Biblioteki animacji (Framer Motion? GSAP? CSS?)
8. Ewentualnie: shadcn/ui, Radix, inne systemy komponentów

**Wynik analizy zapisz w PLAN.md** w sekcji "Analiza brandingu".

**Zasada:** Kalkulator musi wyglądać jak naturalna część strony Ordoflow.

### Stałe zasady UX (niezależne od brandingu)
- Mobile-first, w pełni responsywny
- Progress bar / stepper na górze (5 kroków)
- Micro-interakcje, płynne przejścia między krokami
- Duże liczby oszczędności (3rem+, font-weight 800)
- Skeleton loaders na każdym kroku
- Obsługa `?embed=true` (ukrywa header/footer do osadzenia w iframe)

---

## 🔧 WYMAGANIA TECHNICZNE

- TypeScript strict mode
- Server Components domyślnie, Client Components tylko gdy potrzeba interaktywności
- Walidacja: zod (frontend + backend)
- SEO: meta tagi, Open Graph
- Accessibility: ARIA labels, keyboard nav, focus management
- i18n: na razie PL, struktura gotowa na rozszerzenie
- Rate limiting na `/api/send-report` (max 3/min per IP)
- Error handling z toast notifications
- Formatowanie walut: "12 500 PLN", "€4,200", "$5,100"

---

## 🔒 BEZPIECZEŃSTWO

- Zod walidacja po stronie serwera na każdym endpoincie
- Sanityzacja e-mail + telefon
- CSRF na formularzach
- Honeypot field (antispam)
- Rate limiting
- Sekrety wyłącznie w .env

---

## 🐳 DEPLOYMENT

### docker-compose.yml
- `app` — Next.js + Payload (port 3000)
- `db` — PostgreSQL 16

### .env.example
```env
DATABASE_URI=postgresql://ordoflow:password@db:5432/ordoflow_calculator
PAYLOAD_SECRET=your-secret-key-min-32-chars
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=Ordoflow <noreply@ordoflow.com>
ADMIN_EMAIL=kontakt@ordoflow.com
NEXT_PUBLIC_APP_URL=https://calculator.ordoflow.com
```

---

## 📋 SEED DATA

Źródło: plik `Ordoflow_-_Lista_Automatyzacji.xlsx` (113 automatyzacji, 13 kategorii).

Parsowanie kolumn:
- "Oszczędność (tyg.)" → savingsMin/savingsMax (np. "8-12h" → 8, 12; "1h" → 1, 1)
- "Aktywna" → ignoruj (wszystkie isActive: true)
- automationPercent → domyślnie 75 dla wszystkich

---

## 📝 FAZY REALIZACJI

| Faza | Nazwa | Zakres |
|------|-------|--------|
| 0 | Analiza + Plan | Analiza repo Ordoflow, branding, PLAN.md |
| 1 | Fundament | Setup Next.js + Payload + DB + Docker + seed |
| 2 | Wizard 1-2 | Kroki 1-2 + stan globalny + nawigacja |
| 3 | Kalkulator | Krok 3 — formularze, suwaki, formuła, live preview |
| 4 | Raport | Kroki 4-5 + wykresy Recharts |
| 5 | Email + Polish | E-maile, zapis leadów, animacje, embed mode, finalizacja |

Szczegóły każdej fazy → patrz pliki `PHASE-*.md` lub odpowiedni prompt fazowy.
