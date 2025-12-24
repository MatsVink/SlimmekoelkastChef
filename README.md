# Slimme Koelkast Chef

**Slimme Koelkast Chef** is een webapplicatie die je helpt om heerlijke recepten te bedenken op basis van de ingrediënten die je al in huis hebt. Voer simpelweg je ingrediënten in en laat de kracht van AI een creatief en smakelijk recept voor je genereren.

## ✨ Features

-   **Recepten Genereren:** Voer een lijst met ingrediënten in en ontvang direct een compleet recept, inclusief titel, bereidingstijd en stapsgewijze instructies.
-   **AI-gebaseerd:** Maakt gebruik van de Google Gemini API via Genkit voor het genereren van unieke en creatieve recepten.
-   **Favorieten Opslaan:** Log in met je Google-account om je favoriete recepten op te slaan en later terug te vinden.
-   **Moderne Interface:** Een strakke en gebruiksvriendelijke interface gebouwd met Next.js, Tailwind CSS en ShadCN UI.

## 🛠️ Technologie

Dit project is gebouwd met een moderne, op TypeScript en React gebaseerde stack:

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
-   **Backend & Authenticatie:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
-   **AI Integratie:** [Genkit](https://firebase.google.com/docs/genkit)
-   **Taal:** [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

Volg deze stappen om het project lokaal op te zetten en te draaien.

### Vereisten

-   Node.js (versie 18 of hoger)
-   npm of een andere package manager
-   Een Firebase-project

### Installatie

1.  **Clone de repository:**
    ```bash
    git clone <repository-url>
    cd <repository-naam>
    ```

2.  **Installeer de dependencies:**
    ```bash
    npm install
    ```

3.  **Firebase Configuratie:**
    Zorg ervoor dat je Firebase project is geconfigureerd en dat je de configuratie hebt toegevoegd aan `src/firebase/config.ts`. Schakel **Google Sign-In** in als authenticatiemethode in de Firebase Console.

4.  **Start de development server:**
    ```bash
    npm run dev
    ```

De applicatie is nu beschikbaar op `http://localhost:9002`.
