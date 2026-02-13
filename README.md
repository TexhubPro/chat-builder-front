## Frontend deployment (`bot.texhub.pro`)

### 1) Build with production env

`.env.production` is configured as:

```env
VITE_API_URL=https://safina.texhub.pro/api
```

Build:

```bash
npm ci
npm run build
```

Deploy `dist/` to server (for example: `/var/www/chat-flow-front/dist`).
Build script also creates `dist/.htaccess` for Apache SPA fallback.

### 2) Nginx config (important for React Router)

If you open `/integrations` or `/client-chats` directly and get a blank/404 page,
you need SPA fallback to `index.html`.

```nginx
server {
    server_name bot.texhub.pro;
    root /var/www/chat-flow-front/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: if backend API is same host and local php/laravel
    # location /api/ {
    #     proxy_pass http://127.0.0.1:8000/api/;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    # }
}
```

### 3) SSL

Configure HTTPS certificate for `bot.texhub.pro` (Let's Encrypt or your provider).

### 4) Apache config

If frontend runs on Apache instead of Nginx:

1. Enable `mod_rewrite` and `mod_headers`.
2. Point `DocumentRoot` to built `dist/`.
3. Ensure `AllowOverride All` for that directory (so `.htaccess` works).

Example:

```apache
<VirtualHost *:80>
    ServerName bot.texhub.pro
    DocumentRoot /var/www/chat-flow-front/dist

    <Directory /var/www/chat-flow-front/dist>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 5) sManager / shared hosting quick fix

If your hosting panel points domain root to `front/` (not `front/dist/`):

1. Upload full `front/` project.
2. Run build (`npm run build`) so `dist/` exists.
3. Keep `front/.htaccess` in root (it forces serving files from `dist/`).
4. Keep `AllowOverride All` enabled.

This prevents loading source `index.html` with `/src/main.tsx` on production.

### 6) Troubleshooting blank page

If `bot.texhub.pro` shows a blank page, check page source:

- Wrong (source files are deployed):
  - `<script type="module" src="/src/main.tsx"></script>`
- Correct (built files are deployed):
  - `<script type="module" crossorigin src="/assets/index-*.js"></script>`

Fix:

1. Run `npm ci && npm run build`.
2. Deploy only `dist/` content to web root.
3. Ensure Nginx uses SPA fallback:
   - `try_files $uri $uri/ /index.html;`
4. Ensure API path works:
   - `https://bot.texhub.pro/api` should not return `404`.
