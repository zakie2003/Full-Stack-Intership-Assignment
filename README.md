# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Setting Up the .env file in `Node-Backend`

```bash
PUBLIC_SUPABASE_URL=<Enter_Supabase_Url>
PUBLIC_SUPABASE_ANON_KEY=<Enter_Anon_Key>
GEMINI_KEY=<Enter_Gemini_API_Key>          
PORT=3000
```

# How to Setup Express.js

1. Move to `Node-Backend` directory

   ```bash
   cd Node-Backend

2. Run Command

```bash
   npm install
```
3. Start Server

```
  node index.js;
```

# Setting Up React App

1. Move to `React-Frontend` directory

   ```bash
   cd React-Frontend
   ```

2. Start Server

```bash
   npm run dev
```

The Server will start at http://localhost:5173/




