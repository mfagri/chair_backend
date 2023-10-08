// schema.prisma

// model Category {
//   id    Int    @id @default(autoincrement())
//   name  String
//   icon  String // Assuming you store the icon as a URL or file path
//   products Product[]
// }

// model Product {
//   id        Int      @id @default(autoincrement())
//   name      String
//   category  Category @relation(fields: [categoryId], references: [id])
//   categoryId Int
//   // Define other fields for the Product model as in the previous schema
//   price     Float
//   data      Json
//   images    Image[]
// }

// model Image {
//   id        Int     @id @default(autoincrement())
//   image     String
//   is3d      Boolean
//   model     String
//   productId Int
//   product   Product @relation(fields: [productId], references: [id])
// }
import express from 'express'
import { PrismaClient } from '@prisma/client'