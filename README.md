## Frontend deployment (`bot.texhub.pro`)

### 1) Build with production env

`.env.production` is configured as:

```env
VITE_API_URL=https://bot.texhub.pro/api
```

Build:

```bash
npm ci
npm run build
```

Deploy `dist/` to server (for example: `/var/www/chat-flow-front/dist`).

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
