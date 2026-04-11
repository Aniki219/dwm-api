import fs from 'fs';
import path from 'path'

const MONSTER_NAMES = [
  // Slime Family
  "DrakSlime", "SpotSlime", "WingSlime", "TreeSlime", "Snaily", "SlimeNite",
  "Babble", "BoxSlime", "PearlGel", "Slime", "Healer", "FangSlime", "RockSlime",
  "SlimeBorg", "Slabbit", "KingSlime", "Metaly", "Metabble", "SpotKing",
  "TropicGel", "MimeSlime", "HaloSlime", "MetalKing", "GoldSlime", "GranSlime",
  "WonderEgg",
  // Dragon Family
  "DragonKid", "Tortragon", "Pteranod", "Gasgon", "FairyDrak", "LizardMan",
  "Poisongon", "Swordgon", "Drygon", "Dragon", "MiniDrak", "MadDragon",
  "Rayburn", "Chamelgon", "LizardFly", "Andreal", "KingCobra", "Vampirus",
  "SnakeBat", "Spikerous", "GreatDrak", "Crestpent", "WingSnake", "Coatol",
  "Orochi", "BattleRex", "SkyDragon", "Serpentia", "Divinegon", "Orligon",
  "GigaDraco",
  // Beast Family
  "Tonguella", "Almiraj", "CatFly", "PillowRat", "Saccer", "GulpBeast",
  "Skullroo", "WindBeast", "Beavern", "Antbear", "SuperTen", "IronTurt",
  "Mommonja", "HammerMan", "Grizzly", "Yeti", "ArrowDog", "NoctoKing",
  "BeastNite", "MadGopher", "FairyRat", "Unicorn", "Goategon", "WildApe",
  "Trumpeter", "KingLeo", "DarkHorn", "MadCat", "BigEye", "Gorago",
  "CatMage", "Dumbira",
  // Bird Family
  "Picky", "Wyvern", "BullBird", "Florajay", "DuckKite", "MadPecker",
  "MadRaven", "MistyWing", "AquaHawk", "Dracky", "KiteHawk", "BigRoost",
  "StubBird", "LandOwl", "MadGoose", "MadCondor", "Emyu", "Blizzardy",
  "Phoenix", "ZapBird", "Garudian", "WhipBird", "FunkyBird", "RainHawk",
  "Azurile", "Shantak", "CragDevil",
  // Plant Family
  "MadPlant", "FireWeed", "FloraMan", "WingTree", "CactiBall", "Gulpple",
  "Toadstool", "AmberWeed", "Slurperon", "Stubsuck", "Oniono", "DanceVegi",
  "TreeBoy", "Devipine", "FaceTree", "HerbMan", "BeanMan", "EvilSeed",
  "ManEater", "Snapper", "GhosTree", "Rosevine", "Egdracil", "Warubou",
  "Watabou", "Eggplaton", "FooHero",
  // Bug Family
  "GiantSlug", "Catapila", "Gophecada", "Butterfly", "WeedBug", "GiantWorm",
  "Lipsy", "StagBug", "Pyuro", "ArmyAnt", "GoHopper", "TailEater",
  "ArmorPede", "Eyeder", "GiantMoth", "Droll", "ArmyCrab", "MadHornet",
  "Belzebub", "WarMantis", "HornBeet", "Sickler", "Armorpion", "Digster",
  "Skularach", "MultiEyes",
  // Devil Family
  "Pixy", "MedusaEye", "AgDevil", "Demonite", "DarkEye", "EyeBall",
  "SkulRider", "EvilBeast", "Bubblemon", "1EyeClown", "Gremlin", "ArcDemon",
  "Lionex", "GoatHorn", "Orc", "Ogre", "GateGuard", "ChopClown", "BossTroll",
  "Grendal", "Akubar", "MadKnight", "EvilWell", "Gigantes", "Centasaur",
  "EvilArmor", "Jamirus", "Durran", "Titanis", "LampGenie",
  // Zombie Family
  "Spooky", "Skullgon", "PutrePup", "RotRaven", "Mummy", "DarkCrab",
  "DeadNite", "Shadow", "Skulpent", "Hork", "Mudron", "NiteWhip",
  "WindMerge", "Reaper", "Inverzon", "FoxFire", "CaptDead", "DeadNoble",
  "WhiteKing", "BoneSlave", "Skeletor", "Servant", "Lazamanus", "Copycat",
  "MadSpirit", "PomPomBom", "Niterich",
  // Material Family
  "JewelBag", "EvilWand", "MadCandle", "CoilBird", "Facer", "SpikyBoy",
  "MadMirror", "RogueNite", "Puppetor", "Goopi", "Voodoll", "MetalDrak",
  "Balzak", "SabreMan", "CurseLamp", "Brushead", "Roboster2", "Roboster",
  "EvilPot", "Gismo", "LavaMan", "IceMan", "Mimic", "Exaucers", "MudDoll",
  "Golem", "StoneMan", "BombCrag", "GoldGolem", "DarkMate", "ProtoMech",
  "CloudKing",
  // Water Family
  "Petiteel", "Moray", "WalrusMan", "RayGigas", "Anemon", "Aquarella",
  "Merman", "Octokid", "PutreFish", "Octoreach", "Angleron", "FishRider",
  "RushFish", "Gamanian", "Clawster", "CancerMan", "RogueWave", "Scallopa",
  "SeaHorse", "HoodSquid", "MerTiger", "AxeShark", "Octogon", "KingSquid",
  "Digong", "WhaleMage", "Aquadon", "Octoraid", "Grakos", "Poseidon",
  "Pumpoise", "Starfish",
  // ???? Family
  "DracoLord2", "DracoLord", "LordDraco", "Hargon", "Sidoh", "Genosidoh",
  "Baramos", "Zoma", "AsuraZoma", "Pizzaro", "PsychoPiz", "Esterk",
  "Mirudraas2", "Mirudraas", "Mudou", "DeathMore3", "DeathMore2", "DeathMore",
  "Darkdrium", "Orgodemir2", "Orgodemir", "Darck",
  // Misc
  "Tatsu", "Diago", "Samsi", "Bazoo", "Lamia", "Dimensaur", "Kagebou",
];

// Sort longest first to prevent partial matches (e.g. "Slime" inside "KingSlime")
MONSTER_NAMES.sort((a, b) => b.length - a.length);

// Build lookup: lowercase -> canonical
const lookup : {[key: string]: string} = {} ;
for (const name of MONSTER_NAMES) {
  lookup[name.toLowerCase()] = name;
}

// Build regex with word boundaries, case-insensitive, global
const pattern = new RegExp(
  `\\b(${MONSTER_NAMES.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);

const INPUT_FILE  = "./data/JimeousGuide.txt";
const OUTPUT_FILE = "./data/JimeousGuide_fixed.txt";

const text = fs.readFileSync(INPUT_FILE, "utf8");

let count = 0;
const fixed = text.replace(pattern, (match) => {
  count++;
  return lookup[match.toLowerCase()];
});

fs.writeFileSync(OUTPUT_FILE, fixed, "utf8");
console.log(`Done. ${count} replacement(s) made.`);
console.log(`Output written to: JimeousGuide_fixed.txt`);