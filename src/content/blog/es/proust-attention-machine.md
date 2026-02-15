---
title: "Construyendo un Transformer desde cero: La Maquina de Atencion de Proust"
description: "Como construi un modelo de lenguaje character-level con atencion multi-cabeza, entrenado sobre la obra completa de Proust en espanol. NumPy primero para entender la matematica, PyTorch despues para entrenar."
date: "2026-02-15"
category: "proyectos-y-analisis"
lang: "es"
tags: ["deep-learning", "transformers", "NLP", "PyTorch", "NumPy"]
---

Hay una diferencia entre *usar* un transformer y *entender* un transformer. Llevaba meses llamando a `nn.TransformerEncoder` como si fuera una caja negra confiable, hasta que un dia el loss se estanco, la generacion producia basura y los gradientes explotaban sin que yo pudiera diagnosticar por que. En ese momento decidi que necesitaba bajar al nivel de las multiplicaciones de matrices y reconstruir todo a mano.

El plan era simple en concepto y ambicioso en ejecucion: implementar cada operacion de atencion primero en NumPy puro -- sin autograd, sin magia -- y despues portarla mecanicamente a PyTorch para poder entrenar con GPU. Necesitaba un corpus exigente, y los 7 volumenes de "En busca del tiempo perdido" de Marcel Proust en espanol resultaron ideales. Sus oraciones se extienden por parrafos enteros, con clausulas subordinadas que se abren dentro de otras clausulas, lo que fuerza al mecanismo de atencion a funcionar a distancias largas dentro de la ventana de contexto. Ademas, conozco la obra lo suficiente para evaluar cualitativamente si el modelo captura algo del estilo. Elegi trabajar a nivel de caracter en lugar de usar un tokenizador BPE porque queria eliminar toda complejidad que no fuera atencion misma: con un vocabulario de apenas 94 simbolos (letras, acentos, puntuacion), el modelo tiene que aprender *todo* -- desde ortografia hasta sintaxis -- puramente a partir de patrones estadisticos. El resultado fue un transformer de 419,840 parametros entrenado sobre 7.15 millones de caracteres de prosa compleja.

## Construyendolo desde los fundamentos

Todo empezo en NumPy. Antes de escribir una sola linea de PyTorch, implemente la arquitectura completa: la lookup table de embeddings con codificacion posicional sinusoidal (la formula original del paper "Attention Is All You Need"), las proyecciones Q, K, V de la atencion multi-cabeza, el producto escalado con mascara causal, la concatenacion de cabezas, los bloques transformer con feedforward y residual connections, y la layer normalization. Cada archivo incluye lo que llame "Class Notes" -- bloques de comentario que explican el concepto *antes* del codigo, con la intencion de que cualquier persona con algebra lineal basica pueda seguir la logica completa.

```python
# Atencion: softmax(QK^T / sqrt(d_k)) * V
# Q, K, V son proyecciones lineales del input
# sqrt(d_k) escala los scores para evitar que el softmax sature
#   (cuando d_k es grande, los productos punto crecen en magnitud
#    proporcional a sqrt(d_k), empujando el softmax a regiones
#    con gradientes cercanos a cero)
```

El corazon del proyecto fue rastrear las shapes en cada operacion. Los tokens de entrada con shape (batch, 256) pasan por embedding y codificacion posicional para convertirse en (batch, 256, 128), atraviesan 2 bloques transformer que preservan esa misma shape, y finalmente se proyectan a (batch, 256, 94) -- los logits sobre el vocabulario de 94 caracteres. Cada una de esas transformaciones esta anotada linea por linea en el codigo NumPy, lo que hace explicito exactamente donde cambia la geometria del tensor y por que.

La arquitectura es deliberadamente modesta: un `d_model` de 128 por ser el balance entre capacidad expresiva y lo que cabe en el free tier de Colab, 2 cabezas de atencion para que el modelo pueda aprender patrones paralelos sin complicar el debug, 2 capas de transformer porque con dos ya se pueden componer representaciones no triviales, una dimension feedforward de 512 siguiendo la convencion estandar de 4 veces `d_model`, una ventana de contexto de 256 caracteres, y dropout de 0.1 como regularizacion. Todo el modelo suma 419,840 parametros -- entrenable en unos 30 minutos con una T4 de Colab.

Una vez que la implementacion NumPy estaba completa y cada operacion se sentia solida en mi cabeza, el port a PyTorch fue mecanico. Mismos nombres de variables, misma estructura, solo cambiando `np.ndarray` por `torch.Tensor` y reemplazando las operaciones manuales por `nn.Linear`. No hubo ninguna decision de diseno nueva en esa etapa; todo el pensamiento ya habia ocurrido en NumPy.

## Datos, entrenamiento y lo que salio

El corpus tuvo su propia historia de iteraciones. La primera version usaba 2 volumenes descargados de Project Gutenberg, y fue un desastre: ruido de OCR por todas partes, marcas de agua del editor filtrandose al texto, metadata que aparecia como si fuera prosa. El vocabulario se inflo a mas de 200 caracteres, lleno de artefactos que el modelo aprendia fielmente como si fueran lenguaje real. La leccion fue directa -- born-digital siempre es superior a OCR. La version final usa los 7 volumenes completos extraidos de archivos MOBI, que al ser nacidos digitales tienen texto perfecto. Despues de una limpieza por whitelist de caracteres validos y verificacion contra metadatos del editor, quedo un corpus de 7.15 MB de texto limpio con un vocabulario de exactamente 94 caracteres. El `ProustDataset` genera ventanas deslizantes de 256 caracteres con sus targets desplazados un caracter, siguiendo el esquema estandar de teacher forcing.

Para el entrenamiento use AdamW con learning rate de 3e-4 y weight decay de 0.01, un schedule de cosine annealing con warmup lineal de 500 pasos, gradient clipping con norma maxima de 1.0, y un split 90/10 entre entrenamiento y validacion. Despues de 1 epoca completa -- 201,104 pasos sobre todo el corpus -- obtuve estos resultados:

| Metrica | Valor |
|---------|-------|
| Loss de entrenamiento | 1.348 |
| Loss de validacion | 1.192 |

Que el loss de validacion sea *menor* que el de entrenamiento puede parecer contraintuitivo, pero se explica por el dropout: durante entrenamiento se desactivan neuronas aleatoriamente como regularizacion, mientras que en validacion el modelo usa toda su capacidad.

Con temperatura 0.8 y top-k 40, el modelo genera texto que revela tanto lo que aprendio como lo que no. Con el prompt "Mucho tiempo":

> Mucho tiempo verdad, sin sus muchos que esa cortina de los personas con las que el senor. Es que lo que el amor que acababa de propio de la imaginacion y que habia causado una gran modo de olvidarla o de vida reductamente el mio). Por eso, mi madre sistencia desconocida con frecuencia, no hubiera ido a consider

Y con el prompt "La memoria":

> La memoria y su pasad se sigue, por ejemplo, senora aun sin embargo, al menos encontrar a la Sra. de Guermantes me permanecia yo saber que el mismo seguro, pero en el que, si bien buscar con frecuencia venir a veces a un cual se debe tanto para salir y no podia hacer ella su disposicion con la sociedad, por l

Lo notable es lo que un modelo de apenas 420K parametros logra con solo 1 epoca de entrenamiento. Los nombres de personajes aparecen correctamente -- Swann, Guermantes, Sra. -- aprendidos puramente de frecuencia estadistica. La estructura gramatical del espanol esta presente: sujeto-verbo-complemento, genero gramatical mayormente correcto. Se percibe algo del estilo proustiano en las oraciones largas con clausulas subordinadas, parentesis y digresiones. El vocabulario tematico -- salon, sociedad, imaginacion, memoria -- refleja fielmente el lexico de la novela. Pero la coherencia semantica se desvanece a medida que la oracion se alarga: las frases empiezan bien y pierden el hilo, la concordancia de genero y numero falla intermitentemente, y los parentesis y signos de puntuacion no siempre se cierran. Son exactamente las limitaciones que esperaria de un modelo tan pequeno con una sola pasada por los datos.

## Lo que realmente aprendi

Las anotaciones matematicas que fui dejando en el codigo se convirtieron en el recurso mas valioso del proyecto. El escalamiento por la raiz cuadrada de `d_k` no es un detalle cosmico -- es crucial. Sin el, los productos punto en la atencion crecen en magnitud proporcional a la dimension, el softmax satura en sus extremos, y los gradientes desaparecen. Derive la justificacion completa como un ejercicio de varianza de sumas de variables aleatorias, y ese derivacion aclaro para mi por que tantos modelos de atencion necesitan esta correccion que parece tan arbitraria. La mascara causal resulto ser de una elegancia sorprendente: es simplemente una matriz triangular superior llena de `-inf` que, al sumarse a los scores de atencion, hace que el softmax convierta en cero toda posicion futura. No se necesita logica condicional ni flujo de control complejo -- todo el concepto de causalidad se reduce a una suma y una propiedad del softmax. Las residual connections, por su parte, son mas importantes de lo que aparentan en los diagramas de arquitectura. Sin ellas, la senal del gradiente tiene que atravesar todas las capas secuencialmente; con ellas, hay un atajo directo que explica por que los transformers profundos son entrenables donde otras arquitecturas profundas no lo son.

Sobre el entrenamiento, cada decision que parecia un hiperparametro mas resulto tener una justificacion que solo entendi al experimentar sin ella. El warmup del learning rate es esencial porque sin el, los primeros pasos con tasa de aprendizaje alta destruyen los pesos inicializados aleatoriamente -- esos 500 pasos de calentamiento lineal antes del cosine decay son proteccion, no burocracia. El gradient clipping con norma 1.0 previene explosiones que con textos largos y mecanismos de atencion ocurren mas rapido de lo que uno esperaria. Y una sola epoca resulto suficiente para resultados interesantes: con 7.15 MB de texto y ventanas de 256, hay aproximadamente 28,000 batches por epoca, lo que le da al modelo material de sobra para capturar los patrones linguisticos fundamentales sin llegar al overfitting.

La leccion mas pragmatica fue sobre datos. La primera iteracion con OCR ruidoso no solo producia resultados peores -- producia un modelo que aprendia con igual fidelidad los errores y los patrones reales, inflando el vocabulario con basura y creando asociaciones espurias. Cambiar a extraccion MOBI born-digital redujo el vocabulario de mas de 200 a 94 caracteres y mejoro todo el pipeline downstream. En proyectos futuros, la calidad de los datos va antes que la cantidad, y born-digital siempre es preferible a OCR.

De aqui en adelante, el camino esta claro. El modelo no llego a convergencia -- 5 a 10 epocas probablemente mejorarian la coherencia de manera significativa. Quiero probar pre-norm en lugar de post-norm para mayor estabilidad si escalo a mas capas, experimentar con un tokenizador BPE para capturar la morfologia del espanol, y explorar las attention maps que ya tengo implementadas para entender que patrones aprende cada cabeza. Eso ultimo -- la visualizacion de atencion -- es la fase pendiente que mas me entusiasma, porque promete mostrar empiricamente si las cabezas se especializan en tipos diferentes de dependencia linguistica.

## Cerrando el circulo

Este proyecto refuerza fundamentos que aparecen en el resto de mi portafolio. La logica de decision bajo incertidumbre -- central tanto en el modelo de riesgo crediticio con GLM como en el framework bayesiano vs frecuentista del test A/B -- es la misma que gobierna como un transformer pondera su atencion: asigna probabilidades y elige. El codigo completo con anotaciones de shapes en cada operacion esta en el [repositorio de GitHub](https://github.com/GonorAndres/proust-attention).

---

*Un modelo de 420K parametros no va a escribir como Proust. Pero construirlo desde la primera multiplicacion de matrices hasta la ultima muestra generada me dio algo mas valioso: la intuicion para saber que esta pasando cuando un modelo de lenguaje falla -- y como arreglarlo.*
