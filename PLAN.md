# PLAN.md — Stan projektu Ordoflow Calculator

> **Ten plik jest aktualizowany na koniec każdej fazy.**
> Claude Code czyta go na początku każdej sesji, żeby wiedzieć co zrobiono i co dalej.

---

## Status faz

| Faza | Status | Data |
|------|--------|------|
| 0 — Analiza + Plan | ✅ Gotowe | 2026-02-06 |
| 1 — Fundament | ✅ Gotowe | 2026-02-06 |
| 2 — Wizard 1-2 | ✅ Gotowe | 2026-02-06 |
| 3 — Kalkulator | ✅ Gotowe | 2026-02-06 |
| 4 — Raport | ✅ Gotowe | 2026-02-06 |
| 5 — Email + Polish | ✅ Gotowe | 2026-02-06 |

Statusy: ⬜ Do zrobienia | 🔄 W trakcie | ✅ Gotowe | ⚠️ Wymaga poprawek

---

## Analiza brandingu (wypełnia Faza 0)

### Ścieżka do repo strony Ordoflow
```
/Users/biuro/CascadeProjects/windsurf-project/Ordoflow-www
```

### Kolory

**Główna paleta (z CSS variables w globals.css):**
```css
--purple-primary: #7C3AED     /* Główny fiolet (Tailwind purple-600) */
--purple-light: #A78BFA       /* Jasny fiolet (Tailwind purple-400) */
--purple-dark: #5B21B6        /* Ciemny fiolet (Tailwind purple-800) */
--bg-dark: #0A0A0F            /* Główny dark background */
--bg-darker: #050508          /* Jeszcze ciemniejszy background */
--text-primary: #F8FAFC       /* Biały tekst */
--text-secondary: #94A3B8     /* Szary tekst (Tailwind slate-400) */
--accent-cyan: #06B6D4        /* Cyan/turkus (Tailwind cyan-500) */
--accent-orange: #F97316      /* Pomarańczowy (Tailwind orange-500) */
```

**Tailwind config colors:**
```ts
'brand-purple': '#8A2BE2'
'brand-purple-dark': '#7a24c9'
'brand-bg': '#0F0F0F'
'brand-card': '#121212'
```

**Schemat kolorystyczny:** Dark theme tylko, fiolet + cyan + orange jako akcenty

### Fonty

**3 rodziny fontów z Google Fonts:**
```css
/* Importowane w globals.css */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

- **Syne** (wagi: 400, 500, 600, 700, 800) — font wyświetlania, nagłówki, używany z klasą `.font-display`
- **IBM Plex Sans** (wagi: 300, 400, 500, 600) — font bazowy body, główny tekst
- **JetBrains Mono** (wagi: 400, 500, 600) — monospace dla kodów, tagów

**Body default:**
```css
body {
  font-family: 'IBM Plex Sans', sans-serif;
}
```

### Biblioteki UI

**BRAK dedykowanych bibliotek komponentów!**

Ordoflow **NIE używa:**
- ❌ shadcn/ui
- ❌ Radix UI
- ❌ MUI, Chakra, Mantine itp.

**Zamiast tego:**
- ✅ Custom CSS classes w globals.css (`.btn-primary`, `.card`, `.tag` itp.)
- ✅ Tailwind utility classes
- ✅ Lucide React 0.303.0 (tylko ikony)
- ✅ Własne komponenty zbudowane od podstaw

### Biblioteki animacji

**BRAK dedykowanych frameworków animacji!**

Ordoflow **NIE używa:**
- ❌ Framer Motion
- ❌ GSAP
- ❌ React Spring

**Zamiast tego:**
- ✅ CSS keyframes (@keyframes float, pulse-glow, fadeInUp)
- ✅ CSS transitions (transition-all, cubic-bezier easing)
- ✅ Transform na hover (translateY, scale)

**Gotowe animacje:**
```css
.animate-float          /* 6s ease-in-out infinite */
.animate-float-delayed  /* 8s ease-in-out infinite 2s */
.animate-pulse-glow     /* 3s ease-in-out infinite */
.fade-in-up            /* 0.8s ease-out forwards */
```

### Wzorce komponentów

**Button:**
```css
.btn-primary {
  @apply inline-flex items-center justify-center gap-3 px-8 py-4
         text-base font-semibold text-white bg-purple-600
         hover:bg-purple-700 rounded-xl transition-all;
  box-shadow: 0 0 60px -5px rgba(124, 58, 237, 0.7);
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-8 py-4
         text-base font-semibold text-white bg-transparent
         border-2 border-gray-700 hover:border-purple-500
         hover:bg-purple-500/10 rounded-xl transition-all;
}
```

**Card:**
```css
.card {
  @apply bg-gradient-to-b from-gray-900/80 to-gray-900/40
         border border-gray-800 rounded-2xl p-8 backdrop-blur-sm;
}

.card-glass {
  @apply backdrop-blur-2xl bg-gray-950/90 rounded-3xl
         border border-gray-800 shadow-2xl;
}

.hover-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px -15px rgba(124, 58, 237, 0.4);
}
```

**Input:**
```tsx
/* Standard pattern */
className="w-full bg-zinc-800 border border-white/10 rounded-lg
           px-4 py-3 text-white placeholder-zinc-500
           focus:outline-none focus:border-brand-purple"
```

**Tag/Badge:**
```css
.tag {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full
         bg-purple-600/10 border border-purple-500/20
         text-purple-400 text-sm font-medium;
  font-family: 'JetBrains Mono', monospace;
}
```

**Typography:**
```tsx
/* H1 - Display */
<h1 className="font-display text-5xl lg:text-7xl font-bold text-white">

/* H2 - Display */
<h2 className="font-display text-4xl lg:text-5xl font-bold text-white">

/* H3 - Card Title */
<h3 className="font-display text-2xl font-bold text-white mb-4">
```

### Inne ustalenia

**Dark mode:**
- Tylko dark theme (brak light mode ani switchera)
- Brak next-themes
- Fixed dark background: `#0A0A0F`

**Max-width pattern:**
```tsx
max-w-7xl mx-auto px-6  /* Główna szerokość sekcji (1280px) */
max-w-4xl mx-auto px-6  /* Dla artykułów */
max-w-3xl mx-auto px-6  /* Dla form */
```

**Grid patterns:**
```tsx
grid lg:grid-cols-2 gap-16
grid md:grid-cols-2 lg:grid-cols-3 gap-8
grid md:grid-cols-4 gap-6
```

**Spacing:**
- Sekcje: `py-24`, `py-32`
- Gaps: `gap-16`, `gap-12`, `gap-8`, `gap-6`

**Background effects:**
```css
.grid-bg {
  background-image:
    linear-gradient(to right, rgba(124, 58, 237, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(124, 58, 237, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

**Glow effects:**
```css
.glow-purple          /* box-shadow fioletowy glow */
.glow-purple-intense  /* mocniejszy glow */
.glow-cyan           /* cyan glow */
.img-glow            /* drop-shadow na obrazy */
```

**Gradient text:**
```css
.text-gradient {
  background: linear-gradient(135deg, #A78BFA 0%, #7C3AED 50%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Scrollbar:**
```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #050508; }
::-webkit-scrollbar-thumb { background: #7C3AED; border-radius: 4px; }
```

**Logo i obrazy:**
- Logo przechowywane w Supabase Storage (nie lokalnie)
- Dla kalkulatora: będziemy używać lokalnego `/public`

**SEO:**
- Meta tags w layout.tsx
- Google Analytics + Cookiebot
- Robots: index, follow

---

## Decyzje techniczne (uzupełniaj w trakcie)

| Decyzja | Wybór | Faza | Uzasadnienie |
|---------|-------|------|--------------|
| **Biblioteka animacji** | **Czyste CSS (keyframes + transitions)** | 0 | Strona Ordoflow nie używa Framer Motion ani GSAP — wszystkie animacje to CSS. Zachowujemy spójność + mniejszy bundle size. |
| **System komponentów UI** | **Custom classes (bez shadcn/ui, Radix)** | 0 | Ordoflow buduje własne komponenty z Tailwind + custom CSS classes (`.btn-primary`, `.card` itp.). Skopiujemy globals.css ze strony głównej. |
| **Ikony** | **Lucide React** | 0 | Strona używa lucide-react 0.303.0 — ta sama biblioteka dla kalkulatora. |
| **Fonty** | **Google Fonts: Syne + IBM Plex Sans + JetBrains Mono** | 0 | Import z Google Fonts w globals.css (jak na stronie głównej). |
| **Dark mode** | **Dark tylko (brak light mode)** | 0 | Strona Ordoflow ma tylko dark theme — kalkulator będzie tak samo. |
| **Stylowanie** | **Tailwind CSS 3.4+ + custom CSS classes** | 0 | Hybrydowe podejście: Tailwind utilities + własne klasy w `@layer components`. |
| State management | **Context API** | 2 | Wybrano Context API dla prostoty — wystarczający dla zakresu projektu, bez dodatkowych zależności. |
| Walidacja | Zod | 1 | Jak w specyfikacji — frontend + backend validation. |
| Email | React Email + Resend | 5 | Jak w specyfikacji. |

---

## Znane problemy / do rozwiązania

- (uzupełniaj w trakcie)

---

## Log zmian

### Faza 0 — ✅ Zakończona (2026-02-06)

**Zrealizowane:**
1. ✅ Uzyskano ścieżkę do repo strony Ordoflow: `/Users/biuro/CascadeProjects/windsurf-project/Ordoflow-www`
2. ✅ Przeanalizowano pełną strukturę projektu za pomocą 3 agentów Explore:
   - Agent 1: Styling & Config (tailwind.config, globals.css, package.json)
   - Agent 2: UI Components (Button, Card, Input, wzorce)
   - Agent 3: Layout & Assets (fonty, logo, struktura, dark mode)
3. ✅ Zidentyfikowano paletę kolorów (fiolet #7C3AED + cyan #06B6D4 + orange #F97316)
4. ✅ Zidentyfikowano fonty (Syne, IBM Plex Sans, JetBrains Mono)
5. ✅ Ustalono brak bibliotek UI (shadcn/ui, Radix) — custom CSS classes
6. ✅ Ustalono brak frameworków animacji (Framer Motion, GSAP) — CSS keyframes
7. ✅ Zebrano wszystkie wzorce komponentów (Button, Card, Input, Tag, Typography)
8. ✅ Zapisano pełną analizę brandingu w PLAN.md
9. ✅ Podjęto kluczowe decyzje techniczne

**Kluczowe wnioski:**
- Ordoflow używa minimalistycznego podejścia — brak zbędnych bibliotek
- Wszystkie komponenty zbudowane z Tailwind + custom CSS classes w globals.css
- Dark theme tylko, brak light mode
- Lucide React dla ikon
- CSS animations zamiast JS-based (Framer Motion)
- Google Fonts załadowane przez @import w globals.css

**Do skopiowania w Fazie 1:**
- `globals.css` — cały plik z CSS variables, custom classes, animacjami
- `tailwind.config.ts` — konfiguracja z brand-purple i extends
- Wzorce komponentów UI — gotowe do implementacji

**Następny krok:** Faza 1 — Setup Next.js + Payload CMS + Docker + seed data

### Faza 1 — ✅ Zakończona (2026-02-06)

**Zrealizowane:**
1. ✅ Utworzono projekt Next.js 15 + Payload CMS 3.x + PostgreSQL
2. ✅ Skonfigurowano Tailwind CSS z brandingiem Ordoflow (globals.css, tailwind.config.ts)
3. ✅ Utworzono kolekcje Payload:
   - `Categories` (13 kategorii)
   - `Automations` (113 automatyzacji)
   - `Leads` (dla formularzy kontaktowych)
   - `Users` (dla panelu admina)
4. ✅ Sparsowano plik Excel → `src/seed/data.json` (113 automatyzacji, 13 kategorii)
5. ✅ Uruchomiono skrypt seedujący — dane załadowane do bazy
6. ✅ Utworzono Docker + docker-compose.yml (PostgreSQL na porcie 5433)
7. ✅ Utworzono pliki pomocnicze w `src/lib/`:
   - `types.ts` — typy TypeScript dla kalkulatora
   - `constants.ts` — stałe (stawki, waluty, ikony)
   - `calculations.ts` — funkcje obliczeniowe
   - `format.ts` — formatowanie walut i liczb
8. ✅ Panel admina Payload działa na `/admin`
9. ✅ API REST działa (`/api/categories`, `/api/automations`)
10. ✅ Build produkcyjny przechodzi bez błędów

**Kluczowe pliki:**
- `package.json` — zależności (Next.js 15, Payload 3.75, React 19)
- `src/payload.config.ts` — konfiguracja Payload CMS
- `src/app/globals.css` — pełny branding Ordoflow
- `src/seed/data.json` — 113 automatyzacji z Excela
- `docker-compose.yml` — PostgreSQL na porcie 5433

**Komendy:**
- `pnpm dev` — uruchomienie serwera deweloperskiego
- `pnpm parse-excel` — ponowne parsowanie Excela
- `pnpm seed` — seedowanie bazy danych
- `docker-compose up -d db` — uruchomienie PostgreSQL

**Uwagi:**
- Port PostgreSQL zmieniony na 5433 (5432 był zajęty)
- Panel admina wymaga utworzenia użytkownika przy pierwszym uruchomieniu

**Następny krok:** Faza 2 — Wizard kroki 1-2 + stan globalny + nawigacja

### Faza 2 — ✅ Zakończona (2026-02-06)

**Zrealizowane:**
1. ✅ Utworzono Context API dla state management (`src/store/calculator-context.tsx`):
   - Stan wizarda: currentStep, isEmbedMode
   - Wybór kategorii: selectedCategoryIds
   - Wybór automatyzacji: selectedAutomationIds, automationConfigs
   - Cache danych z API (categoriesCache, automationsCache)
   - Akcje: toggleCategory, toggleAutomation, selectAllInCategory, etc.
   - Walidacja: canProceedToStep(), getValidationMessage()

2. ✅ Utworzono komponenty UI:
   - `CategoryCard.tsx` — kafelek kategorii z ikoną, badge, selection indicator
   - `AutomationCard.tsx` — karta automatyzacji z checkbox, opisem, godzinami
   - `SearchInput.tsx` — wyszukiwarka z ikoną i przyciskiem czyszczenia

3. ✅ Utworzono komponenty wizarda:
   - `Calculator.tsx` — główny komponent z CalculatorProvider
   - `WizardProgress.tsx` — progress bar (5 kroków, desktop + mobile)
   - `WizardNavigation.tsx` — przyciski Dalej/Wstecz z walidacją
   - `StepSkeleton.tsx` — skeleton loader (dwa warianty)
   - `StepCategory.tsx` — Krok 1: wybór kategorii (grid, multi-select)
   - `StepAutomations.tsx` — Krok 2: wybór automatyzacji (grupowanie, wyszukiwarka)

4. ✅ Zaktualizowano stronę główną (`page.tsx`) — renderuje `<Calculator />`

5. ✅ Obsługa `?embed=true` — ukrywa header w trybie osadzenia

**Kluczowe pliki:**
- `src/store/calculator-context.tsx` — Context API provider + hooks
- `src/components/calculator/Calculator.tsx` — główny komponent
- `src/components/calculator/StepCategory.tsx` — Krok 1
- `src/components/calculator/StepAutomations.tsx` — Krok 2

**Funkcjonalności:**
- Multi-select kategorii z badge liczby automatyzacji
- Wyszukiwarka automatyzacji (po nazwie i opisie)
- "Zaznacz wszystkie" / "Odznacz wszystkie" per kategoria
- Progress bar z klikalnymi krokami (jeśli walidacja pozwala)
- Responsive design (mobile + desktop)
- Skeleton loaders podczas ładowania
- Cache danych z API (nie pobiera ponownie)
- Walidacja: blokada przycisku Dalej bez wyboru

**Następny krok:** Faza 3 — Krok konfiguracji (suwaki, formuła, live preview)

### Faza 3 — ✅ Zakończona (2026-02-06)

**Zrealizowane:**
1. ✅ Utworzono komponent `ConfigSlider.tsx`:
   - Reużywalny slider z inputem numerycznym
   - Wizualne wypełnienie (gradient fioletowy)
   - Label, unit, description
   - Min/max labels pod sliderem

2. ✅ Utworzono komponent `CurrencySelector.tsx`:
   - Select z 3 walutami (PLN/EUR/USD)
   - Input stawki godzinowej z symbolem waluty
   - Zmiana waluty automatycznie resetuje stawkę do domyślnej
   - Responsywny layout (kolumny na desktop, stack na mobile)

3. ✅ Utworzono komponent `AutomationConfigCard.tsx`:
   - Karta dla każdej wybranej automatyzacji
   - Slider godzin tygodniowo (0-40h)
   - Slider procentu automatyzacji (0-100%)
   - Live preview oszczędności tygodniowej per automatyzacja
   - Opis marketingowy, zakres godzin z bazy

4. ✅ Utworzono komponent `SavingsPreview.tsx`:
   - Sticky panel na dole ekranu
   - 3 kolumny: tygodniowo / miesięcznie / rocznie
   - Formatowanie walut według standardu (12 500 zł, €4,200, $5,100)
   - Gradient text na oszczędności rocznej
   - Liczba wybranych automatyzacji

5. ✅ Utworzono komponent `StepConfiguration.tsx`:
   - Główny komponent Kroku 3
   - Header z ikoną Settings2
   - CurrencySelector na górze
   - Grupowanie automatyzacji po kategorii
   - Lista AutomationConfigCard
   - SavingsPreview (sticky)
   - WizardNavigation

6. ✅ Dodano style dla range slider w globals.css:
   - Custom webkit/moz slider thumb
   - Fioletowe kolory zgodne z brandingiem
   - Glow effect przy hover/focus

7. ✅ Rozszerzono StepSkeleton o wariant "configuration"

8. ✅ Zaktualizowano Calculator.tsx — import prawdziwego StepConfiguration

**Kluczowe pliki:**
- `src/components/ui/ConfigSlider.tsx` — reużywalny slider
- `src/components/ui/CurrencySelector.tsx` — wybór waluty + stawki
- `src/components/ui/AutomationConfigCard.tsx` — konfiguracja automatyzacji
- `src/components/ui/SavingsPreview.tsx` — sticky panel z podsumowaniem
- `src/components/calculator/StepConfiguration.tsx` — główny komponent kroku 3

**Formuła obliczeniowa:**
```
oszczędność_tygodniowa = godziny × stawka × (procent / 100)
oszczędność_miesięczna = oszczędność_tygodniowa × 4.33
oszczędność_roczna     = oszczędność_tygodniowa × 52
```

**Funkcjonalności:**
- Live preview oszczędności — aktualizacja natychmiastowa
- Formatowanie walut: PLN (po), EUR/USD (przed)
- Domyślne wartości: średnia godzin z zakresu, 75% automatyzacji
- Walidacja: slider 0-40h, procent 0-100%
- Sticky panel z podsumowaniem na dole
- Grupowanie po kategorii z separatorami

**Następny krok:** Faza 4 — Kroki 4-5 (dane kontaktowe, raport, wykresy)

### Faza 4 — ✅ Zakończona (2026-02-06)

**Zrealizowane:**
1. ✅ Utworzono komponent `StepContact.tsx`:
   - Formularz kontaktowy (imię, email, telefon, firma)
   - Komponenty FormInput i FormCheckbox z walidacją
   - Checkbox RODO (wymagany) + Marketing (opcjonalny)
   - Walidacja zod (schema w `src/lib/validation.ts`)
   - Honeypot field (antispam)
   - Obsługa błędów walidacji per-field

2. ✅ Utworzono komponent `StepSummary.tsx`:
   - Duże liczby oszczędności (tygodniowo/miesięcznie/rocznie)
   - Animowane liczby (CountUp component)
   - Wykres kołowy — oszczędności wg kategorii (Recharts PieChart)
   - Wykres słupkowy — top 5 automatyzacji (Recharts BarChart)
   - Tabela szczegółowa (SavingsTable)
   - CTA: "Umów bezpłatną konsultację" + "Pobierz raport PDF"
   - Przycisk "Rozpocznij od nowa"

3. ✅ Utworzono komponenty wykresów:
   - `SavingsPieChart.tsx` — wykres kołowy z legendą
   - `SavingsBarChart.tsx` — wykres słupkowy horizontal
   - `ChartTheme.ts` — paleta kolorów wykresów
   - Responsywne wykresy (ResponsiveContainer)

4. ✅ Utworzono komponenty UI:
   - `FormInput.tsx` — input z walidacją i ikonami
   - `FormCheckbox.tsx` — checkbox z custom styling
   - `CountUp.tsx` — animacja liczb (count-up effect)
   - `SavingsTable.tsx` — tabela szczegółowa automatyzacji

5. ✅ Utworzono API endpoint `/api/leads`:
   - Walidacja zod server-side
   - Rate limiting: 3 req/min per IP (Map w pamięci)
   - Zapis do Payload CMS
   - Zwraca: `{ success: true, leadId: number }`

6. ✅ Zaktualizowano Calculator.tsx — integracja kroków 4-5

**Kluczowe pliki:**
- `src/components/calculator/StepContact.tsx` — formularz kontaktowy
- `src/components/calculator/StepSummary.tsx` — raport i wykresy
- `src/components/ui/SavingsPieChart.tsx` — wykres kołowy
- `src/components/ui/SavingsBarChart.tsx` — wykres słupkowy
- `src/app/api/leads/route.ts` — API endpoint

**Następny krok:** Faza 5 — Email + Polish (finalizacja)

### Faza 5 — ✅ Zakończona (2026-02-06)

**Zrealizowane:**
1. ✅ Zainstalowano zależności:
   - `@react-email/components` — szablony email
   - `resend` — wysyłka email (produkcja)
   - `nodemailer` — wysyłka email (development)
   - `sonner` — toast notifications
   - `@react-pdf/renderer` — generowanie PDF

2. ✅ Utworzono szablony email:
   - `src/emails/ClientReportEmail.tsx` — email do klienta z raportem
   - `src/emails/AdminNotificationEmail.tsx` — powiadomienie dla admina
   - `src/emails/components/EmailButton.tsx` — przycisk CTA
   - `src/emails/components/EmailFooter.tsx` — stopka emaila

3. ✅ Utworzono logikę email i PDF:
   - `src/lib/email.ts` — wysyłka emaili (Resend + nodemailer fallback)
   - `src/lib/pdf.ts` — generowanie raportu PDF (@react-pdf/renderer)

4. ✅ Utworzono API endpoint `/api/send-report`:
   - Walidacja danych z zod
   - Wysyłka emaila do klienta
   - Wysyłka powiadomienia do admina
   - Aktualizacja `reportSentAt` w Payload CMS

5. ✅ Zintegrowano sonner (toast notifications):
   - Dodano `<Toaster />` w `src/app/(frontend)/layout.tsx`
   - Dark theme, pozycja bottom-center
   - Success/error/info toasts

6. ✅ Rozszerzono SEO metadata w `src/app/layout.tsx`:
   - Open Graph (og:image, og:title, og:description)
   - Twitter Card (summary_large_image)
   - Robots (index, follow)
   - Canonical URL

7. ✅ Zaktualizowano StepSummary:
   - Integracja z `/api/send-report`
   - Toast notifications zamiast inline messages
   - Prawdziwe generowanie PDF (dynamiczny import)
   - Stan: saving → sending → success/error

8. ✅ Zmodyfikowano `/api/leads`:
   - Usunięto ustawianie `reportSentAt` (przeniesione do /api/send-report)
   - Zwracanie pełnych danych leada (potrzebne do wysyłki email)

**Kluczowe pliki:**
- `src/emails/ClientReportEmail.tsx` — szablon email dla klienta
- `src/emails/AdminNotificationEmail.tsx` — szablon powiadomienia
- `src/lib/email.ts` — logika wysyłki (Resend + nodemailer)
- `src/lib/pdf.ts` — generowanie PDF
- `src/app/api/send-report/route.ts` — API endpoint

**Zmienne środowiskowe email:**
```env
RESEND_API_KEY=re_xxxxx           # Klucz API Resend (produkcja)
EMAIL_FROM=Ordoflow <noreply@ordoflow.com>
ADMIN_EMAIL=kontakt@ordoflow.com
SMTP_HOST=localhost               # Nodemailer fallback (development)
SMTP_PORT=1025                    # Mailpit port
```

**Flow wysyłki:**
1. StepSummary montowany → POST /api/leads (zapis do DB)
2. Otrzymanie leadId → POST /api/send-report (wysyłka emaili)
3. Resend API (production) lub Nodemailer/Mailpit (development)
4. Aktualizacja reportSentAt → toast.success()

---

## Instrukcja deploymentu

### Wymagania
- Docker + Docker Compose
- PostgreSQL 16 (lub użycie kontenera z docker-compose)
- Klucz API Resend (dla wysyłki emaili)

### Zmienne środowiskowe (.env)

```env
# Database
DATABASE_URL=postgresql://ordoflow:password@db:5432/ordoflow_calculator

# Payload CMS
PAYLOAD_SECRET=your-secret-key-minimum-32-characters-long-here

# Email - Resend (production)
RESEND_API_KEY=re_xxxxx

# Email - ustawienia
EMAIL_FROM=Ordoflow <noreply@ordoflow.com>
ADMIN_EMAIL=kontakt@ordoflow.com

# App
NEXT_PUBLIC_APP_URL=https://calculator.ordoflow.com
```

### Deployment na Coolify

1. **Przygotuj repozytorium:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **W Coolify:**
   - Utwórz nowy serwis typu "Docker Compose"
   - Połącz z repozytorium Git
   - Ustaw zmienne środowiskowe
   - Deploy

3. **Po deployu:**
   - Otwórz `/admin` i utwórz użytkownika admina
   - Uruchom seed danych: `pnpm seed` (lub przez SSH)

4. **Osadzenie na stronie Ordoflow:**
   ```html
   <iframe
     src="https://calculator.ordoflow.com?embed=true"
     width="100%"
     height="800"
     frameborder="0"
   ></iframe>
   ```

### Komendy development

```bash
# Uruchomienie bazy danych
docker-compose up -d db

# Uruchomienie serwera dev
pnpm dev

# Seedowanie danych
pnpm seed

# Build produkcyjny
pnpm build

# Uruchomienie produkcji lokalnie
docker-compose up --build
```

### Testowanie emaili (development)

1. Uruchom Mailpit:
   ```bash
   docker run -d -p 1025:1025 -p 8025:8025 axllent/mailpit
   ```

2. Otwórz http://localhost:8025 — interfejs Mailpit

3. Emaile wysyłane przez aplikację będą widoczne w Mailpit

---

## Podsumowanie projektu

**Stack technologiczny:**
- Next.js 15.5 + React 19 + TypeScript (strict)
- Payload CMS 3.75 (zintegrowany z Next.js)
- PostgreSQL 16 (Docker)
- Tailwind CSS 3.4 + custom CSS classes
- Lucide React (ikony)
- Recharts (wykresy)
- Context API (state management)
- Resend + Nodemailer (email)
- @react-pdf/renderer (PDF)
- Sonner (toast)

**Dane:**
- 13 kategorii automatyzacji
- 113 automatyzacji z bazy danych
- Źródło: `Ordoflow - Lista Automatyzacji.xlsx`

**Funkcjonalności:**
- 5-krokowy wizard (kategorie → automatyzacje → konfiguracja → kontakt → raport)
- Multi-select kategorii i automatyzacji
- Wyszukiwarka automatyzacji
- Konfiguracja godzin i % automatyzacji per automatyzacja
- Live preview oszczędności
- Wykresy (kołowy + słupkowy)
- Generowanie i pobieranie raportu PDF
- Wysyłka emaila do klienta z raportem
- Powiadomienie email do admina
- Toast notifications
- Tryb embed (`?embed=true`)
- Rate limiting (3 req/min per IP)
- Responsywny design (mobile-first)
- Dark theme (spójny z ordoflow.com)

**Projekt zakończony!** 🎉
