import { PrismaClient, PokemonType } from '@prisma/client';

const prisma = new PrismaClient();

const abilityByType: Record<PokemonType, string> = {
    NORMAL:   'Run Away',
    FIRE:     'Blaze',
    WATER:    'Torrent',
    GRASS:    'Overgrow',
    ELECTRIC: 'Static',
    ICE:      'Ice Body',
    FIGHTING: 'Guts',
    POISON:   'Poison Point',
    GROUND:   'Sand Veil',
    FLYING:   'Keen Eye',
    PSYCHIC:  'Synchronize',
    BUG:      'Shield Dust',
    ROCK:     'Sturdy',
    GHOST:    'Levitate',
    DRAGON:   'Pressure',
    DARK:     'Intimidate',
    STEEL:    'Clear Body',
    FAIRY:    'Cute Charm',
};

/**
 * Los 151 Pokémon con **tipo único** (principal).
 * Si en tu enum no existe FAIRY o STEEL, cambia esos tipos por el principal que uses.
 */
const GEN1_SINGLE: { name: string; type: PokemonType }[] = [
    { name: 'Bulbasaur', type: 'GRASS' },
    { name: 'Ivysaur', type: 'GRASS' },
    { name: 'Venusaur', type: 'GRASS' },
    { name: 'Charmander', type: 'FIRE' },
    { name: 'Charmeleon', type: 'FIRE' },
    { name: 'Charizard', type: 'FIRE' },
    { name: 'Squirtle', type: 'WATER' },
    { name: 'Wartortle', type: 'WATER' },
    { name: 'Blastoise', type: 'WATER' },
    { name: 'Caterpie', type: 'BUG' },
    { name: 'Metapod', type: 'BUG' },
    { name: 'Butterfree', type: 'BUG' },
    { name: 'Weedle', type: 'BUG' },
    { name: 'Kakuna', type: 'BUG' },
    { name: 'Beedrill', type: 'BUG' },
    { name: 'Pidgey', type: 'NORMAL' },
    { name: 'Pidgeotto', type: 'NORMAL' },
    { name: 'Pidgeot', type: 'NORMAL' },
    { name: 'Rattata', type: 'NORMAL' },
    { name: 'Raticate', type: 'NORMAL' },
    { name: 'Spearow', type: 'NORMAL' },
    { name: 'Fearow', type: 'NORMAL' },
    { name: 'Ekans', type: 'POISON' },
    { name: 'Arbok', type: 'POISON' },
    { name: 'Pikachu', type: 'ELECTRIC' },
    { name: 'Raichu', type: 'ELECTRIC' },
    { name: 'Sandshrew', type: 'GROUND' },
    { name: 'Sandslash', type: 'GROUND' },
    { name: 'Nidoran♀', type: 'POISON' },
    { name: 'Nidorina', type: 'POISON' },
    { name: 'Nidoqueen', type: 'POISON' },
    { name: 'Nidoran♂', type: 'POISON' },
    { name: 'Nidorino', type: 'POISON' },
    { name: 'Nidoking', type: 'POISON' },
    { name: 'Clefairy', type: 'FAIRY' },
    { name: 'Clefable', type: 'FAIRY' },
    { name: 'Vulpix', type: 'FIRE' },
    { name: 'Ninetales', type: 'FIRE' },
    { name: 'Jigglypuff', type: 'NORMAL' },
    { name: 'Wigglytuff', type: 'NORMAL' },
    { name: 'Zubat', type: 'POISON' },
    { name: 'Golbat', type: 'POISON' },
    { name: 'Oddish', type: 'GRASS' },
    { name: 'Gloom', type: 'GRASS' },
    { name: 'Vileplume', type: 'GRASS' },
    { name: 'Paras', type: 'BUG' },
    { name: 'Parasect', type: 'BUG' },
    { name: 'Venonat', type: 'BUG' },
    { name: 'Venomoth', type: 'BUG' },
    { name: 'Diglett', type: 'GROUND' },
    { name: 'Dugtrio', type: 'GROUND' },
    { name: 'Meowth', type: 'NORMAL' },
    { name: 'Persian', type: 'NORMAL' },
    { name: 'Psyduck', type: 'WATER' },
    { name: 'Golduck', type: 'WATER' },
    { name: 'Mankey', type: 'FIGHTING' },
    { name: 'Primeape', type: 'FIGHTING' },
    { name: 'Growlithe', type: 'FIRE' },
    { name: 'Arcanine', type: 'FIRE' },
    { name: 'Poliwag', type: 'WATER' },
    { name: 'Poliwhirl', type: 'WATER' },
    { name: 'Poliwrath', type: 'FIGHTING' },
    { name: 'Abra', type: 'PSYCHIC' },
    { name: 'Kadabra', type: 'PSYCHIC' },
    { name: 'Alakazam', type: 'PSYCHIC' },
    { name: 'Machop', type: 'FIGHTING' },
    { name: 'Machoke', type: 'FIGHTING' },
    { name: 'Machamp', type: 'FIGHTING' },
    { name: 'Bellsprout', type: 'GRASS' },
    { name: 'Weepinbell', type: 'GRASS' },
    { name: 'Victreebel', type: 'GRASS' },
    { name: 'Tentacool', type: 'WATER' },
    { name: 'Tentacruel', type: 'WATER' },
    { name: 'Geodude', type: 'ROCK' },
    { name: 'Graveler', type: 'ROCK' },
    { name: 'Golem', type: 'ROCK' },
    { name: 'Ponyta', type: 'FIRE' },
    { name: 'Rapidash', type: 'FIRE' },
    { name: 'Slowpoke', type: 'WATER' },
    { name: 'Slowbro', type: 'WATER' },
    { name: 'Magnemite', type: 'ELECTRIC' },
    { name: 'Magneton', type: 'ELECTRIC' },
    { name: 'Farfetch’d', type: 'NORMAL' },
    { name: 'Doduo', type: 'NORMAL' },
    { name: 'Dodrio', type: 'NORMAL' },
    { name: 'Seel', type: 'WATER' },
    { name: 'Dewgong', type: 'WATER' },
    { name: 'Grimer', type: 'POISON' },
    { name: 'Muk', type: 'POISON' },
    { name: 'Shellder', type: 'WATER' },
    { name: 'Cloyster', type: 'WATER' },
    { name: 'Gastly', type: 'GHOST' },
    { name: 'Haunter', type: 'GHOST' },
    { name: 'Gengar', type: 'GHOST' },
    { name: 'Onix', type: 'ROCK' },
    { name: 'Drowzee', type: 'PSYCHIC' },
    { name: 'Hypno', type: 'PSYCHIC' },
    { name: 'Krabby', type: 'WATER' },
    { name: 'Kingler', type: 'WATER' },
    { name: 'Voltorb', type: 'ELECTRIC' },
    { name: 'Electrode', type: 'ELECTRIC' },
    { name: 'Exeggcute', type: 'GRASS' },
    { name: 'Exeggutor', type: 'GRASS' },
    { name: 'Cubone', type: 'GROUND' },
    { name: 'Marowak', type: 'GROUND' },
    { name: 'Hitmonlee', type: 'FIGHTING' },
    { name: 'Hitmonchan', type: 'FIGHTING' },
    { name: 'Lickitung', type: 'NORMAL' },
    { name: 'Koffing', type: 'POISON' },
    { name: 'Weezing', type: 'POISON' },
    { name: 'Rhyhorn', type: 'GROUND' },
    { name: 'Rhydon', type: 'GROUND' },
    { name: 'Chansey', type: 'NORMAL' },
    { name: 'Tangela', type: 'GRASS' },
    { name: 'Kangaskhan', type: 'NORMAL' },
    { name: 'Horsea', type: 'WATER' },
    { name: 'Seadra', type: 'WATER' },
    { name: 'Goldeen', type: 'WATER' },
    { name: 'Seaking', type: 'WATER' },
    { name: 'Staryu', type: 'WATER' },
    { name: 'Starmie', type: 'WATER' },
    { name: 'Mr. Mime', type: 'PSYCHIC' },
    { name: 'Scyther', type: 'BUG' },
    { name: 'Jynx', type: 'ICE' },
    { name: 'Electabuzz', type: 'ELECTRIC' },
    { name: 'Magmar', type: 'FIRE' },
    { name: 'Pinsir', type: 'BUG' },
    { name: 'Tauros', type: 'NORMAL' },
    { name: 'Magikarp', type: 'WATER' },
    { name: 'Gyarados', type: 'WATER' },
    { name: 'Lapras', type: 'WATER' },
    { name: 'Ditto', type: 'NORMAL' },
    { name: 'Eevee', type: 'NORMAL' },
    { name: 'Vaporeon', type: 'WATER' },
    { name: 'Jolteon', type: 'ELECTRIC' },
    { name: 'Flareon', type: 'FIRE' },
    { name: 'Porygon', type: 'NORMAL' },
    { name: 'Omanyte', type: 'ROCK' },
    { name: 'Omastar', type: 'ROCK' },
    { name: 'Kabuto', type: 'ROCK' },
    { name: 'Kabutops', type: 'ROCK' },
    { name: 'Aerodactyl', type: 'ROCK' },
    { name: 'Snorlax', type: 'NORMAL' },
    { name: 'Articuno', type: 'ICE' },
    { name: 'Zapdos', type: 'ELECTRIC' },
    { name: 'Moltres', type: 'FIRE' },
    { name: 'Dratini', type: 'DRAGON' },
    { name: 'Dragonair', type: 'DRAGON' },
    { name: 'Dragonite', type: 'DRAGON' },
    { name: 'Mewtwo', type: 'PSYCHIC' },
    { name: 'Mew', type: 'PSYCHIC' },
];

function slugify(name: string) {
    return name
        .toLowerCase()
        .replace(/♀/g, 'f')
        .replace(/♂/g, 'm')
        .replace(/[\.\s’'"]/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
}

function synthMetrics(i: number) {
    const h = 0.4 + (i % 12) * 0.1; // 0.4..1.5
    const w = 5 + (i % 60) * 1.2;   // 5..76
    return { height: Number(h.toFixed(1)), weight: Number(w.toFixed(1)) };
}

async function main() {
    // 1) Upsert de todas las abilities requeridas (una por tipo).
    const abilityIdByName = new Map<string, number>();
    for (const name of Object.values(abilityByType)) {
        const ability = await prisma.ability.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        abilityIdByName.set(name, ability.id);
    }

    // 2) Cargar los 151 Pokémon con 1 ability por su tipo
    for (let i = 0; i < GEN1_SINGLE.length; i++) {
        const { name, type } = GEN1_SINGLE[i];
        const { height, weight } = synthMetrics(i + 1);

        const abilityName = abilityByType[type];
        const abilityId = abilityIdByName.get(abilityName);

        await prisma.pokemon.create({
            data: {
                name,
                type,
                height,
                weight,
                imageUrl: `https://img.pokemondb.net/artwork/large/${slugify(name)}.jpg`,
                abilities: abilityId ? { create: [{ ability: { connect: { id: abilityId } } }] } : undefined,
            },
        });
    }

    console.log('✅ Seed completado: 151 Pokémon (tipo único) + abilities por tipo.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
