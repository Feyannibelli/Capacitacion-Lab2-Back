import { PrismaClient, PokemonType } from '@prisma/client';
const prisma = new PrismaClient();

async function main(){
    // crea o reautiliza 3 habilidades base con upsert
    const [overgrow, blaze, torrent] = await prisma.$transaction([
        prisma.ability.upsert({ where: { name: 'Overgrow' }, update: {}, create: { name: 'Overgrow' } }),
        prisma.ability.upsert({ where: { name: 'Blaze' }, update: {}, create: { name: 'Blaze' } }),
        prisma.ability.upsert({ where: { name: 'Torrent' }, update: {}, create: { name: 'Torrent' } }),
    ])

    // creo 3 tipos de pokemons al iniciar
    // Bulbasaur
    await prisma.pokemon.upsert({
        where: { name: 'Bulbasaur' },
        update: {},
        create: {
            name: 'Bulbasaur',
            type: 'GRASS' as PokemonType,  // enum
            height: 0.7,
            weight: 6.9,
            imageUrl: 'https://img.pokemondb.net/artwork/large/bulbasaur.jpg',
            abilities: { create: [{ abilityId: overgrow.id }] },
        },
    });

    // Charmander
    await prisma.pokemon.upsert({
        where: { name: 'Charmander' },
        update: {},
        create: {
            name: 'Charmander',
            type: 'FIRE' as PokemonType,
            height: 0.6,
            weight: 8.5,
            imageUrl: 'https://img.pokemondb.net/artwork/large/charmander.jpg',
            abilities: { create: [{ abilityId: blaze.id }] },
        },
    });

    // Squirtle
    await prisma.pokemon.upsert({
        where: { name: 'Squirtle' },
        update: {},
        create: {
            name: 'Squirtle',
            type: 'WATER' as PokemonType,
            height: 0.5,
            weight: 9,
            imageUrl: 'https://img.pokemondb.net/artwork/large/squirtle.jpg',
            abilities: { create: [{ abilityId: torrent.id }] },
        },
    });
}

main().finally(async () => prisma.$disconnect());
