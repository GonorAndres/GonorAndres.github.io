---
title: "Construyendo un Transformer desde cero: La Maquina de Atencion de Proust"
description: "Como construi un modelo de lenguaje character-level con atencion multi-cabeza, entrenado sobre la obra completa de Proust en espanol. NumPy primero para entender la matematica, PyTorch despues para entrenar."
date: "2026-02-15"
category: "proyectos-y-analisis"
lang: "es"
tags: ["deep-learning", "transformers", "NLP", "PyTorch", "NumPy"]
---

# Construyendo un Transformer desde cero

Hay una diferencia entre *usar* un transformer y *entender* un transformer. Los frameworks modernos abstraen toda la maquinaria interna: llamas `nn.TransformerEncoder` y funciona. Pero cuando algo falla -- cuando el loss no baja, cuando la generacion produce basura, cuando los gradientes explotan -- necesitas saber que esta pasando adentro.

Este proyecto nacio de esa necesidad: implementar cada operacion de atencion a mano, primero en NumPy puro (sin autograd, sin magia) y despues portarlo a PyTorch para entrenarlo con GPU. El corpus: los 7 volumenes de "En busca del tiempo perdido" de Marcel Proust en espanol -- 7.15 millones de caracteres de prosa compleja, con oraciones que se extienden por parrafos enteros.

## Por que character-level y por que Proust

**Character-level** por simplicidad pedagogica. Un tokenizador BPE (como el de GPT) introduce complejidad que distrae del objetivo: entender atencion. Con caracteres, el vocabulario son 94 simbolos (letras, acentos, puntuacion) y el modelo tiene que aprender *todo* -- desde ortografia hasta sintaxis -- puramente a partir de patrones estadisticos.

**Proust** por tres razones. Primera: la longitud de sus oraciones exige que el mecanismo de atencion funcione bien a distancias largas dentro del contexto. Segunda: el texto es de dominio publico y nacido digital (extraido de ebooks MOBI, no OCR ruidoso). Tercera: es literatura que conozco, asi que puedo evaluar cualitativamente si el modelo captura algo del estilo.

## Arquitectura: lo minimo necesario

| Parametro | Valor | Razon |
|-----------|-------|-------|
| `d_model` | 128 | Balance entre capacidad y lo que cabe en Colab free tier |
| `n_heads` | 2 | Suficiente para que el modelo aprenda patrones de atencion paralelos |
| `n_layers` | 2 | Mas capas = mas parametros; con 2 ya se pueden componer representaciones |
| `d_ff` | 512 | Convencion estandar: 4x `d_model` |
| `max_seq_len` | 256 | Ventana de contexto en caracteres |
| `dropout` | 0.1 | Regularizacion estandar |
| **Total parametros** | **419,840** | Entrenable en ~30 min con T4 de Colab |

El flujo de shapes es el corazon del proyecto. Cada operacion esta anotada:

```
Input tokens:           (batch, 256)
Embedding + posicion:   (batch, 256, 128)
2x TransformerBlocks:   (batch, 256, 128)  -- la shape se preserva
Proyeccion final:       (batch, 256, 94)   -- logits sobre vocabulario
```

## El enfoque NumPy-first

Antes de escribir una sola linea de PyTorch, implemente toda la arquitectura en NumPy:

- **Embedding**: lookup table + codificacion posicional sinusoidal (la formula original del paper "Attention Is All You Need")
- **Atencion multi-cabeza**: proyecciones Q, K, V, el producto escalado con mascara causal, y la concatenacion de cabezas
- **Bloques transformer**: atencion + feedforward + residual connections + layer normalization
- **Mascara causal**: una matriz triangular superior con `-inf` para que la posicion `i` solo pueda atender a posiciones `0, 1, ..., i`

Cada archivo incluye "Class Notes" -- bloques de comentario que explican el concepto *antes* del codigo. El objetivo era que cualquier persona con algebra lineal basica pudiera seguir la logica:

```python
# Atencion: softmax(QK^T / sqrt(d_k)) * V
# Q, K, V son proyecciones lineales del input
# sqrt(d_k) escala los scores para evitar que el softmax sature
#   (cuando d_k es grande, los productos punto crecen en magnitud
#    proporcional a sqrt(d_k), empujando el softmax a regiones
#    con gradientes cercanos a cero)
```

Despues, el port a PyTorch fue mecanico: mismos nombres de variables, misma estructura, solo cambiando `np.ndarray` por `torch.Tensor` y operaciones manuales por `nn.Linear`.

## Pipeline de datos

El corpus paso por varias iteraciones:

1. **Primera version**: 2 volumenes descargados de Gutenberg. Problemas: ruido OCR, marcas de agua del editor, metadata filtrandose al texto
2. **Version final**: 7 volumenes completos extraidos de archivos MOBI (born-digital). Limpieza por whitelist de caracteres validos, verificacion de que no se filtren metadatos del editor

Resultado: **7.15 MB de texto limpio**, 94 caracteres de vocabulario. El `ProustDataset` genera ventanas deslizantes de 256 caracteres con sus targets desplazados un caracter (teacher forcing estandar).

## Entrenamiento

Configuracion del loop de entrenamiento:

- **Optimizador**: AdamW (lr=3e-4, weight decay=0.01)
- **Schedule**: Cosine annealing con warmup de 500 pasos
- **Gradient clipping**: norma maxima 1.0
- **Validacion**: split 90/10

Resultados despues de 1 epoca completa (**201,104 pasos** sobre todo el corpus):

| Metrica | Valor |
|---------|-------|
| Loss de entrenamiento | 1.348 |
| Loss de validacion | 1.192 |

Que el loss de validacion sea *menor* que el de entrenamiento puede parecer contraintuitivo, pero se explica por el dropout: durante entrenamiento se desactivan neuronas aleatoriamente (regularizacion), mientras que en validacion el modelo usa toda su capacidad.

## Resultados: texto generado

Con temperatura 0.8 y top-k 40, el modelo genera texto como este:

**Prompt**: "Mucho tiempo"
> Mucho tiempo verdad, sin sus muchos que esa cortina de los personas con las que el senor. Es que lo que el amor que acababa de propio de la imaginacion y que habia causado una gran modo de olvidarla o de vida reductamente el mio). Por eso, mi madre sistencia desconocida con frecuencia, no hubiera ido a consider

**Prompt**: "La memoria"
> La memoria y su pasad se sigue, por ejemplo, senora aun sin embargo, al menos encontrar a la Sra. de Guermantes me permanecia yo saber que el mismo seguro, pero en el que, si bien buscar con frecuencia venir a veces a un cual se debe tanto para salir y no podia hacer ella su disposicion con la sociedad, por l

**Prompt**: "En aquella epoca"
> En aquella epoca a su salon de mi abuelo lo del pintor por el debo de hombre conciencia para lo que podia acostar su futuro de su celo, con la menor en lugar de aquel modo el nombre de la ultima de la floresco de la mano, inteligencia de las cuales ya la Sra. Swann -- por lo demas, en el que mismo, en cambio, no cesa

Lo que el modelo aprendio (con solo 420K parametros y 1 epoca):

- **Nombres de personajes**: Swann, Guermantes, Sra. -- aprendidos puramente de frecuencia estadistica
- **Estructura gramatical**: sujeto-verbo-complemento del espanol, genero gramatical mayormente correcto
- **Estilo proustiano**: oraciones largas con clausulas subordinadas, parentesis, digresiones
- **Vocabulario tematico**: salon, sociedad, imaginacion, memoria -- el lexico de la novela

Lo que *no* logro:

- Coherencia semantica a largo plazo (las oraciones empiezan bien pero pierden el hilo)
- Concordancia de genero/numero consistente
- Cierre de parentesis y puntuacion balanceada

## Anotaciones y puntos clave

### Sobre la implementacion

1. **El escalamiento por sqrt(d_k) es crucial**. Sin el, los productos punto en la atencion crecen con la dimension, el softmax satura, y los gradientes desaparecen. Derive la justificacion matematica completa -- es un ejercicio de varianza de sumas de variables aleatorias.

2. **La mascara causal es solo una matriz triangular con -inf**. Es elegante: al sumar `-inf` a los scores de atencion futuros, el softmax los convierte en cero. No se necesita logica condicional.

3. **Las residual connections son mas importantes de lo que parecen**. Sin ellas, la senal del gradiente tiene que atravesar todas las capas; con ellas, hay un "atajo" directo. Esto explica por que transformers profundos son entrenables.

4. **Layer normalization antes o despues** (pre-norm vs post-norm) cambia la estabilidad del entrenamiento. Use post-norm (como el paper original) pero pre-norm tiende a ser mas estable para modelos mas profundos.

### Sobre el entrenamiento

5. **El warmup del learning rate es esencial**. Sin warmup, los primeros pasos con learning rate alto destruyen los pesos inicializados aleatoriamente. 500 pasos de warmup lineal antes del cosine decay.

6. **Gradient clipping previene explosiones**. Con textos largos y atencion, los gradientes pueden crecer rapido. Clipear la norma a 1.0 lo mantiene estable.

7. **1 epoca fue suficiente para resultados interesantes**. Con 7.15 MB de texto y ventanas de 256, hay ~28K batches por epoca. El modelo captura patrones linguisticos sin overfitting.

### Sobre el corpus

8. **La calidad de datos importa mas que la cantidad**. La primera version con OCR ruidoso producia vocabularios inflados y patrones espurios. Cambiar a extraccion MOBI limpia redujo el vocabulario de ~200+ a 94 caracteres y mejoro todo downstream.

9. **Born-digital > OCR siempre**. Los ebooks extraidos de MOBI tienen texto perfecto. El OCR de PDFs escaneados introduce errores que el modelo aprende fielmente.

## Que haria diferente

- **Mas epocas**: el modelo claramente no llego a convergencia. 5-10 epocas probablemente mejorarian la coherencia significativamente.
- **Pre-norm en vez de post-norm**: para estabilidad, especialmente si escalo a mas capas.
- **Embedding dimension mayor**: 256 o incluso 384 cabria en el T4 de Colab y le daria al modelo mas capacidad.
- **BPE tokenizacion**: character-level fue perfecto para aprender, pero para resultados mas coherentes, un tokenizador de subpalabras captaria morfologia espanola.
- **Visualizacion de atencion**: las attention maps estan implementadas pero no explore que patrones aprende cada cabeza. Eso es Phase 3 pendiente.

## Conexion con otros proyectos

Este proyecto refuerza fundamentos que aparecen en el resto de mi portafolio. La logica de **decision bajo incertidumbre** -- central en el modelo de riesgo crediticio (GLM para predecir incumplimiento) y en el framework bayesiano vs frecuentista del test A/B -- es la misma que gobierna como un transformer pondera su atencion: asigna probabilidades y elige. La manipulacion de datos del corpus (limpieza, validacion, splits) sigue la misma disciplina que aplico en el analisis demografico de Michoacan y en los pipelines de datos de seguros del GMM Explorer.

## Codigo y recursos

- [Repositorio en GitHub](https://github.com/GonorAndres/proust-attention) -- codigo completo con anotaciones de shapes en cada operacion
- Implementacion NumPy: `src/attention.py`, `src/model.py`
- Implementacion PyTorch: `src/model_torch.py`
- Documentacion matematica: `docs/linear_algebra_of_attention.md`

---

*Un modelo de 420K parametros no va a escribir como Proust. Pero construirlo desde la primera multiplicacion de matrices hasta la ultima muestra generada me dio algo mas valioso: la intuicion para saber que esta pasando cuando un modelo de lenguaje falla -- y como arreglarlo.*
