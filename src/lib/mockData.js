export const MOCK_DATA = {
  pokemon: {
    pikachu: { id: 25, name: "pikachu", base_experience: 112, height: 4, weight: 60, abilities: [{ ability: { name: "static" } }, { ability: { name: "lightning-rod" } }], types: [{ type: { name: "electric" } }], stats: [{ base_stat: 35, stat: { name: "hp" } }, { base_stat: 55, stat: { name: "attack" } }, { base_stat: 90, stat: { name: "speed" } }], sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" } },
    charizard: { id: 6, name: "charizard", base_experience: 267, height: 17, weight: 905, abilities: [{ ability: { name: "blaze" } }], types: [{ type: { name: "fire" } }, { type: { name: "flying" } }], stats: [{ base_stat: 78, stat: { name: "hp" } }, { base_stat: 84, stat: { name: "attack" } }, { base_stat: 100, stat: { name: "speed" } }], sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" } },
    mewtwo: { id: 150, name: "mewtwo", base_experience: 340, height: 20, weight: 1220, abilities: [{ ability: { name: "pressure" } }], types: [{ type: { name: "psychic" } }], stats: [{ base_stat: 106, stat: { name: "hp" } }, { base_stat: 110, stat: { name: "attack" } }, { base_stat: 130, stat: { name: "speed" } }], sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" } },
    eevee: { id: 133, name: "eevee", base_experience: 65, height: 3, weight: 65, abilities: [{ ability: { name: "run-away" } }], types: [{ type: { name: "normal" } }], stats: [{ base_stat: 55, stat: { name: "hp" } }, { base_stat: 55, stat: { name: "attack" } }, { base_stat: 55, stat: { name: "speed" } }], sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" } },
    snorlax: { id: 143, name: "snorlax", base_experience: 189, height: 21, weight: 4600, abilities: [{ ability: { name: "immunity" } }], types: [{ type: { name: "normal" } }], stats: [{ base_stat: 160, stat: { name: "hp" } }, { base_stat: 110, stat: { name: "attack" } }, { base_stat: 30, stat: { name: "speed" } }], sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" } },
  },
  cards: {
    "1": { success: true, deck_id: "mock123", cards: [{ suit: "HEARTS", value: "ACE", code: "AH", image: "https://deckofcardsapi.com/static/img/AH.png" }], remaining: 51 },
    "3": { success: true, deck_id: "mock123", cards: [{ suit: "SPADES", value: "KING", code: "KS", image: "https://deckofcardsapi.com/static/img/KS.png" }, { suit: "DIAMONDS", value: "7", code: "7D", image: "https://deckofcardsapi.com/static/img/7D.png" }, { suit: "CLUBS", value: "QUEEN", code: "QC", image: "https://deckofcardsapi.com/static/img/QC.png" }], remaining: 49 },
    "5": { success: true, deck_id: "mock123", cards: [{ suit: "HEARTS", value: "2", code: "2H", image: "https://deckofcardsapi.com/static/img/2H.png" }, { suit: "SPADES", value: "5", code: "5S", image: "https://deckofcardsapi.com/static/img/5S.png" }, { suit: "DIAMONDS", value: "JACK", code: "JD", image: "https://deckofcardsapi.com/static/img/JD.png" }, { suit: "CLUBS", value: "10", code: "0C", image: "https://deckofcardsapi.com/static/img/0C.png" }, { suit: "HEARTS", value: "9", code: "9H", image: "https://deckofcardsapi.com/static/img/9H.png" }], remaining: 47 },
  },
  dogs: {
    random: { message: "https://images.dog.ceo/breeds/retriever-golden/n02099601_7771.jpg", status: "success" },
    husky: { message: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg", status: "success" },
    corgi: { message: "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1030.jpg", status: "success" },
    labrador: { message: "https://images.dog.ceo/breeds/labrador/n02099712_4323.jpg", status: "success" },
    poodle: { message: "https://images.dog.ceo/breeds/poodle-standard/n02113799_2280.jpg", status: "success" },
  },
};