const express = require("express");

const lumiRoutes = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

lumiRoutes.get("/lumi", async (request, response) => {
  const lumiValores = await prisma.lumi.findMany();
  return response.status(200).json(lumiValores);
});

module.exports = lumiRoutes;
