import { Media } from './api';

export interface Collection {
  id: number;
  name: string;
  description: string;
  movieIds: number[];
}

// Predefined collections
export const popularCollections: Collection[] = [
  {
    id: 1241,
    name: "Harry Potter Collection",
    description: "The magical journey of Harry Potter and his friends at Hogwarts School of Witchcraft and Wizardry.",
    movieIds: [671, 672, 673, 674, 675, 767, 12444, 12445]
  },
  {
    id: 295,
    name: "Pirates of the Caribbean Collection",
    description: "Follow Captain Jack Sparrow and his adventures on the high seas.",
    movieIds: [22, 58, 285, 1865, 166426]
  },
  {
    id: 10,
    name: "Star Wars Collection",
    description: "The epic space saga chronicling the adventures of the Skywalker family and the battle between the Jedi and the Sith.",
    movieIds: [1893, 11, 1894, 1895, 1891, 1892, 140607, 181808, 181812]
  },
  {
    id: 86311,
    name: "The Lord of the Rings Collection",
    description: "The journey through Middle-earth to destroy the One Ring and defeat the dark lord Sauron.",
    movieIds: [120, 121, 122]
  },
  {
    id: 131296,
    name: "Marvel Cinematic Universe",
    description: "The interconnected superhero films based on Marvel Comics characters.",
    movieIds: [1726, 1724, 10138, 10195, 1771, 24428, 68721, 76338, 99861, 102899, 118340, 271110, 284052, 284053, 299536, 299537, 566525, 1930]
  },
  {
    id: 9485,
    name: "Fast & Furious Collection",
    description: "High-octane action films centered around illegal street racing and heists.",
    movieIds: [9799, 9273, 51497, 59109, 13804, 168259, 168259, 337339, 337339, 385687]
  },
  {
    id: 528,
    name: "Indiana Jones Collection",
    description: "The adventures of archaeologist Indiana Jones.",
    movieIds: [89, 87, 88, 217]
  },
  {
    id: 87096,
    name: "The Matrix Collection",
    description: "A dystopian future where humanity is unknowingly trapped inside a simulated reality.",
    movieIds: [603, 604, 605, 624860]
  },
  {
    id: 645,
    name: "The Terminator Collection",
    description: "A series of science fiction action films centered around a war between Skynet's synthetic intelligence and John Connor's Resistance.",
    movieIds: [218, 280, 534, 296, 522, 87101]
  },
  {
    id: 87065,
    name: "Jurassic Park Collection",
    description: "A series of science fiction adventure films centered around the disastrous attempt to create a theme park of cloned dinosaurs.",
    movieIds: [329, 330, 331, 332, 333, 335]
  }
];

// Streaming service collections
export interface StreamingCollection {
  id: string;
  name: string;
  logo: string;
  color: string;
  movieIds: number[];
}

export const streamingCollections: StreamingCollection[] = [
  {
    id: "netflix",
    name: "Netflix Originals",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
    color: "bg-red-600",
    movieIds: [399566, 508947, 497698, 634649, 616037, 545611, 619979]
  },
  {
    id: "disney",
    name: "Disney+ Picks",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1280px-Disney%2B_logo.svg.png",
    color: "bg-blue-700",
    movieIds: [566525, 284053, 284054, 330457, 447365, 420818, 508947]
  },
  {
    id: "prime",
    name: "Prime Video Featured",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/1200px-Amazon_Prime_Video_logo.svg.png",
    color: "bg-blue-500",
    movieIds: [602211, 438631, 505642, 459151, 547016, 624860]
  }
];
