---
title: "Building a Transformer from Scratch: The Proust Attention Machine"
description: "How I built a character-level language model with multi-head attention, trained on Proust's complete work in Spanish. NumPy first to understand the math, PyTorch second to train."
date: "2026-02-15"
category: "proyectos-y-analisis"
lang: "en"
tags: ["deep-learning", "transformers", "NLP", "PyTorch", "NumPy"]
---

There is a difference between using a transformer and understanding a transformer. Modern frameworks abstract all the internal machinery: you call `nn.TransformerEncoder` and it works. But when something breaks -- when the loss refuses to decrease, when generation produces garbage, when gradients explode -- you need to know what is happening inside. I wanted that knowledge, and the only way I trusted myself to get it was to build the whole thing by hand.

That meant two decisions up front. First, character-level tokenization instead of BPE. A subword tokenizer like GPT's introduces its own complexity -- merge tables, vocabulary construction, encoding edge cases -- and all of that distracts from the real goal: understanding attention. With characters, the vocabulary is just 94 symbols (letters, accents, punctuation), and the model has to learn everything from spelling to syntax purely from statistical patterns. It is a harder task for the model but a cleaner one for the person studying it. Second, the corpus had to be long, syntactically demanding, and something I actually knew well enough to judge the output. Marcel Proust's "In Search of Lost Time" in Spanish fit perfectly: seven volumes of famously long sentences full of subordinate clauses and parenthetical digressions, all public domain and available as born-digital ebooks. If the attention mechanism could handle Proust's prose across a 256-character context window, it was working. The result: a 419,840-parameter decoder-only transformer trained on 7.15 million characters, producing recognizably Proustian Spanish after a single epoch.

## Building it from first principles

The architecture is deliberately minimal -- just enough to learn, not so much that it becomes opaque. The model uses an embedding dimension of 128, two attention heads, two transformer blocks, a feedforward inner dimension of 512 (the standard 4x convention), a context window of 256 characters, and dropout at 0.1. That gives 419,840 trainable parameters, small enough to train in about thirty minutes on a free Colab T4 GPU. The shape flow tells the whole story: input tokens come in as (batch, 256), embedding and positional encoding expand them to (batch, 256, 128), the two transformer blocks preserve that shape, and the final projection produces (batch, 256, 94) -- logits over the full character vocabulary.

Before writing a single line of PyTorch, I implemented the full architecture in NumPy. No autograd, no magic. The embedding layer is a lookup table plus sinusoidal positional encoding using the original formula from "Attention Is All You Need." Multi-head attention means computing Q, K, and V projections, applying scaled dot-product attention with a causal mask, then concatenating the heads back together. The transformer blocks combine attention with a feedforward network, residual connections, and layer normalization. The causal mask itself is just an upper triangular matrix filled with negative infinity so that position i can only attend to positions 0 through i -- softmax turns those negative-infinity scores into zeros, no conditional logic needed.

Every file includes what I call "Class Notes" -- comment blocks that explain the concept before the code appears. The goal was for anyone with basic linear algebra to follow the logic:

```python
# Attention: softmax(QK^T / sqrt(d_k)) * V
# Q, K, V are linear projections of the input
# sqrt(d_k) scales scores to prevent softmax saturation
#   (when d_k is large, dot products grow in magnitude
#    proportional to sqrt(d_k), pushing softmax into regions
#    with near-zero gradients)
```

Every operation carries shape annotations so you can trace the tensor dimensions through the entire forward pass. Once the NumPy version worked and I understood each matrix multiplication, the PyTorch port was mechanical: same variable names, same structure, only swapping `np.ndarray` for `torch.Tensor` and manual operations for `nn.Linear`. The understanding came from NumPy; PyTorch just gave me a GPU.

## Data, training, and what came out

The corpus went through two distinct lives. The first version pulled two volumes from Project Gutenberg, but OCR noise, publisher watermarks, and metadata leaking into the text inflated the vocabulary to over 200 characters and planted spurious patterns everywhere. The final version came from all seven volumes extracted directly from MOBI ebooks -- born-digital text with no scanning artifacts. After cleaning through a character whitelist and verifying that no publisher metadata leaked through, I had 7.15 MB of clean text and a tight 94-character vocabulary. The `ProustDataset` class generates sliding windows of 256 characters with targets shifted by one position, standard teacher forcing.

Training used AdamW with a learning rate of 3e-4 and weight decay of 0.01, a cosine annealing schedule with 500 steps of linear warmup, and gradient clipping at a max norm of 1.0. The data was split 90/10 for training and validation. After one full epoch -- 201,104 steps across the entire corpus -- the results looked like this:

| Metric | Value |
|--------|-------|
| Training loss | 1.348 |
| Validation loss | 1.192 |

Validation loss being lower than training loss looks counterintuitive at first, but it makes sense once you remember dropout: during training, random neurons are deactivated as regularization, while during validation the model uses its full capacity.

At temperature 0.8 with top-k 40, the model generates text that is recognizably Spanish and recognizably Proustian in its cadence, even if it cannot sustain coherence for long.

**Prompt**: "Mucho tiempo" (A long time)

> Mucho tiempo verdad, sin sus muchos que esa cortina de los personas con las que el senor. Es que lo que el amor que acababa de propio de la imaginacion y que habia causado una gran modo de olvidarla o de vida reductamente el mio). Por eso, mi madre sistencia desconocida con frecuencia, no hubiera ido a consider

The opening phrase is one of the most famous in all of French literature -- "Longtemps, je me suis couche de bonne heure" -- and the model picks up the thread with vocabulary that belongs squarely in Proust's world: imaginacion, amor, frecuencia, madre. It produces subordinate clauses and parenthetical asides that mirror the original style. The grammar is mostly correct -- subject-verb-complement order, reasonable gender agreement -- but the sentence loses its semantic thread after the first few clauses. It starts well and drifts.

**Prompt**: "La memoria" (Memory)

> La memoria y su pasad se sigue, por ejemplo, senora aun sin embargo, al menos encontrar a la Sra. de Guermantes me permanecia yo saber que el mismo seguro, pero en el que, si bien buscar con frecuencia venir a veces a un cual se debe tanto para salir y no podia hacer ella su disposicion con la sociedad, por l

Here the model surfaces actual character names -- Sra. de Guermantes -- learned purely from statistical frequency. It deploys "sin embargo" and "por ejemplo" as connective tissue, just as Proust does, and builds a sentence that keeps subordinating itself deeper, which is the signature Proustian move. But it cannot close its own structures: the parentheses stay open, the sentence never resolves. With 420K parameters and a single epoch of training, that is roughly what you would expect. The model has captured the music of the prose without yet learning its grammar of resolution.

## What I actually learned

The mathematical elegance of transformers only becomes visible when you implement them by hand. Scaling attention scores by the square root of the key dimension is not just a convention -- it is an exercise in the variance of sums of random variables. Without it, dot products grow with the dimension, softmax saturates, and gradients vanish. Deriving that justification from first principles was one of the most satisfying parts of the project. The causal mask is similarly elegant: adding negative infinity to future positions and letting softmax do the rest means autoregressive generation requires no conditional logic at all, just linear algebra. And residual connections, which I had always thought of as a nice-to-have, turn out to be the reason deep transformers are trainable in the first place. Without them, the gradient signal has to traverse every layer; with them, there is a direct shortcut that keeps information flowing.

On the training side, I learned that warmup is not optional. Without those first 500 steps of gradually increasing the learning rate, the initial high-rate updates destroy the randomly initialized weights before they have a chance to organize. Gradient clipping at a norm of 1.0 was similarly essential -- with long sequences and attention, gradients can grow fast, and clipping keeps the whole process stable. Perhaps the most surprising lesson was that a single epoch was enough for interesting results. With 7.15 MB of text and 256-character windows generating roughly 28,000 batches, the model captures genuine linguistic patterns without overfitting. More epochs would almost certainly improve coherence, but one was enough to demonstrate that the architecture works.

The data quality lesson was the starkest of all. The first corpus version, built from noisy OCR scans, produced an inflated vocabulary and taught the model to faithfully reproduce scanning artifacts. Switching to born-digital MOBI extraction cut the vocabulary from over 200 characters to 94 and improved everything downstream. Born-digital text is always better than OCR, full stop. If the next version of this project teaches me anything new, it will probably come from training more epochs (five to ten would likely improve long-range coherence significantly), switching to pre-norm layer normalization for better stability when scaling to more layers, experimenting with BPE tokenization to capture Spanish morphology, and finally visualizing the attention maps to see what patterns each head actually learns -- the infrastructure for that is built but unexplored.

## Closing

This project connects to a thread that runs through my other work. The logic of decision under uncertainty -- central in the credit risk model where a GLM assigns default probabilities, and in the Bayesian versus frequentist A/B testing framework where you choose between two options with incomplete information -- is the same logic governing how a transformer weighs its attention: it assigns probabilities and chooses. The data handling discipline (cleaning, validation, splits) carries over from every data project in the portfolio. The complete code, with shape annotations on every operation, is in the [GitHub repository](https://github.com/GonorAndres/proust-attention).

---

*A 420K-parameter model won't write like Proust. But building it from the first matrix multiplication to the last generated sample gave me something more valuable: the intuition to know what's happening when a language model fails -- and how to fix it.*
