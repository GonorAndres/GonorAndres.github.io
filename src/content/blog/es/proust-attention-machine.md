---
title: "Construyendo un Transformer desde cero: La Maquina de Atencion de Proust"
description: "Queria entender que pasa realmente dentro de un modelo de lenguaje. Construi uno desde la primera multiplicacion de matrices, lo entrene con los 7 volumenes de Proust, y lo que mas me enseno no fue la arquitectura sino lo que implica que todo sea numeros."
date: "2026-02-15"
category: "proyectos-y-analisis"
lang: "es"
tags: ["deep-learning", "transformers", "NLP", "PyTorch", "NumPy"]
---

La revolucion de la IA ya llego. Pero lo que me golpeo no fue que los modelos pudieran generar texto -- fue que hablar con un modelo frontera se siente como hablar con alguien mas capaz intelectualmente que la mayoria de las personas que conozco. No en terminos de creatividad libre o espiritu salvaje, sino en capacidad de razonamiento, en conectar ideas, en mantener un argumento. Eso me hizo pensar: algo complejo tiene que estar pasando en esas GPUs. Algo que quiero entender.

Mi primer intento fue con TensorFlow. Segui tutoriales, use funciones de alto nivel, entrene modelos que "funcionaban". Pero todo se sentia como un "hello world" -- estaba usando herramientas sin entender que hacian por dentro. Sabia la teoria general: los modelos de lenguaje predicen el siguiente token basandose en pesos entrenados, y los gradientes son la herramienta que ajusta esos pesos iteracion tras iteracion. Me parecia curioso que algo tan mecanico como descender por un gradiente pudiera producir algo que *parece* inteligencia. Pero el proceso es lento, requiere millones de operaciones, y ahi es donde entran las GPUs. Queria ver todo eso con mis propias manos.

Asi que decidi construir un transformer desde cero. No usando `nn.TransformerEncoder` como caja negra, sino implementando cada multiplicacion de matrices primero en NumPy puro -- sin autograd, sin magia -- para forzarme a entender cada operacion antes de portarla a PyTorch.

## Por que Proust

Proust es mi libro favorito. "En busca del tiempo perdido" tiene un estilo que no existe en nadie vivo hoy -- ni siquiera en escritura personal. Esas oraciones que se extienden por parrafos enteros, con clausulas subordinadas que se abren dentro de otras clausulas, esa forma sentimental, melancolica y artistica de hilar ideas... no esta en mi, y diria que no esta en la mayoria de las personas. No importa cuanto lo intente, no puedo imitar ese estilo. La longitud de las frases, el tono -- es algo particular de Proust.

Eso hacia que el test fuera alto. Sabia que no iba a crear una maquina de Proust desde cero solo con GPUs. Pero queria saber que tan lejos llegaria. Si el mecanismo de atencion podia capturar algo de ese estilo tan particular, significaba que estaba funcionando de verdad. Y si no podia -- que es lo mas probable con un modelo pequeno -- las limitaciones me iban a ensenar tanto como los aciertos.

Elegi trabajar a nivel de caracter en lugar de usar un tokenizador BPE. Con un vocabulario de apenas 94 simbolos (letras, acentos, puntuacion), el modelo tiene que aprender *todo* -- desde ortografia hasta sintaxis -- puramente a partir de patrones estadisticos. Menos complejidad ajena a la atencion, mas claridad sobre que esta aprendiendo realmente.

## La construccion

Todo empezo en NumPy. Implemente la arquitectura completa: la lookup table de embeddings con codificacion posicional sinusoidal (la formula original de "Attention Is All You Need"), las proyecciones Q, K, V de la atencion multi-cabeza, el producto escalado con mascara causal, la concatenacion de cabezas, los bloques transformer con feedforward y residual connections, y la layer normalization. Cada archivo incluye lo que llame "Class Notes" -- bloques de comentario que explican el concepto *antes* del codigo, con la intencion de que cualquier persona con algebra lineal basica pueda seguir la logica.

```python
# Atencion: softmax(QK^T / sqrt(d_k)) * V
# Q, K, V son proyecciones lineales del input
# sqrt(d_k) escala los scores para evitar que el softmax sature
#   (cuando d_k es grande, los productos punto crecen en magnitud
#    proporcional a sqrt(d_k), empujando el softmax a regiones
#    con gradientes cercanos a cero)
```

La arquitectura es deliberadamente modesta: `d_model` de 128, 2 cabezas de atencion, 2 capas de transformer, dimension feedforward de 512, ventana de contexto de 256 caracteres, y dropout de 0.1. Todo el modelo suma 419,840 parametros -- entrenable en unos 30 minutos con una T4 de Colab, que es increible que sea un recurso gratuito y disponible para todo publico.

Lo que mas me ayudo a entender fue rastrear las shapes. Los tokens entran como (batch, 256), pasan por embedding y codificacion posicional para convertirse en (batch, 256, 128), atraviesan 2 bloques transformer que preservan esa shape, y se proyectan a (batch, 256, 94) -- los logits sobre el vocabulario. Cada transformacion esta anotada linea por linea en el codigo NumPy.

Una vez que la implementacion NumPy estaba completa y cada operacion se sentia solida, el port a PyTorch fue mecanico. Mismos nombres de variables, misma estructura, solo cambiando `np.ndarray` por `torch.Tensor`. Todo el pensamiento ya habia ocurrido en NumPy.

## Datos, entrenamiento y las horas de espera

El corpus tuvo su propia historia. La primera version usaba 2 volumenes de Project Gutenberg, y fue un desastre: ruido de OCR por todas partes, marcas de agua del editor, metadata filtrandose al texto. El vocabulario se inflo a mas de 200 caracteres lleno de basura que el modelo aprendia con la misma fidelidad que los patrones reales. La version final usa los 7 volumenes completos extraidos de archivos MOBI -- nacidos digitales, sin artefactos de escaneo. Despues de limpieza por whitelist: 7.15 millones de caracteres con un vocabulario de exactamente 94 simbolos.

Para el entrenamiento use AdamW con learning rate de 3e-4 y weight decay de 0.01, cosine annealing con warmup lineal de 500 pasos, gradient clipping con norma maxima de 1.0, y un split 90/10. Despues de 201,104 pasos sobre todo el corpus:

| Metrica | Valor |
|---------|-------|
| Loss de entrenamiento | 1.348 |
| Loss de validacion | 1.192 |

Que el loss de validacion sea menor que el de entrenamiento se explica por el dropout: durante entrenamiento se desactivan neuronas aleatoriamente, mientras que en validacion el modelo usa toda su capacidad.

Las horas de espera mientras el modelo entrenaba fueron parte del aprendizaje. Ver como el loss bajaba, como la escritura mejoraba gradualmente -- al principio puro ruido, despues palabras sueltas en espanol, despues frases con estructura. Con temperatura 0.8 y top-k 40, el modelo entrenado genera esto:

**Prompt**: "Mucho tiempo"
> Mucho tiempo verdad, sin sus muchos que esa cortina de los personas con las que el senor. Es que lo que el amor que acababa de propio de la imaginacion y que habia causado una gran modo de olvidarla o de vida reductamente el mio). Por eso, mi madre sistencia desconocida con frecuencia, no hubiera ido a consider

**Prompt**: "La memoria"
> La memoria y su pasad se sigue, por ejemplo, senora aun sin embargo, al menos encontrar a la Sra. de Guermantes me permanecia yo saber que el mismo seguro, pero en el que, si bien buscar con frecuencia venir a veces a un cual se debe tanto para salir y no podia hacer ella su disposicion con la sociedad, por l

Los nombres de personajes aparecen correctamente -- Swann, Guermantes, Sra. -- aprendidos puramente de frecuencia estadistica. La estructura gramatical del espanol esta presente. Se percibe algo del estilo proustiano en las oraciones largas con clausulas subordinadas. Pero la coherencia semantica se desvanece conforme la oracion se alarga: empieza bien y pierde el hilo. Con 420K parametros y una sola epoca, eso era esperable.

## Lo que realmente entendi

Toda la parte tecnica -- los embeddings, la tokenizacion, las operaciones de atencion -- esta documentada en detalle en el [repositorio](https://github.com/GonorAndres/proust-attention) con las Class Notes. Son demasiados detalles para exponer en un blog post, y el repositorio los explica mejor de lo que yo podria hacerlo aqui. Lo que quiero contar es lo que entendi *despues* de construir todo eso.

Lo primero que me impacto es lo simple que es cuando lo piensas. El modelo es un tensor. Numeros. Y las relaciones y conexiones entre esos numeros crean outputs que tienen estructura, logica, mensaje. Todo se reduce a multiplicaciones de matrices y una funcion de activacion. Es demasiado simple si lo piensas desde lejos.

Pero ahi es donde se pone importante. Si estos pesos son solo numeros interconectados, entonces tienen vulnerabilidades enormes. Es como con las bombas: si sabes como desactivar una, sabes como construir una. Los tensores de un modelo de lenguaje tienen un potencial combinatorio tan grande que siempre va a ser imposible estar completamente seguro de que todas las conexiones entre pesos no tienen algo danino escondido. No es cuestion de encontrar la vulnerabilidad -- es que el espacio de posibilidades es mas grande de lo que podemos inspeccionar.

Esto me hizo mucho mas consciente de por que Anthropic toma la posicion que toma sobre seguridad en IA. No es paranoia ni marketing. Cuando construyes un modelo desde cero y ves que todo es numeros y gradientes, entiendes que la frontera entre "util" y "peligroso" es una cuestion de pesos -- literalmente. No hay una linea clara en la arquitectura que separe lo bueno de lo malo. Todo depende de que aprendieron esos numeros durante el entrenamiento, y verificar eso exhaustivamente es computacionalmente imposible.

El proyecto no me dejo siendo experto en embeddings ni en clasificacion de tokenizacion. Tampoco fue sobre la T4 gratuita de Colab ni sobre las horas esperando que terminara cada epoca. Lo que me lleve fue entender las causas y consecuencias que son invisibles cuando usas un modelo de lenguaje como usuario -- las que estan escondidas en los pesos de estos monstruos computacionales que tenemos hoy.

El escalamiento por la raiz de `d_k`, la mascara causal como matriz triangular de `-inf`, las residual connections que hacen entrenables los transformers profundos -- todo eso lo derive y lo documente en el codigo. Pero si tuviera que elegir una sola leccion, no seria ninguna de esas. Seria la comprension de que algo tan simple como un tensor puede producir algo que se siente intelectual, y que esa misma simplicidad es la razon por la que la seguridad en IA es un problema tan dificil.

## Que sigue

El modelo no llego a convergencia -- 5 a 10 epocas probablemente mejorarian la coherencia. Quiero probar pre-norm en lugar de post-norm, experimentar con un tokenizador BPE para capturar la morfologia del espanol, y explorar las attention maps para entender que patrones aprende cada cabeza. El codigo completo con anotaciones de shapes esta en el [repositorio de GitHub](https://github.com/GonorAndres/proust-attention).
