/* ============================================================
   Banques de questions du Quiz en direct (quiz-prof.html).
   Générées à partir des QCM et Vrai/Faux des pages chapitre.

   Pour ajouter un quiz sur mesure, copier le modèle tout en bas
   (QUIZ_PERSO) : même format que initQCM.
   - "correct: true" sur la ou les bonnes réponses ;
   - 2 à 4 réponses par question ;
   - "vf: true" pour garder l'ordre Vrai / Faux (sinon les réponses
     sont mélangées à chaque partie) ;
   - "contexte: true" pour une question qui dépend d'une animation
     (décochée par défaut).
   ============================================================ */

const QUIZ_PERSO = [];

const QUIZ_BANQUES = [
 {
  "id": "chapitre1-4eme",
  "niveau": "4ème",
  "titre": "Chapitre 1 — Constitution de la matière",
  "questions": [
   {
    "prompt": "Dans quel état la matière est-elle compressible ?",
    "explanation": "Seul le gaz est compressible : ses particules, très éloignées les unes des autres, peuvent se rapprocher.",
    "options": [
     {
      "text": "Le gaz",
      "correct": true
     },
     {
      "text": "Le liquide",
      "correct": false
     },
     {
      "text": "Le solide",
      "correct": false
     }
    ]
   },
   {
    "prompt": "L'air que nous respirons est-il un corps pur ou un mélange ?",
    "explanation": "L'air contient plusieurs espèces chimiques différentes (diazote, dioxygène...) : c'est un mélange.",
    "options": [
     {
      "text": "Un mélange (diazote, dioxygène, autres gaz)",
      "correct": true
     },
     {
      "text": "Un corps pur",
      "correct": false
     },
     {
      "text": "Ni l'un ni l'autre",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lorsque la glace fond, la masse de l'eau diminue.",
    "explanation": "Faux : la masse est conservée lors d'un changement d'état (le nombre de particules ne change pas). C'est le volume qui peut varier.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Lors de la fusion d'un corps pur, que fait la température ?",
    "explanation": "Pendant tout le changement d'état d'un corps pur, la température reste constante : c'est un palier sur la courbe.",
    "options": [
     {
      "text": "Elle reste constante (palier)",
      "correct": true
     },
     {
      "text": "Elle augmente sans s'arrêter",
      "correct": false
     },
     {
      "text": "Elle diminue puis augmente",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un morceau de bois (ρ ≈ 0,60 kg/L) coule dans l'eau.",
    "explanation": "Faux : la masse volumique du bois (0,60 kg/L) est inférieure à celle de l'eau (1,00 kg/L) : le bois flotte.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre2-4eme",
  "niveau": "4ème",
  "titre": "Chapitre 2 — Transformations chimiques",
  "questions": [
   {
    "prompt": "Un glaçon qui fond dans un verre d'eau : de quel type de transformation s'agit-il ?",
    "explanation": "L'eau reste de l'eau (H₂O), qu'elle soit solide ou liquide : c'est une transformation physique, pas chimique.",
    "options": [
     {
      "text": "Une transformation physique (l'espèce chimique H₂O reste la même)",
      "correct": true
     },
     {
      "text": "Une transformation chimique (une nouvelle espèce apparaît)",
      "correct": false
     },
     {
      "text": "Ni l'un ni l'autre",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lors d'une transformation chimique, la masse des produits formés est toujours égale à la masse des réactifs consommés.",
    "explanation": "Vrai : c'est la conservation de la masse lors d'une transformation chimique.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle est la formule chimique de l'eau ?",
    "explanation": "L'eau est constituée de molécules formées de 2 atomes d'hydrogène et 1 atome d'oxygène : H₂O.",
    "options": [
     {
      "text": "H₂O",
      "correct": true
     },
     {
      "text": "O₂H",
      "correct": false
     },
     {
      "text": "H₂O₂",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Dans l'équation C + O₂ → CO₂, que représente C + O₂ ?",
    "explanation": "Les réactifs (à gauche de la flèche) sont les espèces chimiques qui disparaissent ; les produits (à droite) sont celles qui apparaissent.",
    "options": [
     {
      "text": "Les réactifs",
      "correct": true
     },
     {
      "text": "Les produits",
      "correct": false
     },
     {
      "text": "Le catalyseur",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre3-4eme",
  "niveau": "4ème",
  "titre": "Chapitre 3 — Organisation de la matière dans l'Univers",
  "questions": [
   {
    "prompt": "Quelle est la durée de la période de révolution de la Terre autour du Soleil ?",
    "explanation": "La Terre met 1 an pour faire le tour du Soleil (révolution) ; elle tourne sur elle-même en 24h (rotation).",
    "options": [
     {
      "text": "1 an",
      "correct": true
     },
     {
      "text": "24 heures",
      "correct": false
     },
     {
      "text": "1 mois",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Pourquoi voit-on toujours la même face de la Lune depuis la Terre ?",
    "explanation": "La Lune tourne bien sur elle-même, mais à la même vitesse qu'elle tourne autour de la Terre : elle nous montre donc toujours la même face.",
    "options": [
     {
      "text": "Parce que sa période de rotation est égale à sa période de révolution",
      "correct": true
     },
     {
      "text": "Parce que la Lune ne tourne pas sur elle-même",
      "correct": false
     },
     {
      "text": "Parce que la Terre ne tourne pas",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Le Soleil est une étoile parmi tant d'autres dans la Voie lactée.",
    "explanation": "Vrai : la Voie lactée regroupe un très grand nombre d'étoiles, dont le Soleil.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle unité est la mieux adaptée pour exprimer la distance entre deux galaxies ?",
    "explanation": "L'année-lumière est adaptée aux très grandes distances, comme celles entre étoiles ou entre galaxies.",
    "options": [
     {
      "text": "L'année-lumière",
      "correct": true
     },
     {
      "text": "Le kilomètre",
      "correct": false
     },
     {
      "text": "L'unité astronomique",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre4-4eme",
  "niveau": "4ème",
  "titre": "Chapitre 4 — Les mouvements",
  "questions": [
   {
    "prompt": "Un passager assis dans un train qui roule est-il en mouvement par rapport au train ?",
    "explanation": "Le passager reste à la même place dans le référentiel train : il y est immobile, même s'il est en mouvement par rapport au sol.",
    "options": [
     {
      "text": "Non, il est immobile par rapport au train",
      "correct": true
     },
     {
      "text": "Oui, il est toujours en mouvement",
      "correct": false
     },
     {
      "text": "Cela dépend de la vitesse du train",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une balançoire décrit un arc de cercle. Quel est le type de son mouvement ?",
    "explanation": "La trajectoire est une portion de cercle : le mouvement est circulaire.",
    "options": [
     {
      "text": "Circulaire",
      "correct": true
     },
     {
      "text": "Rectiligne",
      "correct": false
     },
     {
      "text": "Curviligne",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Sur un schéma, la distance entre les positions successives d'un objet diminue au cours du temps. Que peut-on dire du mouvement ?",
    "explanation": "Si les positions se rapprochent au fil du temps (à durée égale entre chaque point), l'objet parcourt une distance de plus en plus petite : sa vitesse diminue, le mouvement est décéléré.",
    "options": [
     {
      "text": "Il est décéléré (la vitesse diminue)",
      "correct": true
     },
     {
      "text": "Il est accéléré (la vitesse augmente)",
      "correct": false
     },
     {
      "text": "Il est uniforme (la vitesse est constante)",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre5-4eme",
  "niveau": "4ème",
  "titre": "Chapitre 5 — Les interactions",
  "questions": [
   {
    "prompt": "Un aimant attire un trombone à distance. Que peut-on dire du trombone ?",
    "explanation": "Toute action mécanique a une action réciproque opposée : le trombone attire aussi l'aimant, même si c'est moins visible.",
    "options": [
     {
      "text": "Il attire aussi l'aimant (action réciproque)",
      "correct": true
     },
     {
      "text": "Il n'exerce aucune action sur l'aimant",
      "correct": false
     },
     {
      "text": "Il repousse l'aimant",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une force est représentée par...",
    "explanation": "Une force est modélisée par une flèche (vecteur), caractérisée notamment par sa direction et son point d'application.",
    "options": [
     {
      "text": "Une flèche, avec une direction et un point d'application",
      "correct": true
     },
     {
      "text": "Un simple point",
      "correct": false
     },
     {
      "text": "Un nombre seul",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Seule la Terre attire les objets ; les objets n'attirent pas la Terre.",
    "explanation": "Faux : l'interaction gravitationnelle est réciproque. La Terre attire un objet, et l'objet attire aussi (très faiblement) la Terre.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre6-4eme",
  "niveau": "4ème",
  "titre": "Chapitre 6 — L'énergie",
  "questions": [
   {
    "prompt": "Une pomme contient de l'énergie...",
    "explanation": "Les aliments contiennent de l'énergie chimique, comme le pétrole, le charbon ou le gaz.",
    "options": [
     {
      "text": "Chimique",
      "correct": true
     },
     {
      "text": "Cinétique",
      "correct": false
     },
     {
      "text": "Nucléaire",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Laquelle de ces sources d'énergie est renouvelable ?",
    "explanation": "L'énergie solaire est exploitable sans limite de durée à l'échelle humaine : c'est une source renouvelable, contrairement au pétrole et au charbon (sources fossiles, non renouvelables).",
    "options": [
     {
      "text": "L'énergie solaire",
      "correct": true
     },
     {
      "text": "Le pétrole",
      "correct": false
     },
     {
      "text": "Le charbon",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Entre une pompe de 1000 W et une pompe de 250 W, laquelle vide une cave le plus rapidement ?",
    "explanation": "Plus la puissance est grande, plus le convertisseur agit vite : la pompe de 1000 W vide la cave plus rapidement.",
    "options": [
     {
      "text": "La pompe de 1000 W",
      "correct": true
     },
     {
      "text": "La pompe de 250 W",
      "correct": false
     },
     {
      "text": "Les deux mettent le même temps",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre7-4eme",
  "niveau": "4ème",
  "titre": "Chapitre 7 — Circuit électrique",
  "questions": [
   {
    "prompt": "Une diode branchée dans le mauvais sens laisse quand même passer le courant.",
    "explanation": "Faux : la diode (comme la DEL) ne laisse passer le courant que dans un seul sens.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Dans une guirlande de Noël en série, une ampoule grille. Que se passe-t-il ?",
    "explanation": "En série, une ampoule grillée ouvre la boucle : le courant ne circule plus du tout, toutes les ampoules s'éteignent.",
    "options": [
     {
      "text": "Toute la guirlande s'éteint",
      "correct": true
     },
     {
      "text": "Seule cette ampoule s'éteint, les autres restent allumées",
      "correct": false
     },
     {
      "text": "Rien ne change",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quel est le rôle d'un disjoncteur ?",
    "explanation": "Le disjoncteur protège l'installation en ouvrant le circuit dès que l'intensité dépasse un certain seuil (souvent 20 A pour une installation domestique).",
    "options": [
     {
      "text": "Ouvrir le circuit en cas de surintensité, pour éviter un incendie",
      "correct": true
     },
     {
      "text": "Augmenter la tension du circuit",
      "correct": false
     },
     {
      "text": "Empêcher tout court-circuit de se produire physiquement",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre8-4eme",
  "niveau": "4ème",
  "titre": "Chapitre 8 — Les signaux lumineux et les signaux sonores",
  "questions": [
   {
    "prompt": "La Lune émet-elle sa propre lumière ?",
    "explanation": "La Lune est un objet diffusant : elle ne produit pas sa propre lumière, mais renvoie une partie de celle du Soleil.",
    "options": [
     {
      "text": "Non, elle diffuse la lumière du Soleil qu'elle reçoit",
      "correct": true
     },
     {
      "text": "Oui, comme le Soleil",
      "correct": false
     },
     {
      "text": "Non, elle ne renvoie aucune lumière",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quel rayonnement une télécommande de télévision utilise-t-elle ?",
    "explanation": "Une télécommande utilise des rayonnements infrarouges, invisibles pour l'œil humain.",
    "options": [
     {
      "text": "Les infrarouges (IR)",
      "correct": true
     },
     {
      "text": "Les ultraviolets (UV)",
      "correct": false
     },
     {
      "text": "La lumière visible uniquement",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un astronaute dans l'espace peut entendre le bruit de ses instruments.",
    "explanation": "Faux : le son ne se propage pas dans le vide, faute de milieu matériel. L'astronaute n'entend rien.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Un son de fréquence très basse (quelques dizaines de Hz) est plutôt...",
    "explanation": "La fréquence des sons graves est plus faible que celle des sons aigus.",
    "options": [
     {
      "text": "Grave",
      "correct": true
     },
     {
      "text": "Aigu",
      "correct": false
     },
     {
      "text": "Inaudible dans tous les cas",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Pourquoi préfère-t-on souvent la lumière (ondes) au son pour transmettre une information sur une longue distance ?",
    "explanation": "Des ondes comme la lumière permettent de transmettre une information sur de longues distances et beaucoup plus rapidement que le son.",
    "options": [
     {
      "text": "Car elle est plus rapide et porte plus loin sans intermédiaires",
      "correct": true
     },
     {
      "text": "Car le son ne peut transmettre aucune information",
      "correct": false
     },
     {
      "text": "Car la lumière ne nécessite aucun émetteur",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre1-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 1 — Introduction : la précision en physique-chimie",
  "questions": [
   {
    "prompt": "Dans la vie de tous les jours, il n'y a aucune incertitude sur une mesure, contrairement à la physique-chimie.",
    "explanation": "Faux : l'incertitude existe toujours, même dans la vie quotidienne — elle reste seulement implicite (non énoncée). En sciences, on la rend explicite (chiffrée).",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Deux personnes qui lisent la même graduation d'un thermomètre obtiennent des valeurs légèrement différentes. De quel type d'erreur s'agit-il ?",
    "explanation": "C'est une erreur aléatoire : elle varie de façon imprévisible d'une lecture à l'autre, selon l'angle de vue ou l'attention de la personne qui lit.",
    "options": [
     {
      "text": "Une erreur aléatoire, liée à la lecture",
      "correct": true
     },
     {
      "text": "Une erreur systématique, liée à l'appareil",
      "correct": false
     },
     {
      "text": "Un dysfonctionnement de l'appareil",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Combien de chiffres significatifs contient le nombre 0,0450 ?",
    "explanation": "Les deux zéros de tête ne sont pas significatifs ; 4, 5 et le zéro final (après la virgule) le sont : 3 chiffres significatifs.",
    "options": [
     {
      "text": "3",
      "correct": true
     },
     {
      "text": "5",
      "correct": false
     },
     {
      "text": "2",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Écrire L = 15,3 ± 0,3 cm signifie que l'on est certain à 100 % que la longueur vraie vaut exactement 15,3 cm.",
    "explanation": "Faux : cela signifie que la valeur vraie a de bonnes chances d'être comprise entre 15,0 et 15,6 cm — ce n'est jamais une certitude absolue.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre2-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 2 — Corps purs et mélanges",
  "questions": [
   {
    "prompt": "Dans un mélange hétérogène, que peut-on observer à l'œil nu, même après agitation ?",
    "explanation": "C'est la définition même d'un mélange hétérogène : au moins deux des constituants restent visibles à l'œil nu, même après agitation.",
    "options": [
     {
      "text": "Au moins deux constituants distincts",
      "correct": true
     },
     {
      "text": "Un seul constituant, comme dans un mélange homogène",
      "correct": false
     },
     {
      "text": "Rien, il est toujours parfaitement transparent",
      "correct": false
     }
    ]
   },
   {
    "prompt": "La température de changement d'état d'un mélange reste constante, tout comme pour un corps pur.",
    "explanation": "Faux : seul un corps pur change d'état à température constante (palier). Un mélange n'a pas de vrai palier.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Sur la CCM, après élution, une tache du mélange A + B est à la même hauteur qu'une tache du composé A pur. Qu'en déduit-on ?",
    "explanation": "Pour un éluant et un support donnés, une espèce migre toujours à la même hauteur (même Rf), pure ou dans un mélange : une même hauteur signale donc la même espèce.",
    "options": [
     {
      "text": "Le mélange contient le composé A",
      "correct": true
     },
     {
      "text": "Le mélange ne contient pas le composé A",
      "correct": false
     },
     {
      "text": "On ne peut rien conclure sans autre information",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre3-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 3 — Solutions aqueuses",
  "questions": [
   {
    "prompt": "Le glucose dissous en solution aqueuse, noté C₆H₁₂O₆(aq), est un soluté…",
    "explanation": "Le glucose est une molécule neutre (pas de charge électrique) : c'est donc un soluté moléculaire, contrairement à des ions comme Na⁺ ou Cl⁻.",
    "options": [
     {
      "text": "Moléculaire",
      "correct": true
     },
     {
      "text": "Ionique",
      "correct": false
     },
     {
      "text": "Ni l'un ni l'autre",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Le facteur de dilution F est toujours supérieur à 1.",
    "explanation": "Vrai : une dilution rend la solution moins concentrée (t_f < t_m), donc F = t_m/t_f est toujours supérieur à 1.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Que permet de déterminer une échelle de teintes ?",
    "explanation": "En comparant la teinte de la solution S à celles des solutions étalon, on obtient un encadrement de sa concentration (par exemple t₃ < t < t₄), pas une valeur exacte.",
    "options": [
     {
      "text": "Un encadrement de la concentration, par comparaison des teintes",
      "correct": true
     },
     {
      "text": "La valeur exacte de la concentration, sans aucune incertitude",
      "correct": false
     },
     {
      "text": "Uniquement la couleur de la solution, rien de plus",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre4-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 4 — Description des mouvements",
  "questions": [
   {
    "prompt": "Pour situer ET dater chaque position d'un ballon, il faut…",
    "explanation": "Le repère donne les coordonnées de chaque position, l'horloge donne l'instant. Leur association constitue le référentiel.",
    "options": [
     {
      "text": "Un repère d'espace et une horloge",
      "correct": true
     },
     {
      "text": "Un repère d'espace seulement",
      "correct": false
     },
     {
      "text": "Une horloge seulement",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une trajectoire qui est une portion de cercle correspond à un mouvement…",
    "explanation": "Par définition, un mouvement dont la trajectoire est une portion de cercle est un mouvement circulaire.",
    "options": [
     {
      "text": "Circulaire",
      "correct": true
     },
     {
      "text": "Rectiligne",
      "correct": false
     },
     {
      "text": "Curviligne",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Le vecteur déplacement MM' dépend de la trajectoire suivie par le système entre M et M'.",
    "explanation": "Faux : le vecteur déplacement MM' ne dépend que des positions de départ et d'arrivée, pas du chemin parcouru entre les deux.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Pour une durée Δt extrêmement courte, le vecteur vitesse en un point devient…",
    "explanation": "C'est la définition même du vecteur vitesse instantané : pour Δt extrêmement court, il devient tangent à la trajectoire au point considéré.",
    "options": [
     {
      "text": "Tangent à la trajectoire",
      "correct": true
     },
     {
      "text": "Perpendiculaire à la trajectoire",
      "correct": false
     },
     {
      "text": "Constant en valeur, quelle que soit la trajectoire",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un voyageur reste immobile sur un tapis roulant d'aéroport en marche. Par rapport à quoi est-il immobile ?",
    "explanation": "Même système, deux référentiels, deux descriptions : par rapport au tapis, le voyageur est immobile ; par rapport au sol, il est en mouvement (il avance avec le tapis). Le mouvement est relatif.",
    "options": [
     {
      "text": "Le tapis roulant",
      "correct": true
     },
     {
      "text": "Le sol de l'aéroport",
      "correct": false
     },
     {
      "text": "Les deux à la fois",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Si la valeur du vecteur vitesse reste la même au cours du temps, le mouvement est dit…",
    "explanation": "Un mouvement est dit uniforme lorsque la valeur du vecteur vitesse ne change pas au cours du temps (peu importe la direction).",
    "options": [
     {
      "text": "Uniforme",
      "correct": true
     },
     {
      "text": "Rectiligne",
      "correct": false
     },
     {
      "text": "Accéléré",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre5-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 5 — Modéliser une action mécanique sur un système",
  "questions": [
   {
    "prompt": "Avec l'échelle 1 graduation ↔ 100 N, combien de graduations mesure le vecteur représentant une force de 350 N ?",
    "explanation": "La longueur est proportionnelle à la valeur : 350 N ÷ 100 N = 3,5 graduations.",
    "options": [
     {
      "text": "3,5 graduations",
      "correct": true
     },
     {
      "text": "35 graduations",
      "correct": false
     },
     {
      "text": "0,35 graduation",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Dans le diagramme ci-dessus, quel type d'action la table exerce-t-elle sur le livre ?",
    "explanation": "Le livre touche la table : c'est une action de contact, notée par un trait plein. La Terre agit à distance, d'où les pointillés.",
    "options": [
     {
      "text": "Une action de contact (trait plein)",
      "correct": true
     },
     {
      "text": "Une action à distance (pointillés)",
      "correct": false
     },
     {
      "text": "Aucune action : seule la Terre agit sur le livre",
      "correct": false
     }
    ],
    "contexte": true
   },
   {
    "prompt": "Deux systèmes sont en interaction. Que peut-on dire des deux forces qu'ils exercent l'un sur l'autre ?",
    "explanation": "C'est le principe des actions réciproques, valable pour toute interaction (contact ou à distance, mouvement ou repos).",
    "options": [
     {
      "text": "Même droite d'action, sens opposés, même valeur",
      "correct": true
     },
     {
      "text": "Directions différentes, mêmes sens, valeurs différentes",
      "correct": false
     },
     {
      "text": "Cela dépend uniquement s'ils sont en mouvement ou non",
      "correct": false
     }
    ]
   },
   {
    "prompt": "En l'absence de frottement, l'action d'un support sur un système est toujours perpendiculaire au support.",
    "explanation": "Vrai : sans frottement, la force exercée par le support est perpendiculaire à sa surface. Avec frottement (support incliné par exemple), ce n'est plus le cas.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre6-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 6 — Principe d'inertie",
  "questions": [
   {
    "prompt": "Une force qui s'exerce sur un système peut modifier…",
    "explanation": "Une force peut faire varier la valeur du mouvement (accélérer/ralentir) et/ou sa direction (changer de trajectoire).",
    "options": [
     {
      "text": "La valeur et/ou la direction de son vecteur vitesse",
      "correct": true
     },
     {
      "text": "Uniquement sa masse",
      "correct": false
     },
     {
      "text": "Rien : une force n'a aucun effet sur le mouvement",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Si les forces qui s'exercent sur un système se compensent, alors ce système est nécessairement immobile.",
    "explanation": "Faux : le principe d'inertie dit que le système reste immobile OU en mouvement rectiligne uniforme — les deux cas sont possibles.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Le vecteur vitesse d'un système varie entre deux instants voisins. Que peut-on en conclure sur les forces qui s'exercent sur lui ?",
    "explanation": "C'est la contraposée du principe d'inertie : si v varie, les forces qui s'exercent sur le système ne se compensent pas.",
    "options": [
     {
      "text": "Elles ne se compensent pas",
      "correct": true
     },
     {
      "text": "Elles se compensent forcément",
      "correct": false
     },
     {
      "text": "On ne peut rien en conclure",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un système est en chute libre lorsqu'il est soumis à…",
    "explanation": "Par définition, un système est en chute libre lorsque la seule force qui s'exerce sur lui est son poids.",
    "options": [
     {
      "text": "Uniquement son poids",
      "correct": true
     },
     {
      "text": "Son poids et la résistance de l'air",
      "correct": false
     },
     {
      "text": "Aucune force",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lors de la montée d'un objet lancé verticalement, la valeur de son vecteur vitesse augmente.",
    "explanation": "Faux : lors de la montée, la valeur de la vitesse diminue (l'objet ralentit) ; c'est lors de la descente qu'elle augmente.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre7-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 7 — De l'atome à l'élément chimique",
  "questions": [
   {
    "prompt": "Un atome possède toujours autant de protons que d'électrons. Sa charge électrique totale est donc…",
    "explanation": "Les charges +e (protons) et −e (électrons) se compensent exactement puisqu'il y en a autant : la charge totale est nulle.",
    "options": [
     {
      "text": "Nulle : l'atome est électriquement neutre",
      "correct": true
     },
     {
      "text": "Positive",
      "correct": false
     },
     {
      "text": "Négative",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un atome de cuivre Cu et un ion cuivre (II) Cu²⁺ ont le même numéro atomique Z = 29. Qu'ont-ils en commun ?",
    "explanation": "Le numéro atomique Z compte les protons, qui ne changent jamais lors de la formation d'un ion. Le nombre d'électrons et la charge, eux, diffèrent.",
    "options": [
     {
      "text": "Le même nombre de protons",
      "correct": true
     },
     {
      "text": "Le même nombre d'électrons",
      "correct": false
     },
     {
      "text": "La même charge électrique",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un solide ionique comme le chlorure de sodium est constitué d'un seul type d'entité chimique.",
    "explanation": "Faux : la matière étant électriquement neutre, un solide ionique est constitué d'au moins deux types d'entités (anions et cations), en proportions qui assurent la neutralité globale.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre8-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 8 — Vers des entités plus stables",
  "questions": [
   {
    "prompt": "Un atome de soufre S gagne 2 électrons pour former un ion stable, de configuration identique à l'argon. Quelle est la charge de cet ion ?",
    "explanation": "En gagnant 2 électrons supplémentaires (charges négatives), l'atome initialement neutre acquiert une charge globale de 2−.",
    "options": [
     {
      "text": "2−",
      "correct": true
     },
     {
      "text": "2+",
      "correct": false
     },
     {
      "text": "Neutre",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Dans une liaison covalente, les 2 électrons du doublet liant appartiennent uniquement à l'un des deux atomes.",
    "explanation": "Faux : les électrons d'un doublet liant sont mis en commun et appartiennent aux deux atomes. Seuls les doublets non liants appartiennent à un seul atome.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre9-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 9 — Émission et perception d'un son",
  "questions": [
   {
    "prompt": "Un signal sonore peut se propager dans le vide.",
    "explanation": "Faux : un signal sonore a besoin d'un milieu matériel (gaz, liquide ou solide) pour se propager. Dans le vide, aucune molécule ne transmet la vibration.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Dans quel milieu le son se propage-t-il le plus vite ?",
    "explanation": "Environ 5 000 m·s⁻¹ dans l'acier, 1 500 m·s⁻¹ dans l'eau et 345 m·s⁻¹ dans l'air : la vitesse dépend du milieu.",
    "options": [
     {
      "text": "L'acier solide",
      "correct": true
     },
     {
      "text": "L'eau liquide",
      "correct": false
     },
     {
      "text": "L'air",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un son de fréquence 40 kHz est…",
    "explanation": "40 kHz est supérieur à 20 kHz : c'est un ultrason, l'oreille humaine ne l'entend pas.",
    "options": [
     {
      "text": "un ultrason, inaudible pour l'oreille humaine",
      "correct": true
     },
     {
      "text": "un son audible très aigu",
      "correct": false
     },
     {
      "text": "un infrason",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Deux signaux sonores ont la même période mais des formes différentes. Les deux sons ont…",
    "explanation": "Même période donc même fréquence et même hauteur. Le timbre est lié à la forme du signal : formes différentes, timbres différents.",
    "options": [
     {
      "text": "la même hauteur et des timbres différents",
      "correct": true
     },
     {
      "text": "la même hauteur et le même timbre",
      "correct": false
     },
     {
      "text": "des hauteurs différentes et le même timbre",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Si l'intensité sonore double, le niveau d'intensité sonore double aussi.",
    "explanation": "Faux : I et L varient dans le même sens mais ne sont pas proportionnels. Si I double, L augmente de 3 dB seulement.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre10-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 10 — Spectres d'émission",
  "questions": [
   {
    "prompt": "La lumière d'un laser est décomposée en plusieurs couleurs par un prisme.",
    "explanation": "Faux : la lumière d'un laser est monochromatique. Elle est déviée par le prisme mais pas décomposée : une seule couleur apparaît sur l'écran.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Une radiation de longueur d'onde λ = 900 nm est…",
    "explanation": "900 nm est supérieur à 800 nm, limite du rouge : la radiation appartient à l'infrarouge, invisible pour l'œil.",
    "options": [
     {
      "text": "invisible pour l'œil : c'est de l'infrarouge",
      "correct": true
     },
     {
      "text": "visible, de couleur rouge",
      "correct": false
     },
     {
      "text": "invisible pour l'œil : c'est de l'ultraviolet",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quand la température de surface d'un corps chaud augmente, son spectre…",
    "explanation": "Le spectre d'un corps chaud reste continu. Il devient plus lumineux et s'enrichit vers le violet quand la température augmente.",
    "options": [
     {
      "text": "devient plus lumineux et s'enrichit vers le violet",
      "correct": true
     },
     {
      "text": "devient un spectre de raies",
      "correct": false
     },
     {
      "text": "s'enrichit vers le rouge",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un gaz inconnu émet des raies à 410, 434, 486 et 656 nm. Ce gaz est…",
    "explanation": "Ces quatre longueurs d'onde sont celles des raies de l'hydrogène. Les longueurs d'onde des raies sont caractéristiques de l'entité.",
    "options": [
     {
      "text": "l'hydrogène",
      "correct": true
     },
     {
      "text": "le mercure",
      "correct": false
     },
     {
      "text": "le sodium",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre11-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 11 — La quantité de matière",
  "questions": [
   {
    "prompt": "Un clou en fer a une masse de 5,6 g. Avec m(Fe) = 9,35 × 10⁻²⁶ kg, combien contient-il d'atomes de fer ?",
    "explanation": "N = m(échantillon) / m(Fe) = 5,6 × 10⁻³ kg / 9,35 × 10⁻²⁶ kg = 6,0 × 10²². Attention à convertir 5,6 g en kg.",
    "options": [
     {
      "text": "6,0 × 10²²",
      "correct": true
     },
     {
      "text": "6,0 × 10²⁵",
      "correct": false
     },
     {
      "text": "1,7 × 10⁻²³",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une mole d'atomes de fer et une mole de molécules d'eau contiennent le même nombre d'entités.",
    "explanation": "Vrai : une mole contient toujours 6,02 × 10²³ entités, quelle que soit l'entité. Leurs masses, en revanche, sont différentes.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre12-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 12 — La transformation chimique",
  "questions": [
   {
    "prompt": "On fait brûler 2 mol de CH₄ avec 3 mol de O₂ (CH₄ + 2 O₂ → CO₂ + 2 H₂O). Quel est le réactif limitant ?",
    "explanation": "n₀(CH₄) / 1 = 2 et n₀(O₂) / 2 = 1,5. La plus petite valeur correspond à O₂ : c'est le réactif limitant.",
    "options": [
     {
      "text": "O₂",
      "correct": true
     },
     {
      "text": "CH₄",
      "correct": false
     },
     {
      "text": "Aucun : le mélange est stœchiométrique",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lors d'une transformation endothermique, la température du milieu extérieur augmente.",
    "explanation": "Faux : le système reçoit de l'énergie du milieu extérieur, dont la température diminue.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Le produit synthétisé S donne deux taches : l'une à la hauteur de l'espèce attendue E, l'autre plus bas. Que conclure ?",
    "explanation": "Une tache à la même hauteur que E : S contient E. Deux taches : S est un mélange, le produit brut n'est pas pur.",
    "options": [
     {
      "text": "S contient E, mais n'est pas pur",
      "correct": true
     },
     {
      "text": "S ne contient pas E",
      "correct": false
     },
     {
      "text": "S est de l'espèce E pure",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre13-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 13 — Transformation physique",
  "questions": [
   {
    "prompt": "Quel est le nom du changement d'état gaz → solide ?",
    "explanation": "La condensation est le passage direct de l'état gazeux à l'état solide (le passage inverse, solide → gaz, s'appelle la sublimation).",
    "options": [
     {
      "text": "Condensation",
      "correct": true
     },
     {
      "text": "Sublimation",
      "correct": false
     },
     {
      "text": "Liquéfaction",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lors du changement d'état d'un corps pur, la température varie continuellement.",
    "explanation": "Faux : la température reste constante (palier) pendant tout le changement d'état d'un corps pur, sous une pression donnée.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Quelle équation modélise la fusion de l'eau ?",
    "explanation": "La fusion est le passage de l'état solide (s) à l'état liquide (ℓ).",
    "options": [
     {
      "text": "H₂O(s) → H₂O(ℓ)",
      "correct": true
     },
     {
      "text": "H₂O(ℓ) → H₂O(s)",
      "correct": false
     },
     {
      "text": "H₂O(ℓ) → H₂O(g)",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre14-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 14 — Réfraction et réflexion de la lumière",
  "questions": [
   {
    "prompt": "Un rayon arrive sur l'eau en faisant un angle de 30° avec la surface. Que vaut l'angle d'incidence ?",
    "explanation": "L'angle d'incidence se mesure par rapport à la normale : i₁ = 90° − 30° = 60°.",
    "options": [
     {
      "text": "30°",
      "correct": false
     },
     {
      "text": "60°",
      "correct": true
     },
     {
      "text": "90°",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un rayon passe de l'air (n₁ = 1,00) dans l'eau (n₂ = 1,33) avec i₁ = 30°. Que vaut i₂ ?",
    "explanation": "sin i₂ = 1,00 × sin 30° / 1,33 = 0,376, donc i₂ ≈ 22°.",
    "options": [
     {
      "text": "22°",
      "correct": true
     },
     {
      "text": "30°",
      "correct": false
     },
     {
      "text": "42°",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un rayon arrive sur un miroir avec un angle d'incidence de 35°. Le rayon réfléchi fait un angle de 55° avec la normale.",
    "explanation": "Faux : d'après la loi de la réflexion, i_R = i₁ = 35°. Les 55° sont mesurés par rapport à la surface du miroir.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Dans le verre, n(violet) > n(rouge). Quelle radiation est la plus déviée par le prisme ?",
    "explanation": "Pour un même i₁, un indice plus grand donne un angle i₂ plus petit : la radiation violette est la plus déviée.",
    "options": [
     {
      "text": "La rouge",
      "correct": false
     },
     {
      "text": "La violette",
      "correct": true
     },
     {
      "text": "Toutes de la même façon",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre15-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 15 — Lentilles minces convergentes",
  "questions": [
   {
    "prompt": "Une lentille a une distance focale f' = 5,0 cm. Quelle est la distance entre ses deux foyers F et F' ?",
    "explanation": "F et F' sont de part et d'autre de O : FF' = OF + OF' = 2 × f' = 10 cm.",
    "options": [
     {
      "text": "5,0 cm",
      "correct": false
     },
     {
      "text": "10 cm",
      "correct": true
     },
     {
      "text": "2,5 cm",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un objet placé à 6 cm d'une lentille de distance focale f' = 10 cm donne une image réelle sur un écran.",
    "explanation": "Faux : l'objet est plus proche de la lentille que la distance focale (6 cm < 10 cm), il n'y a pas d'image réelle.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Un objet de 1,5 cm donne une image avec |γ| = 3,0. Quelle est la hauteur de l'image ?",
    "explanation": "A'B' = |γ| × AB = 3,0 × 1,5 cm = 4,5 cm.",
    "options": [
     {
      "text": "0,50 cm",
      "correct": false
     },
     {
      "text": "4,5 cm",
      "correct": true
     },
     {
      "text": "1,5 cm",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Pour lire un livre de près, l'œil modifie la distance entre le cristallin et la rétine.",
    "explanation": "Faux : la distance cristallin-rétine reste égale à 17 mm. C'est la distance focale du cristallin qui diminue : l'œil accommode.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre16-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 16 — Transformation nucléaire",
  "questions": [
   {
    "prompt": "Quels noyaux sont isotopes ?",
    "explanation": "Le chlore 35 et le chlore 37 ont le même Z = 17 et des N différents. L'argon 37 a le même A mais Z = 18 : c'est un autre élément.",
    "options": [
     {
      "text": "³⁵₁₇Cl et ³⁷₁₇Cl",
      "correct": true
     },
     {
      "text": "³⁷₁₇Cl et ³⁷₁₈Ar",
      "correct": false
     },
     {
      "text": "³⁵₁₇Cl, ³⁷₁₇Cl et ³⁷₁₈Ar",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Compléter : ²³⁸₉₂U → ²³⁴₉₀Th + ?",
    "explanation": "Conservation de A : 238 = 234 + 4. Conservation de Z : 92 = 90 + 2. La particule émise est un noyau d'hélium.",
    "options": [
     {
      "text": "⁴₂He",
      "correct": true
     },
     {
      "text": "⁰₋₁e",
      "correct": false
     },
     {
      "text": "¹₀n",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lors d'une transformation nucléaire, les éléments chimiques sont conservés.",
    "explanation": "Faux : de nouveaux noyaux se forment, les éléments chimiques ne sont pas conservés. Ce sont A et Z qui sont conservés.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "La transformation ¹³¹₅₃I → ¹³¹₅₄Xe + ⁰₋₁e est :",
    "explanation": "L'iode devient du xénon : l'élément chimique change, la transformation est nucléaire.",
    "options": [
     {
      "text": "physique",
      "correct": false
     },
     {
      "text": "chimique",
      "correct": false
     },
     {
      "text": "nucléaire",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre17-2nde",
  "niveau": "2nde",
  "titre": "Chapitre 17 — Lois de l'électricité",
  "questions": [
   {
    "prompt": "Au nœud A arrive I = 250 mA ; il repart I₁ = 100 mA et I₂. Que vaut I₂ ?",
    "explanation": "Loi des nœuds : I = I₁ + I₂, donc I₂ = 250 − 100 = 150 mA.",
    "options": [
     {
      "text": "150 mA",
      "correct": true
     },
     {
      "text": "100 mA",
      "correct": false
     },
     {
      "text": "350 mA",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un voltmètre se branche en série avec le dipôle dont on mesure la tension.",
    "explanation": "Faux : le voltmètre se branche en dérivation. C'est l'ampèremètre qui se branche en série.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Une photorésistance permet de réaliser un capteur de :",
    "explanation": "La résistance d'une photorésistance varie avec la luminosité : c'est un capteur de lumière (veilleuse à allumage automatique).",
    "options": [
     {
      "text": "température",
      "correct": false
     },
     {
      "text": "lumière",
      "correct": true
     },
     {
      "text": "intensité",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre1-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 1 — Détermination de la composition d'un système chimique",
  "questions": [
   {
    "prompt": "Dans le zoom interactif ci-dessus, si tu doubles n (par exemple de 1 à 2 mol), que devient le nombre d'entités N ?",
    "explanation": "Comme n = N / N_A, on a N = n × N_A : N est proportionnel à n, donc si n double, N double aussi.",
    "options": [
     {
      "text": "N double aussi",
      "correct": true
     },
     {
      "text": "N reste le même",
      "correct": false
     },
     {
      "text": "N est divisé par 2",
      "correct": false
     }
    ],
    "contexte": true
   },
   {
    "prompt": "Quand on dilue une solution, la quantité de matière de soluté qu'elle contient diminue.",
    "explanation": "Faux : la quantité de matière de soluté ne change pas pendant une dilution (n<sub>m</sub> = n<sub>f</sub>). C'est la concentration qui diminue, car le volume, lui, augmente.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre2-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 2 — Spectrophotométrie UV-visible colorées",
  "questions": [
   {
    "prompt": "Pourquoi la droite d'étalonnage A = f(C) passe-t-elle par l'origine ?",
    "explanation": "La proportionnalité A = k×C impose A(0) = 0 : sans soluté, il n'y a rien à absorber.",
    "options": [
     {
      "text": "Car A = k × C : quand C = 0 (pas de soluté), A = 0",
      "correct": true
     },
     {
      "text": "Par convention, toutes les droites d'étalonnage passent par l'origine",
      "correct": false
     },
     {
      "text": "Uniquement parce qu'on règle le zéro avec un blanc avant de mesurer",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre3-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 3 — Oxydo-réduction",
  "questions": [
   {
    "prompt": "Sur l'animation ci-dessus, M cède des électrons pour devenir Mⁿ⁺. Quel rôle M jouait-il avant de céder ces électrons ?",
    "explanation": "Une entité qui cède des électrons est, par définition, un réducteur. En les cédant, il s'oxyde et devient son oxydant conjugué.",
    "options": [
     {
      "text": "Réducteur",
      "correct": true
     },
     {
      "text": "Oxydant",
      "correct": false
     },
     {
      "text": "Ni l'un ni l'autre",
      "correct": false
     }
    ],
    "contexte": true
   },
   {
    "prompt": "Dans l'équation finale d'une réaction d'oxydoréduction, les électrons échangés doivent apparaître explicitement.",
    "explanation": "Faux : les électrons échangés ne doivent jamais apparaître dans l'équation finale — ils s'éliminent quand on combine les deux demi-équations avec les bons coefficients.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre4-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 4 — Tableau d'avancement",
  "questions": [
   {
    "prompt": "Règle n₀(I₂) = 3 mmol et n₀(S₂O₃²⁻) = 4 mmol sur l'animation, puis fais avancer la réaction jusqu'au bout. Quel est le réactif limitant ?",
    "explanation": "x_max(I₂) = 3/1 = 3 et x_max(S₂O₃²⁻) = 4/2 = 2. Le plus petit x_max correspond au réactif limitant : S₂O₃²⁻.",
    "options": [
     {
      "text": "I₂",
      "correct": false
     },
     {
      "text": "S₂O₃²⁻",
      "correct": true
     },
     {
      "text": "Impossible à dire",
      "correct": false
     }
    ],
    "contexte": true
   },
   {
    "prompt": "Dans un mélange stœchiométrique, si la transformation est totale, il reste des réactifs à l'état final.",
    "explanation": "Faux : dans un mélange stœchiométrique avec transformation totale, les deux réactifs sont entièrement consommés — leurs quantités finales sont nulles.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre5-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 5 — Titrages colorimétriques",
  "questions": [
   {
    "prompt": "Juste avant l'équivalence, quel est le réactif limitant ?",
    "explanation": "Avant l'équivalence, le titrant versé est immédiatement consommé (il reste encore du diiode en excès) : c'est donc lui le réactif limitant à chaque instant.",
    "options": [
     {
      "text": "Le réactif titrant (S₂O₃²⁻)",
      "correct": true
     },
     {
      "text": "Le réactif titré (I₂)",
      "correct": false
     },
     {
      "text": "Aucun, les deux sont en excès",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Comme le titrage colorimétrique, un dosage par étalonnage nécessite une réaction chimique.",
    "explanation": "Faux : un dosage par étalonnage (par exemple par mesure d'absorbance) ne nécessite aucune réaction chimique, contrairement à un titrage.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre6-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 6 — Ondes mécaniques",
  "questions": [
   {
    "prompt": "Sur l'animation ci-dessus, une onde mécanique progressive transporte de la matière lors de sa propagation (le point jaune finit par avancer avec l'onde).",
    "explanation": "Faux : le point jaune oscille sur place, de haut en bas — il ne se déplace jamais horizontalement. L'onde transporte de l'énergie, pas de matière.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ],
    "contexte": true
   },
   {
    "prompt": "Si on double la période T sans changer la longueur d'onde λ, que devient la célérité v = λ/T ?",
    "explanation": "v = λ/T : si T double (dénominateur ×2) et λ ne change pas, v est divisée par 2.",
    "options": [
     {
      "text": "Elle double",
      "correct": false
     },
     {
      "text": "Elle est divisée par 2",
      "correct": true
     },
     {
      "text": "Elle reste la même",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre7-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 7 — Lentilles minces convergentes",
  "questions": [
   {
    "prompt": "Le rayon qui passe par le centre optique O de la lentille…",
    "explanation": "C'est l'une des propriétés des 3 rayons caractéristiques : celui qui passe par le centre optique traverse la lentille sans être dévié.",
    "options": [
     {
      "text": "n'est pas dévié, il continue tout droit",
      "correct": true
     },
     {
      "text": "converge vers le foyer image F'",
      "correct": false
     },
     {
      "text": "ressort parallèle à l'axe optique",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Sur l'animation ci-dessus, il existe plusieurs positions d'écran où l'image est nette.",
    "explanation": "Faux : pour un objet et une lentille donnés, l'image ne se forme nettement qu'à une seule position précise de l'écran — ailleurs, elle est floue.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ],
    "contexte": true
   }
  ]
 },
 {
  "id": "chapitre8-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 8 — Couleurs",
  "questions": [
   {
    "prompt": "Sur le simulateur, quelle couleur obtient-on en superposant les 3 lumières (rouge, vert, bleu) à intensité maximale ?",
    "explanation": "C'est le principe de la trichromie : superposer les trois lumières colorées primaires à pleine intensité donne du blanc.",
    "options": [
     {
      "text": "Blanc",
      "correct": true
     },
     {
      "text": "Noir",
      "correct": false
     },
     {
      "text": "Gris",
      "correct": false
     }
    ]
   },
   {
    "prompt": "La synthèse soustractive de deux lumières colorées complémentaires donne du blanc.",
    "explanation": "Faux : en synthèse soustractive (absorption), deux couleurs complémentaires superposées absorbent toutes les composantes de la lumière incidente, donnant du noir.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Un objet qui ne diffuse que le rouge est éclairé par une lumière bleue pure. Quelle couleur perçoit-on ?",
    "explanation": "L'objet ne peut diffuser que le rouge, mais la lumière incidente (bleue pure) ne contient aucune composante rouge à diffuser : l'objet apparaît noir.",
    "options": [
     {
      "text": "Noir",
      "correct": true
     },
     {
      "text": "Rouge",
      "correct": false
     },
     {
      "text": "Bleu",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre9-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 9 — Structure et polarité",
  "questions": [
   {
    "prompt": "L'oxygène a 6 électrons de valence. Combien de doublets non liants (paires) a-t-il dans son schéma de Lewis ?",
    "explanation": "Les 4 premiers électrons sont célibataires ; les 2 suivants s'apparient avec 2 des célibataires : on obtient 2 doublets non liants et 2 électrons célibataires restants.",
    "options": [
     {
      "text": "1",
      "correct": false
     },
     {
      "text": "2",
      "correct": true
     },
     {
      "text": "3",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Dans NH₄⁺ formé par addition de H⁺ à NH₃, quel atome porte la charge formelle + ?",
    "explanation": "N possède 4 liaisons et aucun doublet non liant dans NH₄⁺, contre 3 liaisons + 1 doublet non liant à l'état isolé dans NH₃ : il porte donc la charge formelle +.",
    "options": [
     {
      "text": "L'azote N",
      "correct": true
     },
     {
      "text": "Un des hydrogènes H",
      "correct": false
     },
     {
      "text": "Aucun atome en particulier",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une liaison entre deux atomes de même électronégativité (Δχ = 0) est apolaire.",
    "explanation": "Vrai : une liaison n'est polarisée que si les deux atomes ont des électronégativités différentes. Si Δχ = 0, le doublet liant est partagé équitablement.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Le CO₂ possède des liaisons polarisées mais est une molécule apolaire.",
    "explanation": "Vrai : les deux liaisons C=O sont bien polarisées, mais la géométrie linéaire et symétrique de CO₂ fait que les deux effets s'annulent — les barycentres des charges + et − restent confondus.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre10-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 10 — Cohésion de la matière",
  "questions": [
   {
    "prompt": "Parmi les trois types d'interactions comparées sur l'animation, laquelle est en général la plus intense ?",
    "explanation": "L'interaction ionique (entre ions de charges opposées) est la plus intense, suivie de la liaison hydrogène, puis des interactions de van der Waals qui sont les plus faibles.",
    "options": [
     {
      "text": "L'interaction ionique",
      "correct": true
     },
     {
      "text": "Les interactions de van der Waals",
      "correct": false
     },
     {
      "text": "La liaison hydrogène",
      "correct": false
     }
    ],
    "contexte": true
   },
   {
    "prompt": "La dispersion est la première étape de la dissolution d'un solide ionique.",
    "explanation": "Faux : l'ordre est dissociation (séparation des ions), puis solvatation (entourage par les molécules d'eau), puis dispersion (répartition dans la solution).",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Pourquoi choisit-on un solvant d'extraction non miscible au solvant initial ?",
    "explanation": "Si les deux solvants n'étaient pas non miscibles, on obtiendrait une seule phase homogène et il serait impossible de séparer l'espèce extraite par décantation.",
    "options": [
     {
      "text": "Pour permettre la séparation des deux phases par décantation",
      "correct": true
     },
     {
      "text": "Pour qu'ils se mélangent complètement et n'en former qu'une seule",
      "correct": false
     },
     {
      "text": "Cela n'a pas d'importance pour l'extraction",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre11-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 11 — Forces et champs",
  "questions": [
   {
    "prompt": "Sur l'animation ci-dessus, si tu doubles À LA FOIS les deux masses (ou charges) A et B, sans changer la distance, par quel facteur l'intensité de la force est-elle multipliée ?",
    "explanation": "F est proportionnelle au produit m_A × m_B (ou q_A × q_B). Si les deux doublent, le produit est multiplié par 2×2 = 4.",
    "options": [
     {
      "text": "Par 2",
      "correct": false
     },
     {
      "text": "Par 4",
      "correct": true
     },
     {
      "text": "Par 8",
      "correct": false
     }
    ],
    "contexte": true
   },
   {
    "prompt": "Les lignes de champ électrostatique convergent toujours vers la charge, qu'elle soit positive ou négative.",
    "explanation": "Faux : les lignes de champ divergent depuis une charge positive, et convergent seulement vers une charge négative.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre12-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 12 — Fluide au repos",
  "questions": [
   {
    "prompt": "Sur l'animation microscopique, si on augmente la température sans changer la masse volumique, qu'est-ce qui augmente ?",
    "explanation": "Une température plus élevée signifie une agitation plus grande des entités : elles se déplacent plus vite, donc heurtent la paroi plus souvent — la pression augmente.",
    "options": [
     {
      "text": "La fréquence des chocs sur la paroi (donc la pression)",
      "correct": true
     },
     {
      "text": "La masse volumique du fluide",
      "correct": false
     },
     {
      "text": "La taille des particules",
      "correct": false
     }
    ],
    "contexte": true
   },
   {
    "prompt": "D'après la loi de Mariotte, si la pression P d'un gaz double (à T et n constantes), son volume V double aussi.",
    "explanation": "Faux : P × V = constante. Si P double, V est divisé par 2 pour que le produit reste inchangé.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre13-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 13 — Mouvements d'un système",
  "questions": [
   {
    "prompt": "Quand l'écart temporel Δt devient très petit, le vecteur déplacement M_iM_{i+1} devient…",
    "explanation": "C'est la définition même du vecteur vitesse instantané : pour Δt extrêmement court, le déplacement devient tangent à la trajectoire au point considéré.",
    "options": [
     {
      "text": "tangent à la trajectoire",
      "correct": true
     },
     {
      "text": "perpendiculaire à la trajectoire",
      "correct": false
     },
     {
      "text": "constant en valeur, quelle que soit la trajectoire",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lors d'une décélération en ligne droite, le vecteur variation de vitesse Δv est dans le même sens que le mouvement.",
    "explanation": "Faux : si la vitesse diminue, Δv = v_final − v_initial pointe dans le sens opposé au mouvement (c'est cohérent avec ΣF = mΔv/Δt : la force de freinage s'oppose au mouvement).",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Lors d'un mouvement circulaire uniforme, le vecteur variation de vitesse Δv pointe…",
    "explanation": "C'est ce que montre la construction géométrique de Δv sur un cercle : le vecteur variation de vitesse est centripète, dirigé vers le centre.",
    "options": [
     {
      "text": "vers le centre de la trajectoire",
      "correct": true
     },
     {
      "text": "dans le sens du mouvement",
      "correct": false
     },
     {
      "text": "vers l'extérieur de la trajectoire",
      "correct": false
     }
    ]
   },
   {
    "prompt": "ΣF et Δv sont toujours colinéaires et de même sens, que ce soit en chute libre ou en mouvement circulaire.",
    "explanation": "Vrai : c'est une conséquence directe de la relation ΣF = m × Δv/Δt (m > 0), valable quelle que soit la situation.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre14-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 14 — Couleurs",
  "questions": [
   {
    "prompt": "Sur le simulateur, quelle couleur obtient-on en superposant les 3 lumières (rouge, vert, bleu) à intensité maximale ?",
    "explanation": "C'est le principe de la trichromie : superposer les trois lumières colorées primaires à pleine intensité donne du blanc.",
    "options": [
     {
      "text": "Blanc",
      "correct": true
     },
     {
      "text": "Noir",
      "correct": false
     },
     {
      "text": "Gris",
      "correct": false
     }
    ]
   },
   {
    "prompt": "La synthèse soustractive de deux lumières colorées complémentaires donne du blanc.",
    "explanation": "Faux : en synthèse soustractive (absorption), deux couleurs complémentaires superposées absorbent toutes les composantes de la lumière incidente, donnant du noir.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Un objet qui ne diffuse que le rouge est éclairé par une lumière bleue pure. Quelle couleur perçoit-on ?",
    "explanation": "L'objet ne peut diffuser que le rouge, mais la lumière incidente (bleue pure) ne contient aucune composante rouge à diffuser : l'objet apparaît noir.",
    "options": [
     {
      "text": "Noir",
      "correct": true
     },
     {
      "text": "Rouge",
      "correct": false
     },
     {
      "text": "Bleu",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre15-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 15 — Structure des entités organiques",
  "questions": [
   {
    "prompt": "Quelle est la différence entre un aldéhyde et une cétone ?",
    "explanation": "Les deux familles partagent le même groupe carbonyle C=O : il est en bout de chaîne pour l'aldéhyde, à l'intérieur de la chaîne pour la cétone.",
    "options": [
     {
      "text": "Le groupe carbonyle est terminal (aldéhyde) ou interne (cétone)",
      "correct": true
     },
     {
      "text": "L'aldéhyde possède un groupe OH, pas la cétone",
      "correct": false
     },
     {
      "text": "Il n'y a pas de différence, ce sont des synonymes",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Comment doit-on numéroter la chaîne principale d'une molécule organique oxygénée ?",
    "explanation": "C'est la règle de numérotation : le numéro attribué au carbone portant le groupe caractéristique doit être le plus petit possible.",
    "options": [
     {
      "text": "De sorte que le carbone fonctionnel ait le plus petit numéro possible",
      "correct": true
     },
     {
      "text": "Toujours en partant de la gauche",
      "correct": false
     },
     {
      "text": "Le sens de numérotation n'a pas d'importance",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un groupe carboxyle présente une seule bande d'absorption caractéristique, comme un groupe hydroxyle.",
    "explanation": "Faux : le groupe carboxyle présente deux bandes caractéristiques (O−H et C=O), alors que l'hydroxyle n'en présente qu'une seule (O−H).",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre16-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 16 — Synthèse chimique",
  "questions": [
   {
    "prompt": "À quelle étape du protocole utilise-t-on un montage de chauffage à reflux ?",
    "explanation": "Le chauffage à reflux sert à accélérer la réaction sans perte de matière : c'est l'outil caractéristique de l'étape de transformation chimique.",
    "options": [
     {
      "text": "La transformation chimique",
      "correct": true
     },
     {
      "text": "Le prélèvement des réactifs",
      "correct": false
     },
     {
      "text": "L'analyse",
      "correct": false
     }
    ]
   },
   {
    "prompt": "L'entonnoir de filtration et l'ampoule à décanter sont tous les deux utilisés à l'étape de l'isolement, mais l'un pour un solide et l'autre pour un liquide.",
    "explanation": "Vrai : pour isoler un solide, on filtre ; pour isoler un liquide, on procède à une extraction liquide-liquide à l'ampoule à décanter. Les deux techniques appartiennent à l'étape d'isolement.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   }
  ]
 },
 {
  "id": "chapitre18-1ere",
  "niveau": "1ère spé PC",
  "titre": "Chapitre 18 — Énergie des systèmes électriques",
  "questions": [
   {
    "prompt": "Pour une source réelle (résistance interne r > 0), quand l'intensité I augmente, la tension U aux bornes de la source…",
    "explanation": "U = E − r×I : plus I augmente, plus le terme r×I est grand, donc U diminue. C'est ce qui distingue une source réelle d'une source idéale.",
    "options": [
     {
      "text": "diminue",
      "correct": true
     },
     {
      "text": "augmente",
      "correct": false
     },
     {
      "text": "reste constante",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Le rendement η d'un convertisseur peut être supérieur à 1 si celui-ci est particulièrement efficace.",
    "explanation": "Faux : η = P_exploitable / P_entrée est toujours inférieur ou égal à 1, car un convertisseur ne peut jamais restituer plus de puissance qu'il n'en reçoit (conservation de l'énergie).",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   }
  ]
 },
 {
  "id": "terminale-chap0-histoire-electricite",
  "niveau": "Terminale ES",
  "titre": "Chapitre 0 — Une brève histoire de l'électricité",
  "questions": [
   {
    "prompt": "D'où vient le mot « électricité » ?",
    "explanation": "Thalès observe l'ambre frotté vers 600 av. J.-C. ; c'est Gilbert, en 1600, qui forge le mot « electricus » à partir du grec « elektron ».",
    "options": [
     {
      "text": "Du grec « elektron », qui désigne l'ambre",
      "correct": true
     },
     {
      "text": "Du latin « electrum », qui désigne l'éclair",
      "correct": false
     },
     {
      "text": "Du nom d'un physicien appelé Electricus",
      "correct": false
     },
     {
      "text": "D'une ville grecque nommée Elektra",
      "correct": false
     }
    ]
   },
   {
    "prompt": "L'expérience de Nollet à Versailles avait pour but de mesurer précisément, en mètres par seconde, la vitesse de propagation de l'électricité.",
    "explanation": "Nollet démontre qualitativement que la décharge paraît instantanée sur toute la chaîne, y compris sur 1600 mètres de circonférence — mais il ne la mesure pas précisément.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Qui remporte, en pratique, la « guerre des courants » ?",
    "explanation": "Westinghouse remporte le contrat de l'Exposition universelle de Chicago (1893), puis l'exploitation des chutes du Niagara, ce qui installe durablement le courant alternatif.",
    "options": [
     {
      "text": "Le courant alternatif, porté par Westinghouse et Tesla",
      "correct": true
     },
     {
      "text": "Le courant continu, porté par Edison",
      "correct": false
     },
     {
      "text": "Aucun des deux : le projet est abandonné",
      "correct": false
     },
     {
      "text": "Les deux, à parts égales, dès 1893",
      "correct": false
     }
    ]
   },
   {
    "prompt": "L'électrification des villes marocaines n'a commencé qu'avec l'instauration du protectorat français, en 1912.",
    "explanation": "Dès le début du XXe siècle, Tanger et le palais royal de Fès (sous le sultan Moulay Abdelaziz) disposent déjà de l'électricité. Le protectorat étend ensuite le réseau, mais en priorité vers les ports, les mines de phosphates et les quartiers européens.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": false
     },
     {
      "text": "Faux",
      "correct": true
     }
    ]
   },
   {
    "prompt": "Les campagnes américaines ont été électrifiées avant les campagnes françaises.",
    "explanation": "Les campagnes américaines sont largement raccordées vers 1950 (Rural Electrification Act, 1936), contre 1968 pour les campagnes françaises.",
    "vf": true,
    "options": [
     {
      "text": "Vrai",
      "correct": true
     },
     {
      "text": "Faux",
      "correct": false
     }
    ]
   }
  ]
 }
];

/* ---------- Quiz sur mesure ----------
   Décommenter et compléter le modèle ci-dessous. Ces quiz apparaissent
   en tête de liste, rubrique « Mes quiz ».

QUIZ_PERSO.push({
  id: "revision-2nde-ch1-ch2",
  titre: "Révisions — mesure et mélanges",
  questions: [
    {
      prompt: "Quelle est l'unité légale de la masse ?",
      options: [
        { text: "le kilogramme", correct: true },
        { text: "le gramme" },
        { text: "le newton" },
        { text: "le litre" }
      ],
      explanation: "L'unité du Système international est le kilogramme (kg)."
    }
  ]
});
*/
