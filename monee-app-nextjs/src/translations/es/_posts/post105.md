---
title: "Cómo elegir precios de electricidad por tiempo de uso vs. estándar con una matriz ponderada de desplazamiento de uso"
excerpt: "Usa una matriz ponderada de desplazamiento de uso para decidir entre precios por tiempo de uso y tarifa estándar. Aclara valores, mapea las ventanas pico de tu empresa eléctrica, estima cargas desplazables y somete la elección a una prueba de estrés antes de comprometerte."
keywords: "tiempo de uso, TOU, tarifas estándar, precios dinámicos, horas pico, fuera de pico, matriz de desplazamiento de uso, carga de EV, calentador de agua con bomba de calor, cargo fijo, tarifas de la empresa eléctrica, matriz de decisión, presupuestación energética"
---
Decidir entre una tarifa por tiempo de uso (TOU) y una tarifa estándar (plana) no se trata de encontrar una respuesta perfecta, sino de encontrar el ajuste adecuado. La TOU puede recompensarte por ejecutar cargas flexibles fuera de los picos vespertinos (a menudo alrededor de 4–9 p. m.), mientras que una tarifa plana mantiene el precio simple. Tu mejor elección depende de la capacidad y disposición de tu hogar para desplazar consumo, la diferencia local de precio entre horas pico y fuera de pico, y cualquier cargo mensual fijo o reglas específicas del plan.

Como tu planificador de escenarios, te guiaré mediante una sencilla matriz ponderada de desplazamiento de uso. Traduciremos tus valores y hábitos en números que puedas comparar, someter a pruebas de estrés y convertir en acción con confianza.

Calentamiento de valores (elige lo que más importa)
- ¿Cuándo necesito más flexibilidad: tarde, noche o mediodía?
- ¿Qué estoy dispuesto a pasar a temporizadores o automatización (carga de EV, calentamiento de agua, lavandería)?
- ¿Qué importa más este año: facturas predecibles o intentar reducir costos experimentando?

Lo que realmente significa TOU vs. estándar
- Las tarifas TOU fijan precios más altos durante horas pico y más bajos fuera de pico; a veces agregan un período súper fuera de pico aún más barato. En California, los reguladores describen la TOU como más beneficiosa para clientes que pueden desplazar consumo, como propietarios de EV, y enfatizan picos por la tarde/noche con diferencias estacionales [Explicador de tarifas eléctricas de la CPUC](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates).
- Muchas empresas publican ventanas pico claras. Ejemplos: pico diario de 4–9 p. m. de SDG&E con períodos distintos fuera/súper fuera de pico y un contexto de cargo por servicio base [Precios TOU de SDG&E](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters); picos comunes de 4–9 p. m. o 5–8 p. m. de PG&E y opciones que combinan menor costo por kWh con un cargo base mensual para hogares electrificados [Planes TOU de PG&E](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page); horas pico publicadas de APS y súper fuera de pico en invierno, incluyendo una opción “TOU con demanda” [Comparador de planes de APS](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
- Ocurren cambios regionales. Por ejemplo, Xcel Energy destaca picos como 3–7 p. m. y mueve Colorado a 5–9 p. m. todo el año; los resultados piloto muestran que las facturas de la mayoría de los clientes disminuyeron ligeramente o se mantuvieron iguales con cambios básicos de comportamiento [Sala de prensa de Xcel](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E).
- Nuevas decisiones sobre cargos fijos pueden cambiar la ecuación. El cargo mensual fijo aprobado en California reduce el precio por kWh pero añade un costo establecido; los hogares electrificados o de mayor consumo aún pueden beneficiarse en general [AP News sobre cargo fijo](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1).
- Las empresas prueban cada vez más complementos dinámicos por hora o picos críticos; la guía de la CPUC apunta a tarifas dinámicas opcionales que se alinean con condiciones de la red y pueden superponerse a la TOU en los próximos años [Guía sobre tarifas horarias dinámicas de la CPUC](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Cómo construir tu matriz ponderada de desplazamiento de uso
1) Reúne tus intervalos y tarifas
- Extrae los últimos 12 meses de consumo horario desde el portal de tu empresa eléctrica. Si no está disponible, usa los perfiles de uso final de NREL para aproximar patrones por región y electrodoméstico [NREL EULP](https://www.nrel.gov/buildings/end-use-load-profiles.html).
- Lista los usos principales: carga de EV, calentador de agua con bomba de calor (HPWH), lavandería, lavavajillas, bomba de piscina, HVAC, iluminación y “siempre encendido”. Los datos de la EIA confirman que HVAC y calentamiento de agua son grandes impulsores en muchos hogares—pésalos adecuadamente [EIA RECS](https://www.eia.gov/emeu/recs/).
- Mapea los períodos TOU de tu empresa y la diferencia en centavos/kWh entre pico y fuera de pico (y súper fuera de pico, si existe). Usa las páginas de tu empresa (SDG&E, PG&E, APS, Seattle City Light) o la base de datos OpenEI Utility Rate Database para localizar tu tarifa exacta y ventanas [Precios TOU de SDG&E](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters) [Planes TOU de PG&E](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page) [Comparador de planes de APS](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans) [TOU de Seattle City Light](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use) [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8).

2) Puntúa la desplazabilidad y estima kWh/mes desplazados realistas
- Asigna a cada uso final una puntuación de desplazabilidad (0–5). Patrones típicos: EV, HPWH, lavandería, lavavajillas y bombas de piscina son altos; HVAC es moderado con preenfriamiento/masa térmica; iluminación/siempre encendido son bajos. Esto coincide con la guía de empresas y del DOE para mover cargas flexibles fuera de pico y habilitar carga inteligente de EV [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
- Aplica un “factor de cumplimiento” (a menudo 50–80%) para tener en cuenta el seguimiento en la vida real; la automatización (cargadores de EV, termostatos, temporizadores) puede elevar el cumplimiento. Este enfoque refleja guías prácticas de planificación y el uso de herramientas de las empresas; la herramienta de comparación de SCE puede validar ahorros modelados desde tu matriz [Comparación de tarifas de SCE](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool).

3) Calcula el ahorro mensual potencial
- Ahorro = kWh desplazados × (diferencia entre pico y fuera de pico) − cualquier cargo fijo o base adicional en el plan TOU.
- Incluye ponderación estacional si tu empresa varía períodos por temporada (p. ej., APS, SRP) [Comparador de planes de APS](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans) [TOU de SRP](https://www.srpnet.com/price-plans/residential-electric/time-of-use).
- Si evalúas “TOU con demanda”, añade un costo de riesgo por superposición coincidente de electrodomésticos durante la ventana de demanda; si quieres simplicidad, considera primero la TOU estándar [Comparador de planes de APS](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
- Donde esté disponible, la protección de facturación o períodos de prueba pueden reducir el riesgo. SRP menciona un crédito de protección de facturación de 90 días si la TOU cuesta más y reporta un ahorro anual promedio de ~4.8% entre clientes TOU—un referente conservador más que una garantía [TOU de SRP](https://www.srpnet.com/price-plans/residential-electric/time-of-use).

Matriz de decisión ponderada en blanco (rellénala)
- Los pesos (1–5) reflejan importancia; las puntuaciones (1–5) reflejan el ajuste de cada opción. Mantén las puntuaciones neutrales y honestas; el objetivo es claridad, no perfección.

| Criterio (ejemplo)           | Peso (1–5) | Puntuación TOU (1–5) | Ponderado TOU | Puntuación estándar (1–5) | Ponderado estándar |
|------------------------------|------------|-----------------------|---------------|---------------------------|--------------------|
| Potencial de ahorro          | 5          |                       |               |                           |                    |
| Flexibilidad de estilo de vida| 4         |                       |               |                           |                    |
| Preparación para automatizar | 4          |                       |               |                           |                    |
| Tolerancia a riesgo/complejidad| 3        |                       |               |                           |                    |
| Ajuste a valores (predictibilidad)| 3     |                       |               |                           |                    |
| Impacto de variabilidad estacional| 2     |                       |               |                           |                    |
| Total                        | —          |                       |               |                           |                    |

- Guía rápida para completar:
  - Potencial de ahorro: Basado en tus kWh desplazados × diferencia menos cargos fijos [Precios TOU de SDG&E](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters) [AP News cargo fijo](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1).
  - Flexibilidad de estilo de vida: Qué tan conforme estás con desplazar actividades de 4–9 p. m. (picos vespertinos típicos) [Tarifas eléctricas de la CPUC](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates).
  - Preparación para automatizar: La carga inteligente de EV, temporizadores de HPWH y termostatos programables aumentan el cumplimiento y la confiabilidad de los ahorros [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
  - Tolerancia a riesgo/complejidad: Considera variantes con cargos por demanda y la curva de aprendizaje [Comparador de planes de APS](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans).
  - Impacto de variabilidad estacional: Si tu empresa tiene distintas horas verano/invierno o períodos súper fuera de pico (p. ej., súper fuera de pico al mediodía de SRP) [SRP gestionar demanda](https://www.srpnet.com/price-plans/residential-electric/manage-demand-5-10-pm-and-save).

Haz explícitas las compensaciones
- Qué estamos dispuestos a ceder: Para TOU, quizá usar la secadora después de las 9 p. m. y programar la carga del EV durante la noche; para estándar, ceder algo de ahorro potencial para mantener las tardes totalmente flexibles.
- Dónde apunta la evidencia: Meta‑análisis y simulaciones del LBNL sugieren que los cambios en diseño tarifario a menudo desplazan las facturas modestamente en comparación con las mejoras por eficiencia y electrificación—por ello, acompaña cualquier elección TOU con reducciones de carga y controles inteligentes [Meta‑análisis del LBNL](https://emp.lbl.gov/publications/different-prices-difference-slices) [Estudio de impactos en factura del LBNL](https://emp.lbl.gov/news/new-berkeley-lab-study-quantifies-residential-customer-bill-impacts-energy-efficiency).
- Recupera patrones pasados: Si registras servicios o rubros relacionados, busca picos vespertinos o aumentos estacionales; esos patrones informan tu entrada de “kWh desplazables”. Apps enfocadas en un presupuesto simple y sin anuncios como Monee pueden ayudarte a notar patrones recurrentes de servicios sin complejidad.

Somete la decisión a prueba de estrés
- Intercambia dos pesos. Ejemplo: Cambia “Flexibilidad de estilo de vida” (4) por “Potencial de ahorro” (5). Recalcula los totales ponderados. Si tu ganador cambia, tu elección es sensible—considera más automatización o un período de prueba si está disponible.
- Modela cambios anunciados. Si tu empresa está cambiando ventanas pico (p. ej., Xcel moviéndose a 5–9 p. m.), vuelve a ejecutar la matriz bajo períodos actuales y futuros [Sala de prensa de Xcel](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E).
- Valida con herramientas. Usa la comparación/calculadora de tu empresa para verificar tu resultado contra datos reales de intervalos (p. ej., herramienta de SCE; calculadora/insights de Seattle City Light donde esté disponible) [Comparación de tarifas de SCE](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool) [TOU de Seattle City Light](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use).

Reglas de decisión confiables
- Si el ahorro mensual neto es positivo con un margen cómodo y las puntuaciones de estilo de vida/automatización son altas, elige TOU.
- Si la matriz se inclina hacia la simplicidad, o los ahorros son marginales después de cargos fijos, mantente en estándar—o prueba TOU solo con una ventana de protección de facturación si tu empresa la ofrece (p. ej., protección de 90 días de SRP) [TOU de SRP](https://www.srpnet.com/price-plans/residential-electric/time-of-use).
- Considerando complementos: La tarificación por pico crítico o pilotos dinámicos por hora pueden recompensar flexibilidad extra en unos pocos días; mantente atento a nuevas ofertas según la guía de la CPUC [Guía sobre tarifas horarias dinámicas de la CPUC](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Lenguaje de compromiso
- “Elijo ______ porque mi matriz muestra el mejor ajuste para mis prioridades este año. Acepto las compensaciones que nombré y revisaré si mi consumo o la estructura tarifaria cambia.”

Plan para reducir riesgos (arranque de 30 días)
- Semana 1: Reúne 12 meses de datos horarios; confirma tus ventanas TOU y diferencias pico/fuera de pico; extrae tu tarifa exacta vía la página de tu empresa o OpenEI URDB [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8).
- Semana 2: Configura temporizadores para EV y HPWH; programa lavavajillas y lavandería fuera de 4–9 p. m.; habilita retrocesos de termostato/preenfriamiento cuando sea razonable [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs).
- Semana 3: Recalcula kWh desplazados con un factor de cumplimiento realista; vuelve a ejecutar la matriz. Usa una herramienta de comparación de la empresa (p. ej., SCE) para validar resultados modelados [Comparación de tarifas de SCE](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool).
- Semana 4: Haz el cambio si la matriz aún apunta a TOU; de lo contrario, mantente en estándar y considera complementos CPP selectivos o vuelve a evaluar cuando lleguen nuevas opciones dinámicas [Guía sobre tarifas horarias dinámicas de la CPUC](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates).

Si un detalle en particular (como tus centavos/kWh exactos o si existe un programa de protección de facturación) no está en el sitio de tu empresa o en los enlaces aquí, anota la brecha y procede con la matriz usando las mejores tarifas y ventanas publicadas disponibles; luego valida con la herramienta de comparación de tu empresa.

## Fuentes:
- [Guía sobre tarifas horarias dinámicas de la CPUC](https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-issues-guidance-for-utility-dynamic-hourly-rates)
- [Explicador de tarifas eléctricas de la CPUC](https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates)
- [Precios TOU de SDG&E](https://www.sdge.com/residential/pricing-plans/about-our-pricing-plans/whenmatters)
- [Planes TOU de PG&E](https://www.pge.com/en_US/small-medium-business/your-account/rates-and-rate-options/time-of-use-rates.page)
- [Comparación de tarifas de SCE](https://www.sce.com/save-money/rates-financing/rate-plan-comparison-tool)
- [TOU de SRP](https://www.srpnet.com/price-plans/residential-electric/time-of-use)
- [SRP gestionar demanda](https://www.srpnet.com/price-plans/residential-electric/manage-demand-5-10-pm-and-save)
- [Comparador de planes de APS](https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans)
- [Sala de prensa de Xcel](https://newsroom.xcelenergy.com/news/xcel-energy-s-new-time-of-use-rates-give-customers-a-new-opportunity-to-save-MCEETSXIRD5ND7DEDLQ3HOBIFZ6E)
- [TOU de Seattle City Light](https://www.seattle.gov/city-light/residential-services/billing-information/time-of-use)
- [OpenEI URDB](https://openei.org/USURDB/rate/view/67c229523a832dfd74041ea8)
- [Meta‑análisis del LBNL](https://emp.lbl.gov/publications/different-prices-difference-slices)
- [Estudio de impactos en factura del LBNL](https://emp.lbl.gov/news/new-berkeley-lab-study-quantifies-residential-customer-bill-impacts-energy-efficiency)
- [DOE Energy Saver](https://www.energy.gov/energysaver/reducing-electricity-use-and-costs)
- [NREL EULP](https://www.nrel.gov/buildings/end-use-load-profiles.html)
- [EIA RECS](https://www.eia.gov/emeu/recs/)
- [AP News cargo fijo](https://apnews.com/article/034a3e1713a744c4151b05e4c4eacaf1)
