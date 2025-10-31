---
title: "Comment choisir entre la tarification selon l’heure d’utilisation et le tarif standard grâce à une matrice pondérée de décalage d’usage"
excerpt: "Utilisez une matrice pondérée de décalage d’usage pour décider entre la tarification selon l’heure d’utilisation et le tarif standard. Clarifiez vos valeurs, cartographiez les fenêtres de pointe de votre fournisseur, estimez les charges déplaçables et testez la robustesse du choix avant de vous engager."
keywords: "heures d’utilisation, TOU, tarifs standard, tarification dynamique, heures de pointe, heures creuses, matrice de décalage d’usage, recharge de VE, chauffe‑eau thermodynamique, frais fixes, tarifs des services publics, matrice de décision, budgétisation de l’énergie"
---
Choisir entre un tarif selon l’heure d’utilisation (TOU) et un tarif standard (plat) n’est pas une quête de perfection—c’est une question d’adéquation. Le TOU peut vous récompenser si vous déplacez des usages flexibles en dehors des pointes du soir (souvent entre 16 h et 21 h), tandis qu’un tarif plat garde la tarification simple. Le meilleur choix dépend de la capacité et de la volonté de votre foyer à décaler sa consommation, de l’écart local de prix entre heures pleines et heures creuses, et de tout frais mensuel fixe ou règle spécifique au tarif.

En tant que planificateur de scénarios, je vous guiderai à travers une matrice simple et pondérée de décalage d’usage. Nous traduirons vos valeurs et habitudes en chiffres comparables, à éprouver et à transformer en action en toute confiance.

Échauffement des valeurs (choisissez ce qui compte le plus)
- Quand ai‑je le plus besoin de flexibilité—en début de soirée, tard la nuit, ou en milieu de journée ?
- Qu’est‑ce que j’accepte de passer sur minuteurs ou en automatisation (recharge de VE, chauffage de l’eau, lessive) ?
- Qu’est‑ce qui compte le plus cette année : des factures prévisibles ou tenter de réduire les coûts par l’expérimentation ?

Ce que TOU vs. standard signifie vraiment
- Les tarifs TOU facturent l’électricité plus cher pendant les heures de pointe et moins cher hors pointe ; ils ajoutent parfois une période super hors pointe encore moins chère. En Californie, le régulateur décrit le TOU comme le plus bénéfique pour les clients capables de décaler leurs usages, comme les propriétaires de VE, et met l’accent sur les pointes de l’après‑midi/soir avec des différences saisonnières [CPUC Electric Rates explainer](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates).
- De nombreux services publics publient des fenêtres de pointe claires. Exemples : la pointe quotidienne 16 h–21 h de SDG&E avec des périodes hors/super hors pointe distinctes et un contexte de frais de service de base [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters) ; les pointes fréquentes 16 h–21 h ou 17 h–20 h de PG&E et des options associant un prix au kWh plus bas à un frais mensuel de base pour les foyers électrifiés [PG&E TOU plans](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page) ; les heures de pointe publiées par APS et une super hors pointe hivernale, y compris une option « TOU avec demande » [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
- Des changements régionaux surviennent. Par exemple, Xcel Energy met en avant des pointes comme 15 h–19 h et fait passer le Colorado à 17 h–21 h toute l’année ; des pilotes montrent que la plupart des factures ont légèrement baissé ou sont restées stables avec des changements de comportement basiques [Xcel newsroom](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E).
- De nouvelles décisions sur les frais fixes peuvent changer le calcul. Le frais mensuel fixe approuvé en Californie abaisse les tarifs au kWh mais ajoute un coût déterminé ; les foyers électrifiés ou à consommation plus élevée peuvent tout de même en bénéficier globalement [AP News on fixed charge](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1).
- Les services publics testent de plus en plus des ajouts horaires dynamiques ou de pointe critique ; les orientations de la CPUC pointent vers des tarifs horaires dynamiques optionnels alignés sur l’état du réseau, qui peuvent se superposer au TOU dans les prochaines années [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Comment construire votre matrice pondérée de décalage d’usage
1) Rassembler vos intervalles et tarifs
- Récupérez les 12 derniers mois de consommation horaire depuis le portail de votre fournisseur. À défaut, utilisez les profils d’usage final de la NREL pour approximer les schémas par région et par appareil [NREL EULP](https://www.nrel.gov/buildings/end-use-load-profiles.html).
- Dressez la liste des usages majeurs : recharge de VE, chauffe‑eau thermodynamique (HPWH), lessive, lave‑vaisselle, pompe de piscine, CVC, éclairage et charge permanente. Les données de l’EIA confirment que le CVC et le chauffage de l’eau sont de grands moteurs dans de nombreux foyers—pesez‑les en conséquence [EIA RECS](https://www.eia.gov/emeu/recs/).
- Cartographiez les périodes TOU de votre fournisseur et l’écart en c€/kWh entre heures pleines et creuses (et super hors pointe, si proposée). Utilisez les pages de votre fournisseur (SDG&E, PG&E, APS, Seattle City Light) ou la base OpenEI Utility Rate Database pour trouver votre tarif et vos fenêtres exacts [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters) [PG&E TOU plans](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page) [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans) [Seattle City Light TOU](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use) [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8).

2) Noter la déplaçabilité et estimer les kWh/mois réellement décalés
- Attribuez à chaque usage une note de déplaçabilité (0–5). Schémas typiques : VE, HPWH, lessive, lave‑vaisselle et pompes de piscine sont élevés ; le CVC est modéré avec le pré‑refroidissement/la masse thermique ; l’éclairage/la charge permanente sont faibles. Ceci est conforme aux orientations des services publics et du DOE pour déplacer les charges flexibles hors pointe et activer la recharge intelligente des VE [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
- Appliquez un « facteur de conformité » (souvent 50–80 %) pour refléter la réalité ; l’automatisation (bornes VE, thermostats, minuteurs) peut l’augmenter. Cette approche reflète des conseils de planification pratique et l’usage des outils des services publics ; l’outil de comparaison de SCE peut valider les économies modélisées issues de votre matrice [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool).

3) Calculer les économies mensuelles potentielles
- Économies = kWh décalés × (écart heures pleines moins heures creuses) − tout frais fixe ou de base ajouté au plan TOU.
- Incluez une pondération saisonnière si votre fournisseur varie les périodes selon la saison (p. ex., APS, SRP) [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans) [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use).
- Si vous évaluez un « TOU avec demande », ajoutez un coût de risque pour l’empilement simultané d’appareils pendant la fenêtre de demande ; si vous voulez la simplicité, envisagez d’abord un TOU standard [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
- Lorsque disponible, une protection de facture ou des périodes d’essai réduisent le risque. SRP note un crédit de protection de facture de 90 jours si le TOU coûte plus cher et rapporte une économie annuelle moyenne d’environ 4,8 % chez les clients TOU—un repère conservateur plutôt qu’une garantie [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use).

Matrice de décision pondérée vierge (à remplir)
- Les pondérations (1–5) reflètent l’importance ; les scores (1–5) reflètent l’adéquation de chaque option. Gardez des scores neutres et honnêtes ; l’objectif est la clarté, pas la perfection.

| Critère (exemple)            | Poids (1–5) | Score TOU (1–5) | Pondéré TOU | Score standard (1–5) | Pondéré standard |
|------------------------------|-------------|------------------|-------------|----------------------|------------------|
| Potentiel d’économies        | 5           |                  |             |                      |                  |
| Flexibilité de mode de vie   | 4           |                  |             |                      |                  |
| Préparation à l’automatisation | 4         |                  |             |                      |                  |
| Tolérance au risque/complexité | 3         |                  |             |                      |                  |
| Adéquation aux valeurs (prévisibilité) | 3 |               |             |                      |                  |
| Impact de la variabilité saisonnière | 2  |                  |             |                      |                  |
| Total                        | —           |                  |             |                      |                  |

- Conseils rapides pour les entrées :
  - Potentiel d’économies : basé sur vos kWh décalés × écart, moins les frais fixes [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters) [AP News fixed charge](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1).
  - Flexibilité de mode de vie : votre aisance à décaler les activités de 16 h à 21 h (pointes typiques du soir) [CPUC Electric Rates](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates).
  - Préparation à l’automatisation : la recharge intelligente des VE, les minuteurs de HPWH, les thermostats programmables augmentent la conformité et la fiabilité des économies [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
  - Tolérance au risque/complexité : considérez les variantes avec tarif de demande et la courbe d’apprentissage [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
  - Impact de la variabilité saisonnière : si votre fournisseur a des heures été/hiver différentes ou des périodes super hors pointe (p. ex., super hors pointe en milieu de journée chez SRP) [SRP manage demand](https://www.srpnet.com/price-plans/residential-electric/manage-demand-5-10-pm-and-save).

Rendre les arbitrages explicites
- Ce que nous acceptons d’abandonner : Pour le TOU, par exemple faire tourner le sèche‑linge après 21 h et planifier la recharge du VE la nuit ; pour le standard, renoncer à certaines économies potentielles pour garder des soirées totalement flexibles.
- Où pointent les preuves : Des méta‑analyses et simulations du LBNL suggèrent que les changements de conception tarifaire modifient souvent modérément les factures par rapport aux gains d’efficacité et d’électrification—associez donc tout choix TOU à des réductions de charge et à des commandes intelligentes [LBNL meta‑analysis](https://emp.lbl.gov/publications/different-prices-difference-slices) [LBNL bill impacts study](https://emp.lbl.gov/news/new-berkeley-lab-study-quantifies-residential-customer-bill-impacts-energy-efficiency).
- Exploiter les schémas passés : Si vous suivez vos services publics ou catégories associées, repérez les pics du soir ou les hausses saisonnières ; ces schémas alimentent votre entrée « kWh déplaçables ». Des applications axées sur un budget simple et sans publicité comme Monee peuvent vous aider à remarquer des schémas récurrents sans complexité.

Éprouver la décision
- Échangez deux pondérations. Exemple : permutez « Flexibilité de mode de vie » (4) avec « Potentiel d’économies » (5). Recalculez les totaux pondérés. Si le gagnant change, votre choix est sensible—envisagez plus d’automatisation ou une période d’essai si disponible.
- Modélisez les changements annoncés. Si votre fournisseur décale les fenêtres de pointe (p. ex., Xcel passant à 17 h–21 h), relancez la matrice avec les périodes actuelle et future [Xcel newsroom](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E).
- Validez avec des outils. Utilisez l’outil de comparaison/calcul de votre fournisseur pour confronter votre résultat aux données d’intervalle réelles (p. ex., l’outil de SCE ; le calculateur/les insights de Seattle City Light quand disponibles) [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool) [Seattle City Light TOU](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use).

Règles de décision fiables
- Si les économies mensuelles nettes sont positives avec une marge confortable et que les scores de style de vie/automatisation sont élevés, choisissez le TOU.
- Si la matrice penche vers la simplicité, ou si les économies sont marginales après les frais fixes, restez au standard—ou testez le TOU uniquement avec une protection de facture si votre fournisseur en offre une (p. ex., protection 90 jours chez SRP) [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use).
- À propos des ajouts : la tarification de pointe critique ou les pilotes horaires dynamiques peuvent récompenser une flexibilité supplémentaire quelques jours ; surveillez les nouvelles offres selon les orientations de la CPUC [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Langage d’engagement
- « Je choisis ______ parce que ma matrice montre la meilleure adéquation avec mes priorités cette année. J’accepte les arbitrages que j’ai nommés, et je réexaminerai si ma consommation ou la structure tarifaire change. »

Plan de réduction de risque (démarrage sur 30 jours)
- Semaine 1 : Rassemblez 12 mois de données horaires ; confirmez vos fenêtres TOU et les écarts pointe/hors pointe ; retrouvez votre tarif exact via la page de votre fournisseur ou l’OpenEI URDB [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8).
- Semaine 2 : Réglez les minuteurs du VE et du HPWH ; programmez lave‑vaisselle et lessive en dehors de 16 h–21 h ; activez des consignes de thermostat/départs anticipés raisonnables [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
- Semaine 3 : Recalculez les kWh décalés avec un facteur de conformité réaliste ; relancez la matrice. Utilisez un outil de comparaison de fournisseur (p. ex., SCE) pour valider les résultats modélisés [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool).
- Semaine 4 : Optez pour le changement si la matrice pointe toujours vers le TOU ; sinon, restez au standard et envisagez des ajouts CPP sélectifs ou réévaluez à l’arrivée de nouvelles options dynamiques [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Si un détail particulier (comme votre c€/kWh exact ou l’existence d’un programme de protection de facture) n’apparaît pas sur le site de votre fournisseur ou dans les liens ici, notez l’écart et poursuivez la matrice avec les meilleurs tarifs et fenêtres publiés disponibles, puis validez avec l’outil de comparaison de votre fournisseur.

## Sources:
- [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates)
- [CPUC Electric Rates explainer](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates)
- [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters)
- [PG&E TOU plans](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page)
- [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool)
- [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use)
- [SRP manage demand](https://www.srpnet.com/price-plans/residential-electric/manage-demand-5-10-pm-and-save)
- [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans)
- [Xcel newsroom](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E)
- [Seattle City Light TOU](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use)
- [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8)
- [LBNL meta‑analysis](https://emp.lbl.gov/publications/different-prices-difference-slices)
- [LBNL bill impacts study](https://emp.lbl.gov/news/new-berkeley-lab-study-quantifies-residential-customer-bill-impacts-energy-efficiency)
- [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs)
- [NREL EULP](https://www.nrel.gov/buildings/end-use-load-profiles.html)
- [EIA RECS](https://www.eia.gov/emeu/recs/)
- [AP News fixed charge](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1)
