---
title: "Building a Transformer from Scratch: The Proust Attention Machine"
description: "How I built a character-level language model with multi-head attention, trained on Proust's complete work in Spanish. NumPy first to understand the math, PyTorch second to train."
date: "2026-02-15"
category: "proyectos-y-analisis"
lang: "en"
tags: ["deep-learning", "transformers", "NLP", "PyTorch", "NumPy"]
---

# Building a Transformer from Scratch

There's a difference between *using* a transformer and *understanding* a transformer. Modern frameworks abstract all the internal machinery: you call `nn.TransformerEncoder` and it works. But when something breaks -- when the loss won't decrease, when generation produces garbage, when gradients explode -- you need to know what's happening inside.

This project was born from that need: implement every attention operation by hand, first in pure NumPy (no autograd, no magic) then port it to PyTorch for GPU training. The corpus: all 7 volumes of Marcel Proust's "In Search of Lost Time" in Spanish -- 7.15 million characters of complex prose, with sentences that stretch across entire paragraphs.

## Why character-level and why Proust

**Character-level** for pedagogical simplicity. A BPE tokenizer (like GPT's) introduces complexity that distracts from the goal: understanding attention. With characters, the vocabulary is 94 symbols (letters, accents, punctuation) and the model must learn *everything* -- from spelling to syntax -- purely from statistical patterns.

**Proust** for three reasons. First: the length of his sentences demands that the attention mechanism work well across long distances within the context window. Second: the text is public domain and born-digital (extracted from MOBI ebooks, not noisy OCR). Third: it's literature I know, so I can qualitatively evaluate whether the model captures something of the style.

## Architecture: the minimum necessary

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `d_model` | 128 | Balance between capacity and what fits on Colab free tier |
| `n_heads` | 2 | Enough for the model to learn parallel attention patterns |
| `n_layers` | 2 | More layers = more parameters; 2 already allows composing representations |
| `d_ff` | 512 | Standard convention: 4x `d_model` |
| `max_seq_len` | 256 | Context window in characters |
| `dropout` | 0.1 | Standard regularization |
| **Total parameters** | **419,840** | Trainable in ~30 min on a Colab T4 |

The shape flow is the heart of the project. Every operation is annotated:

```
Input tokens:           (batch, 256)
Embedding + position:   (batch, 256, 128)
2x TransformerBlocks:   (batch, 256, 128)  -- shape is preserved
Final projection:       (batch, 256, 94)   -- logits over vocabulary
```

## The NumPy-first approach

Before writing a single line of PyTorch, I implemented the full architecture in NumPy:

- **Embedding**: lookup table + sinusoidal positional encoding (the original formula from "Attention Is All You Need")
- **Multi-head attention**: Q, K, V projections, scaled dot-product with causal masking, and head concatenation
- **Transformer blocks**: attention + feedforward + residual connections + layer normalization
- **Causal mask**: an upper triangular matrix with `-inf` so position `i` can only attend to positions `0, 1, ..., i`

Each file includes "Class Notes" -- comment blocks explaining the concept *before* the code. The goal was for anyone with basic linear algebra to follow the logic:

```python
# Attention: softmax(QK^T / sqrt(d_k)) * V
# Q, K, V are linear projections of the input
# sqrt(d_k) scales scores to prevent softmax saturation
#   (when d_k is large, dot products grow in magnitude
#    proportional to sqrt(d_k), pushing softmax into regions
#    with near-zero gradients)
```

The PyTorch port was then mechanical: same variable names, same structure, only swapping `np.ndarray` for `torch.Tensor` and manual operations for `nn.Linear`.

## Data pipeline

The corpus went through several iterations:

1. **First version**: 2 volumes downloaded from Gutenberg. Issues: OCR noise, publisher watermarks, metadata leaking into text
2. **Final version**: 7 complete volumes extracted from MOBI files (born-digital). Cleaning via character whitelist, verification that no publisher metadata leaked through

Result: **7.15 MB of clean text**, 94-character vocabulary. The `ProustDataset` generates sliding windows of 256 characters with targets shifted by one character (standard teacher forcing).

## Training

Training loop configuration:

- **Optimizer**: AdamW (lr=3e-4, weight decay=0.01)
- **Schedule**: Cosine annealing with 500-step warmup
- **Gradient clipping**: max norm 1.0
- **Validation**: 90/10 split

Results after 1 full epoch (**201,104 steps** over the entire corpus):

| Metric | Value |
|--------|-------|
| Training loss | 1.348 |
| Validation loss | 1.192 |

Validation loss being *lower* than training loss may seem counterintuitive, but it's explained by dropout: during training, random neurons are deactivated (regularization), while during validation the model uses its full capacity.

## Results: generated text

At temperature 0.8 with top-k 40, the model generates text like this:

**Prompt**: "Mucho tiempo" (A long time)
> Mucho tiempo verdad, sin sus muchos que esa cortina de los personas con las que el senor. Es que lo que el amor que acababa de propio de la imaginacion y que habia causado una gran modo de olvidarla o de vida reductamente el mio). Por eso, mi madre sistencia desconocida con frecuencia, no hubiera ido a consider

**Prompt**: "La memoria" (Memory)
> La memoria y su pasad se sigue, por ejemplo, senora aun sin embargo, al menos encontrar a la Sra. de Guermantes me permanecia yo saber que el mismo seguro, pero en el que, si bien buscar con frecuencia venir a veces a un cual se debe tanto para salir y no podia hacer ella su disposicion con la sociedad, por l

**Prompt**: "En aquella epoca" (In that era)
> En aquella epoca a su salon de mi abuelo lo del pintor por el debo de hombre conciencia para lo que podia acostar su futuro de su celo, con la menor en lugar de aquel modo el nombre de la ultima de la floresco de la mano, inteligencia de las cuales ya la Sra. Swann -- por lo demas, en el que mismo, en cambio, no cesa

What the model learned (with only 420K parameters and 1 epoch):

- **Character names**: Swann, Guermantes, Sra. -- learned purely from statistical frequency
- **Grammatical structure**: Spanish subject-verb-complement, grammatical gender mostly correct
- **Proustian style**: long sentences with subordinate clauses, parenthetical remarks, digressions
- **Thematic vocabulary**: salon, sociedad, imaginacion, memoria -- the novel's lexicon

What it *didn't* achieve:

- Long-range semantic coherence (sentences start well but lose the thread)
- Consistent gender/number agreement
- Balanced punctuation and parenthesis closure

## Annotations and key takeaways

### On implementation

1. **Scaling by sqrt(d_k) is crucial**. Without it, dot products in attention grow with the dimension, softmax saturates, and gradients vanish. I derived the full mathematical justification -- it's an exercise in the variance of sums of random variables.

2. **The causal mask is just a triangular matrix with -inf**. It's elegant: by adding `-inf` to future attention scores, softmax turns them to zero. No conditional logic needed.

3. **Residual connections matter more than they seem**. Without them, the gradient signal must traverse all layers; with them, there's a direct "shortcut." This explains why deep transformers are trainable at all.

4. **Layer normalization before or after** (pre-norm vs post-norm) changes training stability. I used post-norm (original paper) but pre-norm tends to be more stable for deeper models.

### On training

5. **Learning rate warmup is essential**. Without warmup, the first steps at high learning rate destroy randomly initialized weights. 500 steps of linear warmup before cosine decay.

6. **Gradient clipping prevents explosions**. With long sequences and attention, gradients can grow fast. Clipping the norm at 1.0 keeps things stable.

7. **1 epoch was enough for interesting results**. With 7.15 MB of text and 256-character windows, there are ~28K batches per epoch. The model captures linguistic patterns without overfitting.

### On the corpus

8. **Data quality matters more than quantity**. The first version with noisy OCR produced inflated vocabularies and spurious patterns. Switching to clean MOBI extraction reduced the vocabulary from ~200+ to 94 characters and improved everything downstream.

9. **Born-digital > OCR, always**. Ebooks extracted from MOBI have perfect text. OCR from scanned PDFs introduces errors that the model faithfully learns.

## What I'd do differently

- **More epochs**: the model clearly didn't reach convergence. 5-10 epochs would likely improve coherence significantly.
- **Pre-norm instead of post-norm**: for stability, especially when scaling to more layers.
- **Larger embedding dimension**: 256 or even 384 would fit on the Colab T4 and give the model more capacity.
- **BPE tokenization**: character-level was perfect for learning, but for more coherent results, a subword tokenizer would capture Spanish morphology.
- **Attention visualization**: the attention maps are implemented but I haven't explored what patterns each head learns. That's pending Phase 3.

## Connection to other projects

This project reinforces fundamentals that appear across my portfolio. The logic of **decision under uncertainty** -- central in the credit risk model (GLM for default prediction) and the Bayesian vs frequentist A/B testing framework -- is the same logic governing how a transformer weighs its attention: it assigns probabilities and chooses. The data handling for the corpus (cleaning, validation, splits) follows the same discipline I apply in the Michoacan demographic analysis and in the insurance data pipelines for the GMM Explorer.

## Code and resources

- [GitHub repository](https://github.com/GonorAndres/proust-attention) -- complete code with shape annotations on every operation
- NumPy implementation: `src/attention.py`, `src/model.py`
- PyTorch implementation: `src/model_torch.py`
- Mathematical documentation: `docs/linear_algebra_of_attention.md`

---

*A 420K-parameter model won't write like Proust. But building it from the first matrix multiplication to the last generated sample gave me something more valuable: the intuition to know what's happening when a language model fails -- and how to fix it.*
