# Publicar no GitHub Pages e instalar no celular

O app já está preparado como **PWA** — depois de publicado num endereço com HTTPS, ele pode ser instalado na tela de início do celular, com ícone próprio e tela cheia, como um aplicativo. O jeito mais fácil e grátis de publicar é o **GitHub Pages**.

## Arquivos que vão para o site

Suba estes arquivos (todos juntos, na mesma pasta):

- `index.html`  ← **renomeie** o `controle-triduo-online.html` para `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon-192.png`, `icon-512.png`, `icon-maskable.png`

> Antes de subir, abra o `index.html` num editor e cole a **URL** e a **chave anon public** do Supabase nas duas linhas do topo (`SUPABASE_URL` e `SUPABASE_ANON_KEY`). Assim todos entram já conectados.

## Passo 1 — Criar o repositório

1. Crie uma conta em **github.com** (grátis).
2. Clique em **New repository**, dê um nome (ex.: `triduo`) e crie.
3. Na página do repositório: **Add file → Upload files**, arraste os arquivos acima e clique em **Commit changes**.

## Passo 2 — Ligar o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em **Source**, escolha a branch **main** e a pasta **/ (root)**. Clique em **Save**.
3. Aguarde ~1 minuto. O endereço aparece no topo, algo como:
   `https://seuusuario.github.io/triduo/`

## Passo 3 — Liberar o login no Supabase

Para o login funcionar no endereço novo:

1. No Supabase, vá em **Authentication → URL Configuration**.
2. Em **Site URL** (ou **Redirect URLs**), adicione o endereço do GitHub Pages (ex.: `https://seuusuario.github.io/triduo/`).

## Passo 4 — Instalar no celular

Abra o endereço no navegador do celular e:

**Android (Chrome):** aparece um aviso "Adicionar à tela inicial", ou toque no menu ⋮ → **Instalar aplicativo / Adicionar à tela inicial**. (No app também há o botão **⬇ Instalar app** no topo quando disponível.)

**iPhone (Safari):** toque no botão **Compartilhar** (quadrado com seta) → **Adicionar à Tela de Início**.

Pronto: vira um ícone verde com a cruz na tela do celular e abre em tela cheia. 🎉

## Observações

- **Segurança:** se o repositório for público, a chave `anon public` fica visível — tudo bem, ela é feita para isso; quem protege os dados são o login/senha e as regras de RLS. **Nunca** coloque a chave `service_role`.
- **Atualizações:** para mudar o app, basta subir um novo `index.html` no repositório. Os usuários recebem a versão nova ao reabrir (pode levar uma abertura para atualizar o cache).
- **Repositório privado:** o GitHub Pages com repositório privado depende do plano do GitHub. Para uso interno, um repositório público funciona bem.
