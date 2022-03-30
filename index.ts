import "dotenv/config";
import express from'express';

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient()

const app = express();

app.get('/ping', async () => {
      
    // const users = await prisma.user.findMany()
    
    // console.log(users);
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server running on ${port}`);
});
