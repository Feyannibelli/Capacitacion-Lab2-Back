-- CreateEnum
CREATE TYPE "public"."PokemonType" AS ENUM ('NORMAL', 'FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'ICE', 'FIGHTING', 'POISON', 'GROUND', 'FLYING', 'PSYCHIC', 'BUG', 'ROCK', 'GHOST', 'DARK', 'DRAGON', 'STEEL', 'FAIRY');

-- CreateTable
CREATE TABLE "public"."Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."PokemonType" NOT NULL,
    "height" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ability" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PokemonAbility" (
    "pokemonId" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("pokemonId","abilityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_name_key" ON "public"."Pokemon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ability_name_key" ON "public"."Ability"("name");

-- AddForeignKey
ALTER TABLE "public"."PokemonAbility" ADD CONSTRAINT "PokemonAbility_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokemonAbility" ADD CONSTRAINT "PokemonAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "public"."Ability"("id") ON DELETE CASCADE ON UPDATE CASCADE;
