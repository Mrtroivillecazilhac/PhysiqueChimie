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
   },
   {
    "prompt": "Combien vaut 12,5 + 3,27, écrit avec le bon nombre de chiffres ?",
    "explanation": "Pour une somme, le résultat garde le plus petit nombre de décimales des données : 12,5 n'en a qu'une, donc 15,77 s'arrondit à 15,8.",
    "options": [
     {
      "text": "15,8",
      "correct": true
     },
     {
      "text": "15,77",
      "correct": false
     },
     {
      "text": "16",
      "correct": false
     },
     {
      "text": "15,80",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Combien vaut 2,5 × 3,14, écrit avec le bon nombre de chiffres significatifs ?",
    "explanation": "Pour un produit, le résultat garde le plus petit nombre de chiffres significatifs des données : 2,5 en a 2, donc 7,85 s'arrondit à 7,9.",
    "options": [
     {
      "text": "7,9",
      "correct": true
     },
     {
      "text": "7,85",
      "correct": false
     },
     {
      "text": "7,850",
      "correct": false
     },
     {
      "text": "8",
      "correct": false
     }
    ]
   },
   {
    "prompt": "On mesure L = 20,0 ± 0,2 cm. Que vaut l'incertitude relative ?",
    "explanation": "Incertitude relative = U(L) / L = 0,2 / 20,0 = 0,01, soit 1 %.",
    "options": [
     {
      "text": "1 %",
      "correct": true
     },
     {
      "text": "0,2 %",
      "correct": false
     },
     {
      "text": "2 %",
      "correct": false
     },
     {
      "text": "10 %",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Les zéros placés à gauche du premier chiffre non nul sont des chiffres significatifs.",
    "explanation": "Ils ne servent qu'à placer la virgule : 0,0045 ne comporte que 2 chiffres significatifs.",
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
    "prompt": "Le nombre 4,50 × 10³ comporte 3 chiffres significatifs.",
    "explanation": "En écriture scientifique, on compte tous les chiffres de 4,50 : 4, 5 et 0.",
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
    "prompt": "Une balance mal tarée affiche toujours 2 g de trop. De quel type d'erreur s'agit-il ?",
    "explanation": "L'erreur décale toutes les mesures dans le même sens, de la même valeur : c'est une erreur systématique.",
    "options": [
     {
      "text": "Une erreur systématique",
      "correct": true
     },
     {
      "text": "Une erreur aléatoire",
      "correct": false
     },
     {
      "text": "Une erreur de lecture",
      "correct": false
     },
     {
      "text": "Aucune erreur",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Parmi ces résultats, lequel est le plus précis ?",
    "explanation": "Le plus précis est celui dont l'incertitude relative est la plus petite : 0,05 / 15,30 ≈ 0,3 %.",
    "options": [
     {
      "text": "L = 15,30 ± 0,05 cm",
      "correct": true
     },
     {
      "text": "L = 15,3 ± 0,3 cm",
      "correct": false
     },
     {
      "text": "L = 15 ± 1 cm",
      "correct": false
     },
     {
      "text": "L = 15,3 ± 0,5 cm",
      "correct": false
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
   },
   {
    "prompt": "50,0 mL d'huile ont une masse de 46,0 g. Quelle est sa masse volumique ?",
    "explanation": "ρ = m / V = 46,0 / 50,0 = 0,920 g/mL.",
    "options": [
     {
      "text": "0,920 g/mL",
      "correct": true
     },
     {
      "text": "1,09 g/mL",
      "correct": false
     },
     {
      "text": "2,30 kg/L",
      "correct": false
     },
     {
      "text": "4,60 g/mL",
      "correct": false
     }
    ]
   },
   {
    "prompt": "La densité d'un liquide s'exprime en g/L.",
    "explanation": "La densité est le quotient de deux masses volumiques : elle est sans unité.",
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
    "prompt": "Un liquide de densité 0,80, non miscible à l'eau, est versé dans l'eau. Où se place-t-il ?",
    "explanation": "Sa densité est inférieure à 1 : il est moins dense que l'eau et flotte au-dessus.",
    "options": [
     {
      "text": "Au-dessus de l'eau",
      "correct": true
     },
     {
      "text": "Au fond",
      "correct": false
     },
     {
      "text": "Il se mélange à l'eau",
      "correct": false
     },
     {
      "text": "Au milieu de l'eau",
      "correct": false
     }
    ]
   },
   {
    "prompt": "L'eau salée, où l'on ne distingue qu'une seule phase, est…",
    "explanation": "Elle contient au moins deux espèces chimiques (eau et sel) mais on n'en distingue qu'une phase : mélange homogène.",
    "options": [
     {
      "text": "Un mélange homogène",
      "correct": true
     },
     {
      "text": "Un corps pur",
      "correct": false
     },
     {
      "text": "Un mélange hétérogène",
      "correct": false
     },
     {
      "text": "Une espèce chimique",
      "correct": false
     }
    ]
   },
   {
    "prompt": "On dissout 5,0 g de sel dans 95,0 g d'eau. Quelle est la proportion en masse du sel ?",
    "explanation": "Les masses s'additionnent : m tot = 100,0 g. Proportion = 5,0 / 100,0 = 5,0 %.",
    "options": [
     {
      "text": "5,0 %",
      "correct": true
     },
     {
      "text": "5,3 %",
      "correct": false
     },
     {
      "text": "95 %",
      "correct": false
     },
     {
      "text": "10 %",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Pendant la fusion d'un échantillon, la température reste constante à 80 °C. L'échantillon est probablement…",
    "explanation": "Un palier de température lors d'un changement d'état est caractéristique d'un corps pur.",
    "options": [
     {
      "text": "Un corps pur",
      "correct": true
     },
     {
      "text": "Un mélange homogène",
      "correct": false
     },
     {
      "text": "Un mélange hétérogène",
      "correct": false
     },
     {
      "text": "Une solution aqueuse",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Sur une CCM, un corps pur donne après élution…",
    "explanation": "Un corps pur ne contient qu'une espèce chimique : une seule tache.",
    "options": [
     {
      "text": "Une seule tache",
      "correct": true
     },
     {
      "text": "Deux taches au moins",
      "correct": false
     },
     {
      "text": "Aucune tache",
      "correct": false
     },
     {
      "text": "Une tache sur la ligne de dépôt",
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
   },
   {
    "prompt": "On dissout 4,0 g de soluté dans 250 mL de solution. Quelle est la concentration en masse t ?",
    "explanation": "t = m / V = 4,0 / (250 × 10⁻³) = 16 g·L⁻¹.",
    "options": [
     {
      "text": "16 g·L⁻¹",
      "correct": true
     },
     {
      "text": "1,0 g·L⁻¹",
      "correct": false
     },
     {
      "text": "0,016 g·L⁻¹",
      "correct": false
     },
     {
      "text": "62,5 g·L⁻¹",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle masse de soluté faut-il peser pour préparer 200,0 mL de solution à t = 5,0 g·L⁻¹ ?",
    "explanation": "m = t × V = 5,0 × 200,0 × 10⁻³ = 1,0 g.",
    "options": [
     {
      "text": "1,0 g",
      "correct": true
     },
     {
      "text": "40 g",
      "correct": false
     },
     {
      "text": "1000 g",
      "correct": false
     },
     {
      "text": "0,025 g",
      "correct": false
     }
    ]
   },
   {
    "prompt": "On veut préparer 50,0 mL de solution fille avec un facteur de dilution F = 10. Quel volume de solution mère prélever ?",
    "explanation": "V m = V f / F = 50,0 / 10 = 5,0 mL.",
    "options": [
     {
      "text": "5,0 mL",
      "correct": true
     },
     {
      "text": "500 mL",
      "correct": false
     },
     {
      "text": "10 mL",
      "correct": false
     },
     {
      "text": "0,50 mL",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Dans l'eau sucrée, l'eau est…",
    "explanation": "Le solvant est l'espèce majoritaire qui dissout le soluté (ici le sucre).",
    "options": [
     {
      "text": "Le solvant",
      "correct": true
     },
     {
      "text": "Le soluté",
      "correct": false
     },
     {
      "text": "La solution",
      "correct": false
     },
     {
      "text": "Un mélange hétérogène",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une solution saturée peut encore dissoudre du soluté.",
    "explanation": "Saturée signifie que la solubilité est atteinte : le soluté ajouté ne se dissout plus.",
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
    "prompt": "Avec quelle verrerie prélève-t-on précisément le volume de solution mère lors d'une dilution ?",
    "explanation": "La pipette jaugée donne le volume le plus précis ; la solution fille est ensuite préparée dans une fiole jaugée.",
    "options": [
     {
      "text": "Une pipette jaugée",
      "correct": true
     },
     {
      "text": "Un bécher",
      "correct": false
     },
     {
      "text": "Une éprouvette graduée",
      "correct": false
     },
     {
      "text": "Un erlenmeyer",
      "correct": false
     }
    ]
   },
   {
    "prompt": "La masse volumique d'une solution et la concentration en masse d'un soluté s'expriment dans la même unité, mais ce sont deux grandeurs différentes.",
    "explanation": "Toutes deux en g·L⁻¹, mais ρ = m solution / V alors que t = m soluté / V.",
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
   },
   {
    "prompt": "Sur une chronophotographie, les positions sont alignées et régulièrement espacées. Le mouvement est…",
    "explanation": "Points alignés : trajectoire droite. Espacement constant pour des durées égales : vitesse constante.",
    "options": [
     {
      "text": "Rectiligne uniforme",
      "correct": true
     },
     {
      "text": "Rectiligne accéléré",
      "correct": false
     },
     {
      "text": "Circulaire uniforme",
      "correct": false
     },
     {
      "text": "Rectiligne ralenti",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Les positions sont alignées et de plus en plus espacées. Le mouvement est…",
    "explanation": "L'objet parcourt des distances de plus en plus grandes pendant des durées égales : il accélère.",
    "options": [
     {
      "text": "Rectiligne accéléré",
      "correct": true
     },
     {
      "text": "Rectiligne uniforme",
      "correct": false
     },
     {
      "text": "Rectiligne ralenti",
      "correct": false
     },
     {
      "text": "Circulaire",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Entre deux positions, un système parcourt 0,60 m en 0,20 s. Quelle est la valeur de sa vitesse ?",
    "explanation": "v = MM' / Δt = 0,60 / 0,20 = 3,0 m/s.",
    "options": [
     {
      "text": "3,0 m/s",
      "correct": true
     },
     {
      "text": "0,12 m/s",
      "correct": false
     },
     {
      "text": "0,33 m/s",
      "correct": false
     },
     {
      "text": "30 m/s",
      "correct": false
     }
    ]
   },
   {
    "prompt": "À combien de m/s correspond une vitesse de 36 km/h ?",
    "explanation": "On divise par 3,6 : 36 / 3,6 = 10 m/s.",
    "options": [
     {
      "text": "10 m/s",
      "correct": true
     },
     {
      "text": "36 m/s",
      "correct": false
     },
     {
      "text": "3,6 m/s",
      "correct": false
     },
     {
      "text": "130 m/s",
      "correct": false
     }
    ]
   },
   {
    "prompt": "La description du mouvement d'un objet dépend du référentiel choisi.",
    "explanation": "Le voyageur sur le tapis roulant est immobile par rapport au tapis mais en mouvement par rapport au sol.",
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
    "prompt": "Quel référentiel est adapté pour étudier le mouvement d'une voiture sur une route ?",
    "explanation": "On étudie un mouvement à la surface de la Terre, sur une courte durée : le référentiel terrestre convient.",
    "options": [
     {
      "text": "Le référentiel terrestre",
      "correct": true
     },
     {
      "text": "Le référentiel héliocentrique",
      "correct": false
     },
     {
      "text": "Le référentiel géocentrique",
      "correct": false
     },
     {
      "text": "Le référentiel lié à la voiture",
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
   },
   {
    "prompt": "Quelle est l'unité d'une force ?",
    "explanation": "La valeur d'une force s'exprime en newton, noté N.",
    "options": [
     {
      "text": "Le newton (N)",
      "correct": true
     },
     {
      "text": "Le kilogramme (kg)",
      "correct": false
     },
     {
      "text": "Le joule (J)",
      "correct": false
     },
     {
      "text": "Le watt (W)",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle est la valeur du poids d'un objet de masse 2,0 kg (g = 9,8 N/kg) ?",
    "explanation": "P = m × g = 2,0 × 9,8 = 19,6 N, soit 20 N avec 2 chiffres significatifs.",
    "options": [
     {
      "text": "20 N",
      "correct": true
     },
     {
      "text": "2,0 N",
      "correct": false
     },
     {
      "text": "4,9 N",
      "correct": false
     },
     {
      "text": "0,20 N",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelles sont les caractéristiques du vecteur force ?",
    "explanation": "Un vecteur force est défini par son point d'application, sa direction, son sens et sa valeur (sa norme).",
    "options": [
     {
      "text": "Point d'application, direction, sens, valeur",
      "correct": true
     },
     {
      "text": "Masse, vitesse, direction",
      "correct": false
     },
     {
      "text": "Point d'application et masse seulement",
      "correct": false
     },
     {
      "text": "Direction et durée",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Le poids est une action mécanique de contact.",
    "explanation": "Le poids modélise l'action de la Terre, qui s'exerce à distance.",
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
    "prompt": "Si la distance entre deux objets double, la force d'interaction gravitationnelle est…",
    "explanation": "F = G × m A × m B / d² : la distance est au carré, donc doubler d divise F par 2² = 4.",
    "options": [
     {
      "text": "Divisée par 4",
      "correct": true
     },
     {
      "text": "Divisée par 2",
      "correct": false
     },
     {
      "text": "Multipliée par 2",
      "correct": false
     },
     {
      "text": "Inchangée",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un objet est suspendu à un fil. L'action du fil sur l'objet est représentée par une force…",
    "explanation": "Un fil tendu tire l'objet suivant sa propre direction, vers le point d'attache.",
    "options": [
     {
      "text": "Dirigée le long du fil, vers le point d'attache",
      "correct": true
     },
     {
      "text": "Verticale vers le bas",
      "correct": false
     },
     {
      "text": "Perpendiculaire au fil",
      "correct": false
     },
     {
      "text": "Nulle",
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
   },
   {
    "prompt": "Selon le principe d'inertie, si les forces qui s'exercent sur un système se compensent, il est…",
    "explanation": "Forces qui se compensent ⇔ vecteur vitesse constant : immobilité ou mouvement rectiligne uniforme.",
    "options": [
     {
      "text": "Immobile ou en mouvement rectiligne uniforme",
      "correct": true
     },
     {
      "text": "Forcément immobile",
      "correct": false
     },
     {
      "text": "Forcément en mouvement accéléré",
      "correct": false
     },
     {
      "text": "En mouvement circulaire",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un palet glisse sur une glace sans frottement après avoir été lancé. Son mouvement est…",
    "explanation": "Son poids et l'action de la glace se compensent : d'après le principe d'inertie, son mouvement est rectiligne uniforme.",
    "options": [
     {
      "text": "Rectiligne uniforme",
      "correct": true
     },
     {
      "text": "Rectiligne ralenti",
      "correct": false
     },
     {
      "text": "Rectiligne accéléré",
      "correct": false
     },
     {
      "text": "Circulaire",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un parachutiste descend verticalement à vitesse constante. Que peut-on dire des forces qui s'exercent sur lui ?",
    "explanation": "Mouvement rectiligne uniforme : d'après le principe d'inertie, les forces se compensent.",
    "options": [
     {
      "text": "Elles se compensent",
      "correct": true
     },
     {
      "text": "Le poids l'emporte",
      "correct": false
     },
     {
      "text": "L'action de l'air l'emporte",
      "correct": false
     },
     {
      "text": "Il n'est soumis à aucune force",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un système en mouvement circulaire uniforme est soumis à des forces qui se compensent.",
    "explanation": "La direction du vecteur vitesse change à chaque instant : les forces ne se compensent pas.",
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
    "prompt": "Un système immobile dans un référentiel est soumis à des forces qui se compensent.",
    "explanation": "C'est la réciproque du principe d'inertie : vecteur vitesse constant (nul) ⇒ forces qui se compensent.",
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
   },
   {
    "prompt": "Combien le noyau ²⁷₁₃Al contient-il de protons et de neutrons ?",
    "explanation": "Z = 13 protons ; N = A − Z = 27 − 13 = 14 neutrons.",
    "options": [
     {
      "text": "13 protons et 14 neutrons",
      "correct": true
     },
     {
      "text": "27 protons et 13 neutrons",
      "correct": false
     },
     {
      "text": "13 protons et 27 neutrons",
      "correct": false
     },
     {
      "text": "14 protons et 13 neutrons",
      "correct": false
     }
    ]
   },
   {
    "prompt": "L'ion sodium Na⁺ (Z = 11) possède combien d'électrons ?",
    "explanation": "L'atome a 11 électrons ; l'ion Na⁺ en a perdu un : 10 électrons.",
    "options": [
     {
      "text": "10",
      "correct": true
     },
     {
      "text": "11",
      "correct": false
     },
     {
      "text": "12",
      "correct": false
     },
     {
      "text": "23",
      "correct": false
     }
    ]
   },
   {
    "prompt": "L'ion chlorure Cl⁻ s'est formé à partir d'un atome de chlore qui a…",
    "explanation": "Une charge négative signifie un électron en plus : l'atome a gagné un électron.",
    "options": [
     {
      "text": "Gagné 1 électron",
      "correct": true
     },
     {
      "text": "Perdu 1 électron",
      "correct": false
     },
     {
      "text": "Gagné 1 proton",
      "correct": false
     },
     {
      "text": "Perdu 1 proton",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle particule est électriquement neutre ?",
    "explanation": "Le proton porte +e, l'électron −e, le neutron n'est pas chargé.",
    "options": [
     {
      "text": "Le neutron",
      "correct": true
     },
     {
      "text": "Le proton",
      "correct": false
     },
     {
      "text": "L'électron",
      "correct": false
     },
     {
      "text": "L'ion",
      "correct": false
     }
    ]
   },
   {
    "prompt": "La masse d'un atome est presque entièrement concentrée dans son noyau.",
    "explanation": "Les électrons sont environ 2000 fois plus légers que les nucléons.",
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
    "prompt": "Le rayon d'un atome est environ combien de fois plus grand que celui de son noyau ?",
    "explanation": "r atome / r noyau = 10⁻¹⁰ / 10⁻¹⁵ = 10⁵.",
    "options": [
     {
      "text": "10⁵ fois",
      "correct": true
     },
     {
      "text": "10 fois",
      "correct": false
     },
     {
      "text": "100 fois",
      "correct": false
     },
     {
      "text": "10¹⁵ fois",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un élément chimique est caractérisé par…",
    "explanation": "Tous les atomes et ions d'un même élément ont le même nombre de protons Z.",
    "options": [
     {
      "text": "Son numéro atomique Z",
      "correct": true
     },
     {
      "text": "Son nombre de neutrons",
      "correct": false
     },
     {
      "text": "Son nombre de nucléons A",
      "correct": false
     },
     {
      "text": "Sa masse",
      "correct": false
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
   },
   {
    "prompt": "Quelle est la configuration électronique de l'oxygène (Z = 8) ?",
    "explanation": "On remplit 1s, puis 2s, puis 2p : 2 + 2 + 4 = 8 électrons.",
    "options": [
     {
      "text": "1s² 2s² 2p⁴",
      "correct": true
     },
     {
      "text": "1s² 2s² 2p⁶",
      "correct": false
     },
     {
      "text": "1s² 2s⁶",
      "correct": false
     },
     {
      "text": "1s² 2p⁶",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Le phosphore a pour configuration 1s² 2s² 2p⁶ 3s² 3p³. Combien a-t-il d'électrons de valence ?",
    "explanation": "Électrons de la dernière couche (n = 3) : 3s² 3p³, soit 2 + 3 = 5.",
    "options": [
     {
      "text": "5",
      "correct": true
     },
     {
      "text": "3",
      "correct": false
     },
     {
      "text": "15",
      "correct": false
     },
     {
      "text": "2",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quel ion stable forme le sodium (Z = 11) ?",
    "explanation": "En perdant 1 électron, il prend la configuration du néon, gaz noble le plus proche.",
    "options": [
     {
      "text": "Na⁺",
      "correct": true
     },
     {
      "text": "Na⁻",
      "correct": false
     },
     {
      "text": "Na²⁺",
      "correct": false
     },
     {
      "text": "Na²⁻",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quel ion stable forme le magnésium (Z = 12) ?",
    "explanation": "En perdant ses 2 électrons de valence, il prend la configuration du néon.",
    "options": [
     {
      "text": "Mg²⁺",
      "correct": true
     },
     {
      "text": "Mg⁺",
      "correct": false
     },
     {
      "text": "Mg²⁻",
      "correct": false
     },
     {
      "text": "Mg⁻",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Les éléments d'une même colonne du tableau périodique ont…",
    "explanation": "Ils forment une famille chimique, aux propriétés chimiques communes.",
    "options": [
     {
      "text": "Le même nombre d'électrons de valence",
      "correct": true
     },
     {
      "text": "Le même nombre de protons",
      "correct": false
     },
     {
      "text": "La même masse",
      "correct": false
     },
     {
      "text": "Le même nombre de neutrons",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Les gaz nobles réagissent très facilement avec les autres éléments.",
    "explanation": "Les gaz nobles sont remarquablement stables et réagissent très rarement.",
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
    "prompt": "En général, combien de liaisons covalentes un atome de carbone établit-il ?",
    "explanation": "Le carbone a 4 électrons de valence ; il forme 4 liaisons pour atteindre la configuration du néon (comme dans CH₄).",
    "options": [
     {
      "text": "4",
      "correct": true
     },
     {
      "text": "1",
      "correct": false
     },
     {
      "text": "2",
      "correct": false
     },
     {
      "text": "3",
      "correct": false
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
   },
   {
    "prompt": "Un signal sonore a une période T = 2,0 ms. Quelle est sa fréquence ?",
    "explanation": "f = 1 / T = 1 / (2,0 × 10⁻³) = 500 Hz.",
    "options": [
     {
      "text": "500 Hz",
      "correct": true
     },
     {
      "text": "2,0 Hz",
      "correct": false
     },
     {
      "text": "0,50 Hz",
      "correct": false
     },
     {
      "text": "2000 Hz",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelles fréquences l'oreille humaine peut-elle entendre ?",
    "explanation": "En dessous de 20 Hz : infrasons ; au-dessus de 20 kHz : ultrasons.",
    "options": [
     {
      "text": "De 20 Hz à 20 kHz",
      "correct": true
     },
     {
      "text": "De 0 Hz à 20 Hz",
      "correct": false
     },
     {
      "text": "De 20 kHz à 200 kHz",
      "correct": false
     },
     {
      "text": "De 200 Hz à 2 kHz",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle est la vitesse approximative du son dans l'air ?",
    "explanation": "Dans l'air, à température ambiante, le son se propage à environ 340 m/s.",
    "options": [
     {
      "text": "340 m/s",
      "correct": true
     },
     {
      "text": "3,0 × 10⁸ m/s",
      "correct": false
     },
     {
      "text": "34 m/s",
      "correct": false
     },
     {
      "text": "3400 m/s",
      "correct": false
     }
    ]
   },
   {
    "prompt": "On entend le tonnerre 3,0 s après avoir vu l'éclair. À quelle distance est l'orage ?",
    "explanation": "d = v × Δt = 340 × 3,0 ≈ 1,0 × 10³ m. La lumière arrive presque instantanément.",
    "options": [
     {
      "text": "Environ 1 km",
      "correct": true
     },
     {
      "text": "Environ 100 m",
      "correct": false
     },
     {
      "text": "Environ 10 km",
      "correct": false
     },
     {
      "text": "Environ 3 m",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Plus un son est aigu, plus sa fréquence est élevée.",
    "explanation": "La hauteur d'un son est liée à sa fréquence : un son aigu a une fréquence élevée.",
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
    "prompt": "Avec quel appareil mesure-t-on un niveau d'intensité sonore ?",
    "explanation": "Le sonomètre affiche directement le niveau d'intensité sonore, en décibel (dB).",
    "options": [
     {
      "text": "Un sonomètre",
      "correct": true
     },
     {
      "text": "Un oscilloscope",
      "correct": false
     },
     {
      "text": "Un voltmètre",
      "correct": false
     },
     {
      "text": "Un microphone seul",
      "correct": false
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
   },
   {
    "prompt": "Entre quelles longueurs d'onde se situe la lumière visible, dans le vide ou dans l'air ?",
    "explanation": "Du violet (400 nm) au rouge (800 nm) environ.",
    "options": [
     {
      "text": "Environ 400 nm et 800 nm",
      "correct": true
     },
     {
      "text": "Environ 100 nm et 400 nm",
      "correct": false
     },
     {
      "text": "Environ 800 nm et 1200 nm",
      "correct": false
     },
     {
      "text": "Environ 4 nm et 8 nm",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une lumière constituée d'une seule radiation est dite…",
    "explanation": "Mono = une seule ; la lumière blanche, elle, est polychromatique.",
    "options": [
     {
      "text": "Monochromatique",
      "correct": true
     },
     {
      "text": "Polychromatique",
      "correct": false
     },
     {
      "text": "Blanche",
      "correct": false
     },
     {
      "text": "Continue",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quel type de spectre donne le filament d'une lampe à incandescence ?",
    "explanation": "Un corps chaud émet un spectre continu, qui dépend de sa température.",
    "options": [
     {
      "text": "Un spectre continu",
      "correct": true
     },
     {
      "text": "Un spectre de raies d'émission",
      "correct": false
     },
     {
      "text": "Un spectre vide",
      "correct": false
     },
     {
      "text": "Une seule raie",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quel type de spectre donne une lampe à vapeur de sodium ?",
    "explanation": "Un gaz excité émet seulement certaines radiations : spectre de raies.",
    "options": [
     {
      "text": "Un spectre de raies d'émission",
      "correct": true
     },
     {
      "text": "Un spectre continu",
      "correct": false
     },
     {
      "text": "Le spectre de la lumière blanche",
      "correct": false
     },
     {
      "text": "Aucun spectre",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Chaque élément chimique possède un spectre de raies qui lui est propre.",
    "explanation": "C'est sa « signature » : on peut identifier un gaz par ses raies.",
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
    "prompt": "Une radiation de longueur d'onde 450 nm a une couleur…",
    "explanation": "450 nm est dans le visible, du côté du bleu.",
    "options": [
     {
      "text": "Bleue",
      "correct": true
     },
     {
      "text": "Rouge",
      "correct": false
     },
     {
      "text": "Jaune",
      "correct": false
     },
     {
      "text": "Invisible (ultraviolet)",
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
   },
   {
    "prompt": "En quelle unité s'exprime la quantité de matière n ?",
    "explanation": "La quantité de matière compte les entités par paquets : elle s'exprime en mole.",
    "options": [
     {
      "text": "En mole (mol)",
      "correct": true
     },
     {
      "text": "En kilogramme (kg)",
      "correct": false
     },
     {
      "text": "Sans unité",
      "correct": false
     },
     {
      "text": "En mol⁻¹",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un échantillon contient N = 1,204 × 10²⁴ molécules. Quelle est sa quantité de matière ? (N A = 6,02 × 10²³ mol⁻¹)",
    "explanation": "n = N / N A = 1,204 × 10²⁴ / 6,02 × 10²³ = 2,00 mol.",
    "options": [
     {
      "text": "2,00 mol",
      "correct": true
     },
     {
      "text": "0,500 mol",
      "correct": false
     },
     {
      "text": "7,25 mol",
      "correct": false
     },
     {
      "text": "1,204 mol",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Combien d'entités contient 0,50 mol de matière ? (N A = 6,02 × 10²³ mol⁻¹)",
    "explanation": "N = n × N A = 0,50 × 6,02 × 10²³ ≈ 3,0 × 10²³.",
    "options": [
     {
      "text": "3,0 × 10²³",
      "correct": true
     },
     {
      "text": "1,2 × 10²⁴",
      "correct": false
     },
     {
      "text": "6,02 × 10²³",
      "correct": false
     },
     {
      "text": "0,50",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle est la masse d'un atome d'aluminium (A = 27) ? (m nucléon = 1,67 × 10⁻²⁷ kg)",
    "explanation": "m ≈ A × m nucléon = 27 × 1,67 × 10⁻²⁷ = 4,51 × 10⁻²⁶ kg.",
    "options": [
     {
      "text": "4,51 × 10⁻²⁶ kg",
      "correct": true
     },
     {
      "text": "1,67 × 10⁻²⁷ kg",
      "correct": false
     },
     {
      "text": "2,70 × 10⁻²⁶ kg",
      "correct": false
     },
     {
      "text": "6,19 × 10⁻²⁹ kg",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Le nombre d'entités N s'exprime en mole.",
    "explanation": "N est un nombre, sans unité. C'est n = N / N A qui s'exprime en mole.",
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
    "prompt": "Deux échantillons de même masse contiennent toujours la même quantité de matière.",
    "explanation": "Cela dépend de la masse des entités : 1 g de fer et 1 g d'eau ne contiennent pas le même nombre d'entités.",
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
    "prompt": "Un échantillon de carbone a une masse de 2,0 g, et m(C) = 2,00 × 10⁻²⁶ kg. Combien contient-il d'atomes ?",
    "explanation": "N = m échantillon / m entité = 2,0 × 10⁻³ / 2,00 × 10⁻²⁶ = 1,0 × 10²³ (masses en kg).",
    "options": [
     {
      "text": "1,0 × 10²³",
      "correct": true
     },
     {
      "text": "1,0 × 10²⁶",
      "correct": false
     },
     {
      "text": "1,0 × 10²⁰",
      "correct": false
     },
     {
      "text": "4,0 × 10⁻²⁶",
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
   },
   {
    "prompt": "Quelle est l'équation ajustée de la formation de l'eau ?",
    "explanation": "Il faut 2 O de chaque côté et 4 H de chaque côté : 2 H₂ + O₂ → 2 H₂O.",
    "options": [
     {
      "text": "2 H₂ + O₂ → 2 H₂O",
      "correct": true
     },
     {
      "text": "H₂ + O₂ → H₂O",
      "correct": false
     },
     {
      "text": "H₂ + O₂ → 2 H₂O",
      "correct": false
     },
     {
      "text": "2 H₂ + 2 O₂ → 2 H₂O",
      "correct": false
     }
    ]
   },
   {
    "prompt": "On fait réagir 1 mol de H₂ avec 1 mol de O₂ (2 H₂ + O₂ → 2 H₂O). Quel est le réactif limitant ?",
    "explanation": "1 mol de O₂ demanderait 2 mol de H₂ : il n'y en a qu'1 mol, H₂ est entièrement consommé en premier.",
    "options": [
     {
      "text": "H₂",
      "correct": true
     },
     {
      "text": "O₂",
      "correct": false
     },
     {
      "text": "Aucun, le mélange est stœchiométrique",
      "correct": false
     },
     {
      "text": "H₂O",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lors d'une transformation chimique, qu'est-ce qui est conservé ?",
    "explanation": "Les atomes se réarrangent : les éléments et la masse sont conservés, mais de nouvelles espèces apparaissent.",
    "options": [
     {
      "text": "Les éléments chimiques et la masse totale",
      "correct": true
     },
     {
      "text": "Les espèces chimiques",
      "correct": false
     },
     {
      "text": "Les molécules",
      "correct": false
     },
     {
      "text": "Le volume total",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lors d'une transformation exothermique, la température du milieu extérieur…",
    "explanation": "Le système cède de l'énergie au milieu extérieur, qui se réchauffe.",
    "options": [
     {
      "text": "Augmente",
      "correct": true
     },
     {
      "text": "Diminue",
      "correct": false
     },
     {
      "text": "Reste constante",
      "correct": false
     },
     {
      "text": "S'annule",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une espèce chimique synthétisée au laboratoire est différente de la même espèce extraite de la nature.",
    "explanation": "Une espèce synthétique est identique à l'espèce naturelle : mêmes propriétés.",
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
    "prompt": "Dans l'équation C + O₂ → CO₂, quels sont les réactifs ?",
    "explanation": "Les réactifs sont à gauche de la flèche ; les produits à droite.",
    "options": [
     {
      "text": "C et O₂",
      "correct": true
     },
     {
      "text": "CO₂",
      "correct": false
     },
     {
      "text": "C seulement",
      "correct": false
     },
     {
      "text": "O₂ et CO₂",
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
   },
   {
    "prompt": "Quel est le nom du changement d'état liquide → gaz ?",
    "explanation": "Liquide → gaz : vaporisation. L'inverse (gaz → liquide) est la liquéfaction.",
    "options": [
     {
      "text": "Vaporisation",
      "correct": true
     },
     {
      "text": "Liquéfaction",
      "correct": false
     },
     {
      "text": "Sublimation",
      "correct": false
     },
     {
      "text": "Fusion",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quel est le nom du changement d'état solide → gaz ?",
    "explanation": "Solide → gaz : sublimation, comme pour la neige carbonique (CO₂ solide).",
    "options": [
     {
      "text": "Sublimation",
      "correct": true
     },
     {
      "text": "Condensation",
      "correct": false
     },
     {
      "text": "Vaporisation",
      "correct": false
     },
     {
      "text": "Fusion",
      "correct": false
     }
    ]
   },
   {
    "prompt": "La fusion de la glace est une transformation…",
    "explanation": "La glace doit recevoir de l'énergie pour fondre : transformation endothermique.",
    "options": [
     {
      "text": "Endothermique",
      "correct": true
     },
     {
      "text": "Exothermique",
      "correct": false
     },
     {
      "text": "Sans échange d'énergie",
      "correct": false
     },
     {
      "text": "Chimique",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle énergie faut-il fournir pour faire fondre 0,50 kg de glace ? (L fusion = 334 kJ/kg)",
    "explanation": "Q = m × L = 0,50 × 334 = 167 kJ.",
    "options": [
     {
      "text": "167 kJ",
      "correct": true
     },
     {
      "text": "668 kJ",
      "correct": false
     },
     {
      "text": "334 kJ",
      "correct": false
     },
     {
      "text": "0,67 kJ",
      "correct": false
     }
    ]
   },
   {
    "prompt": "La solidification de l'eau libère de l'énergie vers le milieu extérieur.",
    "explanation": "C'est la transformation inverse de la fusion : elle est exothermique.",
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
    "prompt": "Lors d'un changement d'état, de nouvelles espèces chimiques se forment.",
    "explanation": "C'est une transformation physique : seul l'état physique change, l'espèce chimique est conservée.",
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
   },
   {
    "prompt": "Quelle relation traduit la loi de Snell-Descartes pour la réfraction ?",
    "explanation": "C'est la deuxième loi de Snell-Descartes pour la réfraction.",
    "options": [
     {
      "text": "n₁ × sin i₁ = n₂ × sin i₂",
      "correct": true
     },
     {
      "text": "n₁ × i₁ = n₂ × i₂",
      "correct": false
     },
     {
      "text": "sin i₁ = sin i₂",
      "correct": false
     },
     {
      "text": "n₁ × sin i₂ = n₂ × sin i₁",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un rayon arrive sur un miroir avec un angle d'incidence de 40°. Que vaut l'angle de réflexion ?",
    "explanation": "Loi de la réflexion : l'angle de réflexion est égal à l'angle d'incidence.",
    "options": [
     {
      "text": "40°",
      "correct": true
     },
     {
      "text": "50°",
      "correct": false
     },
     {
      "text": "80°",
      "correct": false
     },
     {
      "text": "20°",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un rayon passe de l'air dans l'eau (n eau > n air) avec un angle d'incidence non nul. Le rayon réfracté…",
    "explanation": "n₂ > n₁ donc sin i₂ < sin i₁ : i₂ < i₁, le rayon se rapproche de la normale.",
    "options": [
     {
      "text": "Se rapproche de la normale",
      "correct": true
     },
     {
      "text": "S'écarte de la normale",
      "correct": false
     },
     {
      "text": "N'est pas dévié",
      "correct": false
     },
     {
      "text": "Est entièrement réfléchi",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un rayon qui arrive perpendiculairement à la surface de séparation (i₁ = 0°) n'est pas dévié.",
    "explanation": "sin i₁ = 0 donc sin i₂ = 0 : i₂ = 0°, le rayon continue tout droit.",
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
    "prompt": "Pourquoi un prisme décompose-t-il la lumière blanche ?",
    "explanation": "Chaque radiation est déviée différemment, car n dépend de λ : c'est la dispersion.",
    "options": [
     {
      "text": "L'indice du verre dépend de la longueur d'onde",
      "correct": true
     },
     {
      "text": "Le verre colore la lumière",
      "correct": false
     },
     {
      "text": "Le prisme réfléchit chaque couleur",
      "correct": false
     },
     {
      "text": "Le prisme absorbe le blanc",
      "correct": false
     }
    ]
   },
   {
    "prompt": "L'indice de réfraction d'un milieu s'exprime en mètre par seconde.",
    "explanation": "L'indice de réfraction est un nombre sans unité.",
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
   },
   {
    "prompt": "Un rayon passant par le centre optique O d'une lentille mince convergente…",
    "explanation": "C'est l'un des trois rayons particuliers : le rayon passant par O traverse la lentille sans être dévié.",
    "options": [
     {
      "text": "N'est pas dévié",
      "correct": true
     },
     {
      "text": "Ressort parallèle à l'axe optique",
      "correct": false
     },
     {
      "text": "Passe par F'",
      "correct": false
     },
     {
      "text": "Est réfléchi",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un rayon incident parallèle à l'axe optique ressort…",
    "explanation": "Tout rayon incident parallèle à l'axe optique émerge en passant par F'.",
    "options": [
     {
      "text": "En passant par le foyer image F'",
      "correct": true
     },
     {
      "text": "En passant par le foyer objet F",
      "correct": false
     },
     {
      "text": "Parallèle à l'axe optique",
      "correct": false
     },
     {
      "text": "Sans être dévié",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un rayon incident passant par le foyer objet F ressort…",
    "explanation": "Tout rayon passant par F émerge parallèlement à l'axe optique.",
    "options": [
     {
      "text": "Parallèle à l'axe optique",
      "correct": true
     },
     {
      "text": "En passant par F'",
      "correct": false
     },
     {
      "text": "En passant par O",
      "correct": false
     },
     {
      "text": "Sans être dévié",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une image renversée par rapport à l'objet correspond à un grandissement γ…",
    "explanation": "Le signe de γ indique le sens de l'image : γ < 0 pour une image renversée.",
    "options": [
     {
      "text": "Négatif",
      "correct": true
     },
     {
      "text": "Positif",
      "correct": false
     },
     {
      "text": "Égal à 1",
      "correct": false
     },
     {
      "text": "Nul",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Dans le modèle de l'œil réduit, quel élément joue le rôle de l'écran ?",
    "explanation": "Le cristallin est modélisé par une lentille, l'iris par un diaphragme et la rétine par l'écran.",
    "options": [
     {
      "text": "La rétine",
      "correct": true
     },
     {
      "text": "Le cristallin",
      "correct": false
     },
     {
      "text": "L'iris",
      "correct": false
     },
     {
      "text": "La pupille",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une lentille convergente est plus épaisse au centre que sur les bords.",
    "explanation": "C'est ce qui permet de la reconnaître au toucher.",
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
   },
   {
    "prompt": "Combien le noyau ¹⁴₆C contient-il de neutrons ?",
    "explanation": "N = A − Z = 14 − 6 = 8.",
    "options": [
     {
      "text": "8",
      "correct": true
     },
     {
      "text": "6",
      "correct": false
     },
     {
      "text": "14",
      "correct": false
     },
     {
      "text": "20",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Lors d'une transformation nucléaire, qu'est-ce qui est conservé ?",
    "explanation": "Les sommes des A et des Z sont les mêmes de chaque côté de l'équation ; les éléments, eux, changent.",
    "options": [
     {
      "text": "Le nombre de nucléons A et le nombre de charge Z",
      "correct": true
     },
     {
      "text": "Les éléments chimiques",
      "correct": false
     },
     {
      "text": "Les espèces chimiques",
      "correct": false
     },
     {
      "text": "Les noyaux",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Compléter : ²₁H + ³₁H → ⁴₂He + ?",
    "explanation": "A : 2 + 3 = 4 + 1 ; Z : 1 + 1 = 2 + 0. La particule manquante est un neutron ¹₀n.",
    "options": [
     {
      "text": "¹₀n",
      "correct": true
     },
     {
      "text": "¹₁H",
      "correct": false
     },
     {
      "text": "⁰₋₁e",
      "correct": false
     },
     {
      "text": "²₁H",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle particule est notée ⁰₋₁e ?",
    "explanation": "A = 0 et charge −1 : c'est un électron.",
    "options": [
     {
      "text": "Un électron",
      "correct": true
     },
     {
      "text": "Un proton",
      "correct": false
     },
     {
      "text": "Un neutron",
      "correct": false
     },
     {
      "text": "Un noyau d'hélium",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une transformation nucléaire libère, pour une même masse, beaucoup plus d'énergie qu'une transformation chimique.",
    "explanation": "C'est ce qui explique l'énergie produite par le Soleil ou par les centrales nucléaires.",
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
    "prompt": "La transformation H₂O(ℓ) → H₂O(g) est…",
    "explanation": "Seul l'état physique change : c'est une transformation physique.",
    "options": [
     {
      "text": "Physique",
      "correct": true
     },
     {
      "text": "Chimique",
      "correct": false
     },
     {
      "text": "Nucléaire",
      "correct": false
     },
     {
      "text": "Impossible",
      "correct": false
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
   },
   {
    "prompt": "Un conducteur ohmique de résistance R = 100 Ω est traversé par I = 0,050 A. Que vaut la tension à ses bornes ?",
    "explanation": "Loi d'Ohm : U = R × I = 100 × 0,050 = 5,0 V.",
    "options": [
     {
      "text": "5,0 V",
      "correct": true
     },
     {
      "text": "2000 V",
      "correct": false
     },
     {
      "text": "0,50 V",
      "correct": false
     },
     {
      "text": "100 V",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Un conducteur ohmique de résistance 60 Ω est soumis à une tension de 12 V. Quelle est l'intensité du courant ?",
    "explanation": "I = U / R = 12 / 60 = 0,20 A.",
    "options": [
     {
      "text": "0,20 A",
      "correct": true
     },
     {
      "text": "5,0 A",
      "correct": false
     },
     {
      "text": "720 A",
      "correct": false
     },
     {
      "text": "72 A",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Dans un circuit en série, le générateur délivre 9,0 V et la lampe a 5,5 V à ses bornes. Que vaut la tension aux bornes de la résistance ?",
    "explanation": "Loi des mailles : U G = U L + U R, donc U R = 9,0 − 5,5 = 3,5 V.",
    "options": [
     {
      "text": "3,5 V",
      "correct": true
     },
     {
      "text": "14,5 V",
      "correct": false
     },
     {
      "text": "9,0 V",
      "correct": false
     },
     {
      "text": "5,5 V",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Deux dipôles branchés en dérivation ont la même tension à leurs bornes.",
    "explanation": "C'est la loi d'unicité des tensions dans les branches en dérivation.",
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
    "prompt": "Comment branche-t-on un ampèremètre ?",
    "explanation": "L'ampèremètre mesure le courant qui le traverse : il se place en série.",
    "options": [
     {
      "text": "En série",
      "correct": true
     },
     {
      "text": "En dérivation",
      "correct": false
     },
     {
      "text": "Aux bornes du générateur seulement",
      "correct": false
     },
     {
      "text": "Il n'a pas besoin d'être branché",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Quelle est l'allure de la caractéristique U = f(I) d'un conducteur ohmique ?",
    "explanation": "U = R × I : la tension est proportionnelle à l'intensité.",
    "options": [
     {
      "text": "Une droite passant par l'origine",
      "correct": true
     },
     {
      "text": "Une courbe croissante",
      "correct": false
     },
     {
      "text": "Une droite horizontale",
      "correct": false
     },
     {
      "text": "Une droite qui ne passe pas par l'origine",
      "correct": false
     }
    ]
   },
   {
    "prompt": "Une thermistance permet de réaliser un capteur de…",
    "explanation": "La résistance d'une thermistance varie avec la température.",
    "options": [
     {
      "text": "Température",
      "correct": true
     },
     {
      "text": "Lumière",
      "correct": false
     },
     {
      "text": "Pression",
      "correct": false
     },
     {
      "text": "Son",
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
