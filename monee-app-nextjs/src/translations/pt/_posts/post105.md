---
title: "Como escolher tarifa por horário de uso (TOU) vs. tarifa padrão com uma matriz ponderada de deslocamento de uso"
excerpt: "Use uma matriz ponderada de deslocamento de uso para decidir entre tarifas por horário de uso e tarifas padrão de eletricidade. Esclareça valores, mapeie as janelas de pico da sua concessionária, estime cargas deslocáveis e faça um teste de estresse antes de decidir."
keywords: "horário de uso, TOU, tarifas padrão, precificação dinâmica, horas de pico, fora de pico, matriz de deslocamento de uso, carregamento de VE, aquecedor de água com bomba de calor, tarifa fixa, tarifas de concessionária, matriz de decisão, orçamento de energia"
---
Decidir entre tarifa por horário de uso (TOU) e uma tarifa padrão (plana) não é encontrar a resposta perfeita—é encontrar o melhor ajuste. A TOU pode recompensar você por operar cargas flexíveis fora dos picos da noite (geralmente entre 16h e 21h), enquanto a tarifa plana mantém a cobrança simples. Sua melhor escolha depende da capacidade e disposição da sua casa para deslocar o uso, da diferença local de preços entre pico e fora de pico e de quaisquer cobranças mensais fixas ou regras específicas da tarifa.

Como seu planejador de cenários, vou guiá-lo por uma matriz simples e ponderada de deslocamento de uso. Vamos traduzir seus valores e hábitos em números que você pode comparar, testar sob estresse e aplicar com confiança.

Aquecimento de valores (escolha o que mais importa)
- Quando mais preciso de flexibilidade—início da noite, madrugada ou meio-dia?
- O que estou disposto a colocar em temporizadores ou automatizar (carregamento de VE, aquecimento de água, lavanderia)?
- O que importa mais este ano: contas previsíveis ou tentar reduzir custos experimentando?

O que TOU vs. padrão realmente significa
- As tarifas TOU precificam a eletricidade mais alto durante as horas de pico e mais baixo fora de pico; às vezes adicionam um período de super fora de pico ainda mais barato. Na Califórnia, reguladores descrevem a TOU como mais benéfica para clientes que podem deslocar uso, como proprietários de VE, e enfatizam picos à tarde/noite com diferenças sazonais [CPUC Electric Rates explainer](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates).
- Muitas concessionárias publicam janelas de pico claras. Exemplos incluem: pico diário das 16h às 21h da SDG&E, com períodos distintos de fora/super fora de pico e contexto de cobrança de serviço base [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters); picos comuns das 16h às 21h ou 17h às 20h da PG&E e opções que combinam menor custo por kWh com uma cobrança mensal base para casas eletrificadas [PG&E TOU plans](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page); horas de pico publicadas da APS e super fora de pico no inverno, incluindo uma opção de “TOU com demanda” [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
- Mudanças regionais acontecem. Por exemplo, a Xcel Energy destaca picos como 15h–19h e move o Colorado para 17h–21h o ano todo; resultados de pilotos mostram que a maioria das contas dos clientes diminuiu ligeiramente ou permaneceu a mesma com mudanças básicas de comportamento [Xcel newsroom](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E).
- Novas decisões sobre cobranças fixas podem mudar a conta. A cobrança mensal fixa aprovada na Califórnia reduz as tarifas por kWh, mas adiciona um custo fixo; casas eletrificadas ou com maior consumo ainda podem se beneficiar no geral [AP News on fixed charge](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1).
- As concessionárias testam cada vez mais complementos dinâmicos por hora ou picos críticos; a orientação da CPUC aponta para tarifas dinâmicas opcionais alinhadas às condições da rede, que podem se sobrepor à TOU nos próximos anos [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Como construir sua matriz ponderada de deslocamento de uso
1) Colete seus intervalos e tarifas
- Baixe os últimos 12 meses de uso horário no portal da sua concessionária. Se indisponível, use os perfis de uso final do NREL para aproximar padrões por região e aparelho [NREL EULP](https://www.nrel.gov/buildings/end-use-load-profiles.html).
- Liste os principais usos finais: carregamento de VE, aquecedor de água com bomba de calor (HPWH), lavanderia, lava-louças, bomba da piscina, HVAC, iluminação e cargas sempre ativas. Dados da EIA confirmam que HVAC e aquecimento de água são grandes direcionadores em muitas casas—dê a eles peso apropriado [EIA RECS](https://www.eia.gov/emeu/recs/).
- Mapeie os períodos de TOU da sua concessionária e a diferença em centavos/kWh entre pico e fora de pico (e super fora de pico, se houver). Use as páginas da sua concessionária (SDG&E, PG&E, APS, Seattle City Light) ou o OpenEI Utility Rate Database para localizar sua tarifa e janelas exatas [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters) [PG&E TOU plans](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page) [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans) [Seattle City Light TOU](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use) [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8).

2) Pontue a deslocabilidade e estime kWh/mês realisticamente deslocados
- Atribua a cada uso final uma pontuação de deslocabilidade (0–5). Padrões típicos: VE, HPWH, lavanderia, lava-louças e bombas de piscina são altos; HVAC é moderado com pré-resfriamento/massa térmica; iluminação/sempre ativo são baixos. Isso é consistente com a orientação de concessionárias e do DOE para mover cargas flexíveis para fora de pico e habilitar carregamento inteligente de VE [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
- Aplique um “fator de conformidade” (geralmente 50–80%) para considerar a execução na vida real; automação (carregadores de VE, termostatos, temporizadores) pode elevar a conformidade. Essa abordagem espelha orientações práticas de planejamento e o uso de ferramentas das concessionárias; a ferramenta de comparação da SCE pode validar as economias modeladas a partir da sua matriz [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool).

3) Calcule a possível economia mensal
- Economia = kWh deslocados × (diferença entre pico e fora de pico) − quaisquer cobranças fixas ou base adicionais no plano TOU.
- Inclua ponderação sazonal se sua concessionária variar períodos por estação (por exemplo, APS, SRP) [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans) [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use).
- Se você estiver avaliando “TOU com demanda”, adicione um custo de risco por sobreposição coincidente de aparelhos durante a janela de demanda; se quer simplicidade, considere primeiro a TOU padrão [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
- Onde disponível, proteções de conta ou períodos de teste podem reduzir o risco. A SRP observa um crédito de proteção de conta de 90 dias se a TOU custar mais e relata economia média de ~4,8% ao ano entre clientes TOU—um parâmetro conservador, não uma garantia [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use).

Matriz de decisão ponderada em branco (preencha)
- Pesos (1–5) refletem importância; Pontuações (1–5) refletem o ajuste de cada opção. Mantenha as pontuações neutras e honestas; o objetivo é clareza, não perfeição.

| Critério (exemplo)           | Peso (1–5) | Pontuação TOU (1–5) | TOU Ponderado | Pontuação Padrão (1–5) | Padrão Ponderado |
|------------------------------|------------|----------------------|---------------|------------------------|------------------|
| Potencial de economia        | 5          |                      |               |                        |                  |
| Flexibilidade de estilo de vida | 4       |                      |               |                        |                  |
| Prontidão para automação     | 4          |                      |               |                        |                  |
| Tolerância a risco/complexidade | 3       |                      |               |                        |                  |
| Aderência a valores (previsibilidade) | 3 |                  |               |                        |                  |
| Impacto da variabilidade sazonal | 2      |                      |               |                        |                  |
| Total                        | —          |                      |               |                        |                  |

- Orientação rápida para os campos:
  - Potencial de economia: Com base em seus kWh deslocados × diferença menos cobranças fixas [SDG&E TOU pricing](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters) [AP News fixed charge](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1).
  - Flexibilidade de estilo de vida: O quanto você está ok em deslocar atividades entre 16h e 21h (picos noturnos típicos) [CPUC Electric Rates](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates).
  - Prontidão para automação: Carregamento inteligente de VE, temporizadores em HPWH, termostatos programáveis aumentam a conformidade e a confiabilidade das economias [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
  - Tolerância a risco/complexidade: Considere variantes com tarifa de demanda e curva de aprendizado [APS plan compare](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
  - Impacto da variabilidade sazonal: Se sua concessionária tem horas diferentes no verão/inverno ou períodos de super fora de pico (por exemplo, SRP com super fora de pico ao meio-dia) [SRP manage demand](https://www.srpnet.com/price-plans/residential-electric/manage-demand-5-10-pm-and-save).

Torne os trade-offs explícitos
- O que estamos dispostos a abrir mão: Para TOU, talvez usar a secadora após as 21h e programar o carregamento do VE durante a madrugada; para a tarifa padrão, abrir mão de alguma economia potencial para manter as noites totalmente flexíveis.
- Onde as evidências apontam: Meta-análises e simulações do LBNL sugerem que mudanças de desenho tarifário frequentemente alteram contas de forma modesta em comparação com ganhos de eficiência e eletrificação—portanto, combine qualquer escolha de TOU com reduções de carga e controles inteligentes [LBNL meta‑analysis](https://emp.lbl.gov/publications/different-prices-difference-slices) [LBNL bill impacts study](https://emp.lbl.gov/news/new-berkeley-lab-study-quantifies-residential-customer-bill-impacts-energy-efficiency).
- Resgate padrões passados: Se você acompanha utilidades ou categorias relacionadas, procure picos noturnos ou aumentos sazonais; esses padrões informam sua entrada de “kWh deslocáveis”. Apps focados em orçamento simples e sem anúncios, como o Monee, podem ajudar você a perceber padrões recorrentes de utilidades sem complexidade.

Teste de estresse da decisão
- Troque dois pesos. Exemplo: Mude “Flexibilidade de estilo de vida” (4) com “Potencial de economia” (5). Recalcule os totais ponderados. Se seu vencedor inverter, sua escolha é sensível—considere mais automação ou um período de teste, se disponível.
- Modele mudanças anunciadas. Se sua concessionária estiver alterando janelas de pico (por exemplo, Xcel movendo para 17h–21h), rode a matriz sob os períodos atual e futuro [Xcel newsroom](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E).
- Valide com ferramentas. Use a ferramenta de comparação/calculadora da sua concessionária para verificar seu resultado com dados reais de intervalo (por exemplo, a ferramenta da SCE; a calculadora/insights da Seattle City Light, onde disponível) [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool) [Seattle City Light TOU](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use).

Regras de decisão confiáveis
- Se as economias mensais líquidas forem positivas com folga e as pontuações de estilo de vida/automação forem altas, escolha TOU.
- Se a matriz pender para a simplicidade, ou se as economias forem marginais após as cobranças fixas, mantenha-se na tarifa padrão—ou teste a TOU apenas com uma janela de proteção de conta se sua concessionária oferecer (por exemplo, proteção de 90 dias da SRP) [SRP TOU](https://www.srpnet.com/price-plans/residential-electric/time-of-use).
- Considerando complementos: Precificação de pico crítico ou pilotos dinâmicos por hora podem recompensar flexibilidade extra em alguns dias; fique de olho em novas ofertas conforme a orientação da CPUC [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Linguagem de compromisso
- “Estou escolhendo ______ porque minha matriz mostra o melhor ajuste para minhas prioridades deste ano. Eu aceito os trade-offs que nomeei e vou revisitar se meu uso ou a estrutura tarifária mudarem.”

Plano de mitigação (início em 30 dias)
- Semana 1: Reúna 12 meses de dados horários; confirme suas janelas de TOU e diferenças entre pico/fora de pico; obtenha sua tarifa exata via página da concessionária ou OpenEI URDB [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8).
- Semana 2: Configure temporizadores de VE e HPWH; agende lava-louças e lavanderia fora de 16h–21h; ative recuos de termostato/pré-resfriamento quando razoável [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
- Semana 3: Recalcule kWh deslocados com um fator de conformidade realista; rode a matriz novamente. Use uma ferramenta de comparação da concessionária (por exemplo, SCE) para validar os resultados modelados [SCE rate comparison](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool).
- Semana 4: Faça a mudança se a matriz ainda apontar para TOU; caso contrário, mantenha a tarifa padrão e considere complementos seletivos de CPP ou revisite quando novas opções dinâmicas chegarem [CPUC dynamic hourly guidance](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Se um detalhe específico (como seus centavos/kWh exatos ou se existe um programa de proteção de conta) não estiver no site da sua concessionária ou nos links aqui, anote a lacuna e prossiga com a matriz usando as melhores tarifas e janelas publicadas disponíveis, depois valide com a ferramenta de comparação da sua concessionária.

## Fontes:
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
