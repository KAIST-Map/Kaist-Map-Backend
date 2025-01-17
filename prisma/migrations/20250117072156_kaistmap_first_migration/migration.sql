-- CreateTable
CREATE TABLE "node" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edge" (
    "id" SERIAL NOT NULL,
    "nodeId1" INTEGER NOT NULL,
    "nodeId2" INTEGER NOT NULL,
    "is_free_of_rain" BOOLEAN NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "beamWeight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "edge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "building" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nodeId" INTEGER NOT NULL,

    CONSTRAINT "building_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "edge" ADD CONSTRAINT "edge_nodeId1_fkey" FOREIGN KEY ("nodeId1") REFERENCES "node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edge" ADD CONSTRAINT "edge_nodeId2_fkey" FOREIGN KEY ("nodeId2") REFERENCES "node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building" ADD CONSTRAINT "building_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
