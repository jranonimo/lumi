-- CreateTable
CREATE TABLE "lumi" (
    "id" SERIAL NOT NULL,
    "numerocliente" TEXT,
    "mesanoreferencia" TEXT,
    "mesreferencia" INTEGER,
    "anoreferencia" INTEGER,
    "energiaeletricaqnt" INTEGER,
    "energiaeletricavalor" DECIMAL(10,2),
    "energiasceeqnt" INTEGER,
    "energiasceevalor" DECIMAL(10,2),
    "energiacompensadaqnt" INTEGER,
    "energiacompensadavalor" DECIMAL(10,2),
    "contribmunicipalvalor" DECIMAL(10,2),
    "nomepdf" TEXT,

    CONSTRAINT "lumi_pkey" PRIMARY KEY ("id")
);
