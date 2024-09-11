# Beojji-Backend

## How to run
1. `npm i`
2. `npx prisma migrate dev`
3. in `.env`, write this:

```
DATABASE_URL="DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
```

## Tips

You can check `/api` to see an API document.
You can check `npx prisma studio` to operate your DB. 