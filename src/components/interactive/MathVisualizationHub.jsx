import React, { useState } from 'react';

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function MathVisualizationHub() {
  const [currentProblem, setCurrentProblem] = useState(null);

  if (currentProblem === 'sinx-x') {
    return <SinXOverXDemo onBack={() => setCurrentProblem(null)} />;
  }

  if (currentProblem === 'derivative-sin') {
    return <DerivativeSinDemo onBack={() => setCurrentProblem(null)} />;
  }

  if (currentProblem === 'euler-identity') {
    return <EulerIdentityDemo onBack={() => setCurrentProblem(null)} />;
  }

  return <LandingPage onSelectProblem={setCurrentProblem} />;
}

// ============================================================================
// LANDING PAGE
// ============================================================================
function LandingPage({ onSelectProblem }) {
  const problems = [
    {
      id: 'sinx-x',
      title: 'lím sin(x)/x = 1',
      category: 'Límites',
      description: 'Demostración geométrica del límite fundamental trigonométrico mediante comparación de áreas y el teorema del encaje.',
      consequences: [
        'Derivada de sin(x)',
        'Derivada de cos(x)',
        'Series de Taylor trigonométricas'
      ],
      difficulty: 'Intermedio',
      status: 'complete'
    },
    {
      id: 'derivative-sin',
      title: 'd/dx sin(x) = cos(x)',
      category: 'Derivadas',
      description: 'Derivación formal de la función seno utilizando la definición de derivada y el límite sin(x)/x.',
      consequences: [
        'Derivadas de funciones trigonométricas',
        'Ecuaciones diferenciales armónicas',
        'Modelado de oscilaciones'
      ],
      difficulty: 'Intermedio',
      prereq: 'sinx-x',
      status: 'complete'
    },
    {
      id: 'euler-identity',
      title: 'e^(ix) = cos(x) + i·sin(x)',
      category: 'Análisis Complejo',
      description: 'Visualización de la fórmula de Euler y su conexión con el movimiento circular en el plano complejo.',
      consequences: [
        'Identidad de Euler: e^(iπ) + 1 = 0',
        'Representación polar de complejos',
        'Transformada de Fourier'
      ],
      difficulty: 'Avanzado',
      status: 'complete'
    },
    {
      id: 'taylor-series',
      title: 'Series de Taylor',
      category: 'Series',
      description: 'Aproximación de funciones mediante polinomios y convergencia de series de potencias.',
      consequences: [
        'Cálculo numérico de funciones',
        'Aproximaciones lineales y cuadráticas',
        'Análisis de errores'
      ],
      difficulty: 'Avanzado',
      status: 'coming'
    },
    {
      id: 'fundamental-theorem',
      title: 'Teorema Fundamental del Cálculo',
      category: 'Integración',
      description: 'Conexión entre diferenciación e integración como operaciones inversas.',
      consequences: [
        'Evaluación de integrales definidas',
        'Funciones de acumulación',
        'Teorema del valor medio integral'
      ],
      difficulty: 'Intermedio',
      status: 'coming'
    }
  ];

  const categories = [...new Set(problems.map(p => p.category))];

  return (
    <div className="text-navy">
      {/* Main content */}
      <div className="max-w-5xl mx-auto">

        {/* Introduction */}
        <section className="mb-12 p-6 bg-navy rounded-xl border border-amber/20">
          <h2 className="text-xl font-serif font-semibold mb-4 text-navy">Estructura pedagógica</h2>
          <p className="text-navy/70 mb-4">
            Cada demostración sigue una estructura de tres componentes:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-navy rounded-lg">
              <div className="text-terracotta font-semibold mb-2">1. Planteamiento</div>
              <p className="text-sm text-cream/60">
                Formulación rigurosa del problema y contexto matemático.
              </p>
            </div>
            <div className="p-4 bg-navy rounded-lg">
              <div className="text-amber font-semibold mb-2">2. Visualización</div>
              <p className="text-sm text-cream/60">
                Representación geométrica interactiva que ilustra la demostración.
              </p>
            </div>
            <div className="p-4 bg-navy rounded-lg">
              <div className="text-sage font-semibold mb-2">3. Consecuencias</div>
              <p className="text-sm text-cream/60">
                Aplicaciones y teoremas derivados del resultado.
              </p>
            </div>
          </div>
        </section>

        {/* Dependency graph */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-semibold mb-4 text-navy">Grafo de dependencias</h2>
          <div className="p-6 bg-navy rounded-xl border border-amber/20">
            <svg viewBox="0 0 600 120" className="w-full max-w-2xl mx-auto">
              {/* Nodes */}
              <g className="cursor-pointer" onClick={() => onSelectProblem('sinx-x')}>
                <rect x="20" y="40" width="120" height="40" rx="6" fill="#C17654" />
                <text x="80" y="65" textAnchor="middle" fill="white" fontSize="12">lím sin(x)/x</text>
              </g>

              <g className="cursor-pointer" onClick={() => onSelectProblem('derivative-sin')}>
                <rect x="200" y="40" width="120" height="40" rx="6" fill="#D4A574" />
                <text x="260" y="65" textAnchor="middle" fill="#1B2A4A" fontSize="12" fontWeight="bold">d/dx sin(x)</text>
              </g>

              <g className="cursor-pointer" onClick={() => onSelectProblem('euler-identity')}>
                <rect x="380" y="40" width="120" height="40" rx="6" fill="#7A8B6F" />
                <text x="440" y="58" textAnchor="middle" fill="white" fontSize="11">e^(ix) = </text>
                <text x="440" y="72" textAnchor="middle" fill="white" fontSize="11">cos + i·sin</text>
              </g>

              {/* Arrows */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#D4A574" />
                </marker>
              </defs>
              <line x1="140" y1="60" x2="195" y2="60" stroke="#D4A574" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="320" y1="60" x2="375" y2="60" stroke="#D4A574" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </svg>
            <p className="text-center text-sm text-cream/40 mt-4">
              Las flechas indican dependencia conceptual entre demostraciones
            </p>
          </div>
        </section>

        {/* Problem cards by category */}
        {categories.map(category => (
          <section key={category} className="mb-10">
            <h2 className="text-lg font-serif font-semibold mb-4 text-navy/80">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problems.filter(p => p.category === category).map(problem => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onSelect={() => problem.status === 'complete' && onSelectProblem(problem.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function ProblemCard({ problem, onSelect }) {
  const isComplete = problem.status === 'complete';

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-xl border transition-all ${
        isComplete
          ? 'bg-cream border-amber/30 hover:border-terracotta/50 hover:shadow-md cursor-pointer'
          : 'bg-cream/50 border-navy/10 opacity-60'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-serif font-semibold text-navy">{problem.title}</h3>
        {!isComplete && (
          <span className="text-xs px-2 py-1 bg-navy/60 rounded text-cream/40">Próximamente</span>
        )}
      </div>

      <p className="text-sm text-navy/60 mb-4">{problem.description}</p>

      <div className="space-y-2">
        <div className="text-xs text-navy/40">Consecuencias:</div>
        <div className="flex flex-wrap gap-1">
          {problem.consequences.slice(0, 2).map((c, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-sage/15 rounded text-sage">
              {c}
            </span>
          ))}
          {problem.consequences.length > 2 && (
            <span className="text-xs px-2 py-1 text-navy/40">
              +{problem.consequences.length - 2} más
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-amber/10 flex justify-between text-xs text-navy/40">
        <span>Dificultad: {problem.difficulty}</span>
        {isComplete && <span className="text-terracotta">Ver demostración →</span>}
      </div>
    </div>
  );
}

// ============================================================================
// SIN(X)/X LIMIT DEMO
// ============================================================================
function SinXOverXDemo({ onBack }) {
  const [step, setStep] = useState(0);
  const [angle, setAngle] = useState(0.8);

  const totalSteps = 6;

  const width = 380;
  const height = 300;
  const cx = 150;
  const cy = 150;
  const r = 110;

  const O = { x: cx, y: cy };
  const A = { x: cx + r, y: cy };
  const B = { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
  const C = { x: cx + r, y: cy - r * Math.tan(angle) };

  const sectorPath = `M ${O.x} ${O.y} L ${A.x} ${A.y} A ${r} ${r} 0 0 0 ${B.x} ${B.y} Z`;

  const sinVal = Math.sin(angle);
  const cosVal = Math.cos(angle);
  const sinOverX = sinVal / angle;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const steps = [
    {
      title: "Planteamiento del problema",
      content: (
        <div className="space-y-4">
          <div className="text-xl text-center my-6 p-4 bg-navy rounded-lg text-terracotta font-mono">
            lím<sub>x→0</sub> sin(x)/x = ?
          </div>
          <p>
            La evaluación directa en x = 0 produce la forma indeterminada 0/0,
            lo cual impide el cálculo algebraico inmediato.
          </p>
          <p>
            Emplearemos un argumento geométrico basado en la comparación de áreas
            en el círculo unitario, seguido de una aplicación del teorema del encaje.
          </p>
          <p className="text-navy/50 text-sm">
            Este límite es fundamental: constituye la base para derivar las
            funciones trigonométricas.
          </p>
        </div>
      ),
      showCircle: false
    },
    {
      title: "Construcción geométrica",
      content: (
        <div className="space-y-4">
          <p>
            Sea S¹ el círculo unitario. Para x ∈ (0, π/2), definimos:
          </p>
          <ul className="space-y-2 ml-4 text-sm">
            <li><span className="text-navy font-bold">A = (1, 0)</span> — punto sobre el eje de abscisas</li>
            <li><span className="text-amber font-bold">B = (cos x, sin x)</span> — punto sobre S¹ a ángulo x</li>
            <li><span className="text-terracotta font-bold">C = (1, tan x)</span> — intersección del radio extendido con la tangente x = 1</li>
          </ul>
          <p className="text-navy/50 text-sm mt-4">
            C pertenece a la recta tangente al círculo en A, no al círculo mismo.
          </p>
        </div>
      ),
      showCircle: true
    },
    {
      title: "Comparación de áreas",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Tres regiones anidadas con el mismo ángulo x:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber/60"></div>
              <span className="text-sm"><b>△OAB:</b> Área = sin(x)/2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sage/60"></div>
              <span className="text-sm"><b>Sector OAB:</b> Área = x/2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-terracotta/40"></div>
              <span className="text-sm"><b>△OAC:</b> Área = tan(x)/2</span>
            </div>
          </div>
          <p className="text-sm mt-3">
            Por inclusión: △OAB ⊂ Sector ⊂ △OAC
          </p>
          <div className="text-center p-3 bg-navy rounded-lg mt-3">
            <span className="text-amber">sin(x)/2</span>
            <span className="mx-2">&lt;</span>
            <span className="text-sage">x/2</span>
            <span className="mx-2">&lt;</span>
            <span className="text-terracotta">tan(x)/2</span>
          </div>
        </div>
      ),
      showCircle: true,
      showTriangleOAB: true,
      showSector: true,
      showTriangleOAC: true
    },
    {
      title: "Derivación algebraica",
      content: (
        <div className="space-y-3 text-sm">
          <p>Multiplicando por 2:</p>
          <div className="text-center py-2">sin(x) &lt; x &lt; tan(x)</div>

          <p>Dividiendo entre sin(x) &gt; 0:</p>
          <div className="text-center py-2">1 &lt; x/sin(x) &lt; 1/cos(x)</div>

          <p>Tomando recíprocos:</p>
          <div className="text-center p-3 bg-terracotta/10 rounded-lg border border-terracotta/30 mt-2">
            <span className="text-amber">cos(x)</span>
            <span className="mx-2">&lt;</span>
            <span className="text-terracotta font-bold">sin(x)/x</span>
            <span className="mx-2">&lt;</span>
            <span>1</span>
          </div>

          <p className="text-navy/50 mt-3">
            Válido ∀x ∈ (0, π/2). Por paridad, también para x ∈ (-π/2, 0).
          </p>
        </div>
      ),
      showCircle: true,
      showTriangleOAB: true,
      showSector: true,
      showTriangleOAC: true
    },
    {
      title: "Teorema del encaje",
      content: (
        <div className="space-y-4">
          <p className="text-sm">Evaluando límites de las cotas cuando x → 0:</p>
          <div className="p-3 bg-navy rounded-lg font-mono text-sm space-y-1">
            <div>lím<sub>x→0</sub> cos(x) = 1</div>
            <div>lím<sub>x→0</sub> 1 = 1</div>
          </div>
          <p className="text-sm">
            Ambas cotas convergen al mismo valor. Por el teorema del encaje:
          </p>
          <div className="text-center text-xl p-4 bg-gradient-to-r from-terracotta/20 to-amber/20 rounded-lg border border-terracotta/40">
            lím<sub>x→0</sub> sin(x)/x = <span className="text-terracotta font-bold">1</span>
          </div>
        </div>
      ),
      showCircle: true,
      showTriangleOAB: true,
      showSector: true,
      showTriangleOAC: true,
      showSqueeze: true
    },
    {
      title: "Consecuencias",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-navy/50">Este límite fundamental permite demostrar:</p>

          <div className="space-y-3">
            <div className="p-3 bg-navy rounded-lg">
              <div className="font-semibold text-amber mb-1">Derivada del seno</div>
              <div className="font-mono text-sm">d/dx sin(x) = cos(x)</div>
            </div>

            <div className="p-3 bg-navy rounded-lg">
              <div className="font-semibold text-sage mb-1">Derivada del coseno</div>
              <div className="font-mono text-sm">d/dx cos(x) = -sin(x)</div>
            </div>

            <div className="p-3 bg-navy rounded-lg">
              <div className="font-semibold text-terracotta mb-1">Límite relacionado</div>
              <div className="font-mono text-sm">lím<sub>x→0</sub> (1-cos(x))/x = 0</div>
            </div>

            <div className="p-3 bg-navy rounded-lg">
              <div className="font-semibold text-amber mb-1">Serie de Taylor</div>
              <div className="font-mono text-sm">sin(x) = x - x³/3! + x⁵/5! - ...</div>
            </div>
          </div>
        </div>
      ),
      showCircle: false
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 text-sm text-navy/50 hover:text-navy transition flex items-center gap-2"
        >
          ← Volver al índice
        </button>

        {/* Progress */}
        <div className="flex gap-1 mb-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i <= step ? 'bg-terracotta' : 'bg-navy/20'}`} />
          ))}
        </div>

        <div className="text-sm text-navy/40 mb-2">Paso {step + 1} de {totalSteps}</div>
        <h1 className="text-xl font-serif font-bold mb-4 text-terracotta">{currentStep.title}</h1>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-navy/80 leading-relaxed">{currentStep.content}</div>

          <div className="flex flex-col items-center">
            {currentStep.showCircle ? (
              <>
                <svg width={width} height={height} className="bg-navy rounded-lg">
                  <line x1={cx-r-10} y1={cy} x2={cx+r+30} y2={cy} stroke="#D4A574" strokeWidth="1" opacity="0.3"/>
                  <line x1={cx} y1={cy-r-10} x2={cx} y2={cy+r+10} stroke="#D4A574" strokeWidth="1" opacity="0.3"/>
                  <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D4A574" strokeWidth="2" opacity="0.4"/>
                  <line x1={A.x} y1={cy-r-20} x2={A.x} y2={cy+30} stroke="#D4A574" strokeWidth="1" strokeDasharray="4" opacity="0.3"/>

                  {currentStep.showTriangleOAC && (
                    <polygon points={`${O.x},${O.y} ${A.x},${A.y} ${C.x},${C.y}`} fill="rgba(193, 118, 84, 0.15)" stroke="#C17654" strokeWidth="2"/>
                  )}
                  {currentStep.showSector && (
                    <path d={sectorPath} fill="rgba(122, 139, 111, 0.2)" stroke="#7A8B6F" strokeWidth="2"/>
                  )}
                  {currentStep.showTriangleOAB && (
                    <polygon points={`${O.x},${O.y} ${A.x},${A.y} ${B.x},${B.y}`} fill="rgba(212, 165, 116, 0.35)" stroke="#D4A574" strokeWidth="2"/>
                  )}

                  <line x1={O.x} y1={O.y} x2={C.x} y2={C.y} stroke="#D4A574" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>

                  <circle cx={O.x} cy={O.y} r="4" fill="#FFF8F0"/>
                  <circle cx={A.x} cy={A.y} r="4" fill="#FFF8F0"/>
                  <circle cx={B.x} cy={B.y} r="4" fill="#D4A574"/>
                  <circle cx={C.x} cy={C.y} r="4" fill="#C17654"/>

                  <text x={O.x - 15} y={O.y + 4} fill="#FFF8F0" fontSize="12">O</text>
                  <text x={A.x + 6} y={A.y + 4} fill="#FFF8F0" fontSize="12">A</text>
                  <text x={B.x - 18} y={B.y - 8} fill="#D4A574" fontSize="12">B</text>
                  <text x={C.x + 6} y={C.y + 4} fill="#C17654" fontSize="12">C</text>

                  <path d={`M ${cx + 25} ${cy} A 25 25 0 0 0 ${cx + 25*Math.cos(angle)} ${cy - 25*Math.sin(angle)}`} fill="none" stroke="#FFF8F0" strokeWidth="1"/>
                  <text x={cx + 32} y={cy - 10} fill="#FFF8F0" fontSize="11">x</text>
                </svg>

                <div className="mt-3 w-full max-w-xs">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-navy/60">x = {angle.toFixed(3)} rad</span>
                    <span className="text-navy/40">{(angle * 180 / Math.PI).toFixed(1)}°</span>
                  </div>
                  <input type="range" min="0.05" max="1.4" step="0.01" value={angle}
                    onChange={(e) => setAngle(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-navy/50 accent-terracotta"/>
                </div>

                {currentStep.showSqueeze && (
                  <div className="mt-4 w-full max-w-xs p-3 bg-navy rounded-lg">
                    <div className="text-xs text-navy/40 mb-2 text-center">Acotamiento:</div>
                    <div className="flex items-center gap-1 justify-center text-sm font-mono">
                      <span className="text-amber">{cosVal.toFixed(4)}</span>
                      <span className="text-cream/40">&lt;</span>
                      <span className="text-terracotta font-bold">{sinOverX.toFixed(4)}</span>
                      <span className="text-cream/40">&lt;</span>
                      <span className="text-cream">1</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-64 w-full bg-navy rounded-lg">
                <div className="text-6xl text-navy/20">∫</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-amber/20">
          <button onClick={prevStep} disabled={step === 0}
            className={`px-5 py-2 rounded-lg text-sm ${step === 0 ? 'bg-navy/10 text-navy/30' : 'bg-navy hover:bg-navy/90 text-cream'}`}>
            ← Anterior
          </button>
          <button onClick={nextStep} disabled={step === totalSteps - 1}
            className={`px-5 py-2 rounded-lg text-sm ${step === totalSteps - 1 ? 'bg-navy/10 text-navy/30' : 'bg-terracotta hover:bg-terracotta/80 text-cream'}`}>
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DERIVATIVE OF SIN(X) DEMO
// ============================================================================
function DerivativeSinDemo({ onBack }) {
  const [step, setStep] = useState(0);
  const [h, setH] = useState(0.5);
  const [x0] = useState(0.8);

  const totalSteps = 5;

  const gw = 350;
  const gh = 200;
  const padding = 40;

  const scaleX = (x) => padding + (x + 0.5) * (gw - 2*padding) / 4;
  const scaleY = (y) => gh - padding - (y + 1.2) * (gh - 2*padding) / 2.4;

  const sinPoints = [];
  for (let x = -0.3; x <= 3.5; x += 0.05) {
    sinPoints.push({ x, y: Math.sin(x) });
  }
  const sinPath = sinPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');

  const y0 = Math.sin(x0);
  const y1 = Math.sin(x0 + h);
  const slope = (y1 - y0) / h;
  const actualSlope = Math.cos(x0);

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const steps = [
    {
      title: "Definición de derivada",
      content: (
        <div className="space-y-4">
          <p>La derivada de f(x) en un punto x₀ se define como:</p>
          <div className="text-center p-4 bg-navy rounded-lg font-mono">
            f'(x₀) = lím<sub>h→0</sub> [f(x₀+h) - f(x₀)] / h
          </div>
          <p>
            Geométricamente, esto representa el límite de las pendientes de las
            rectas secantes cuando h tiende a cero, convergiendo a la pendiente
            de la recta tangente.
          </p>
          <p className="text-sm text-navy/50">
            Aplicaremos esta definición a f(x) = sin(x).
          </p>
        </div>
      )
    },
    {
      title: "Expansión trigonométrica",
      content: (
        <div className="space-y-4">
          <p>Para f(x) = sin(x), calculamos el cociente diferencial:</p>
          <div className="p-4 bg-navy rounded-lg font-mono text-sm space-y-2">
            <div>[sin(x+h) - sin(x)] / h</div>
          </div>
          <p>Aplicando la identidad de suma del seno:</p>
          <div className="p-3 bg-navy/60 rounded text-sm font-mono">
            sin(x+h) = sin(x)cos(h) + cos(x)sin(h)
          </div>
          <p>Sustituyendo:</p>
          <div className="p-4 bg-navy rounded-lg font-mono text-sm">
            = [sin(x)cos(h) + cos(x)sin(h) - sin(x)] / h
          </div>
        </div>
      )
    },
    {
      title: "Factorización",
      content: (
        <div className="space-y-4">
          <p>Reorganizando términos:</p>
          <div className="p-4 bg-navy rounded-lg font-mono text-sm space-y-2">
            <div>= [sin(x)(cos(h) - 1) + cos(x)sin(h)] / h</div>
            <div className="mt-3 pt-3 border-t border-amber/20">
              = sin(x) · <span className="text-amber">(cos(h)-1)/h</span> + cos(x) · <span className="text-terracotta">sin(h)/h</span>
            </div>
          </div>
          <p>
            Hemos separado la expresión en dos términos, cada uno conteniendo
            un límite fundamental.
          </p>
        </div>
      )
    },
    {
      title: "Evaluación de límites",
      content: (
        <div className="space-y-4">
          <p>Aplicamos los límites conocidos cuando h → 0:</p>
          <div className="space-y-3">
            <div className="p-3 bg-terracotta/10 rounded-lg border border-terracotta/30">
              <span className="text-terracotta">lím<sub>h→0</sub> sin(h)/h = 1</span>
              <span className="text-navy/40 text-sm ml-2">(demostrado previamente)</span>
            </div>
            <div className="p-3 bg-amber/10 rounded-lg border border-amber/30">
              <span className="text-amber">lím<sub>h→0</sub> (cos(h)-1)/h = 0</span>
              <span className="text-navy/40 text-sm ml-2">(consecuencia del anterior)</span>
            </div>
          </div>
          <p>Sustituyendo:</p>
          <div className="p-4 bg-navy rounded-lg font-mono">
            = sin(x) · <span className="text-amber">0</span> + cos(x) · <span className="text-terracotta">1</span> = cos(x)
          </div>
        </div>
      )
    },
    {
      title: "Resultado y visualización",
      content: (
        <div className="space-y-4">
          <div className="text-center text-xl p-4 bg-gradient-to-r from-amber/20 to-terracotta/20 rounded-lg border border-amber/40">
            d/dx sin(x) = <span className="text-amber font-bold">cos(x)</span>
          </div>
          <p className="text-sm">
            La pendiente de la recta secante (en <span className="text-amber">ámbar</span>)
            converge a la pendiente de la tangente cuando h → 0.
          </p>
          <div className="p-3 bg-navy rounded-lg text-sm font-mono">
            <div>Pendiente secante: <span className="text-amber">{slope.toFixed(4)}</span></div>
            <div>Pendiente tangente: <span className="text-sage">{actualSlope.toFixed(4)}</span></div>
            <div className="text-navy/40">Error: {Math.abs(slope - actualSlope).toFixed(6)}</div>
          </div>
        </div>
      ),
      showGraph: true
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-4 px-4 py-2 text-sm text-navy/50 hover:text-navy transition">
          ← Volver al índice
        </button>

        <div className="flex gap-1 mb-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i <= step ? 'bg-amber' : 'bg-navy/20'}`} />
          ))}
        </div>

        <div className="text-sm text-navy/40 mb-2">Paso {step + 1} de {totalSteps}</div>
        <h1 className="text-xl font-serif font-bold mb-4 text-amber">{currentStep.title}</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-navy/80 leading-relaxed">{currentStep.content}</div>

          <div className="flex flex-col items-center">
            {currentStep.showGraph ? (
              <>
                <svg width={gw} height={gh} className="bg-navy rounded-lg">
                  <line x1={padding} y1={scaleY(0)} x2={gw-padding} y2={scaleY(0)} stroke="#D4A574" strokeWidth="1" opacity="0.3"/>
                  <line x1={scaleX(0)} y1={padding} x2={scaleX(0)} y2={gh-padding} stroke="#D4A574" strokeWidth="1" opacity="0.3"/>

                  <path d={sinPath} fill="none" stroke="#C17654" strokeWidth="2"/>

                  <line
                    x1={scaleX(x0 - 0.5)} y1={scaleY(y0 - 0.5 * slope)}
                    x2={scaleX(x0 + h + 0.5)} y2={scaleY(y0 + (h + 0.5) * slope)}
                    stroke="#D4A574" strokeWidth="2" strokeDasharray="4"
                  />

                  <line
                    x1={scaleX(x0 - 0.5)} y1={scaleY(y0 - 0.5 * actualSlope)}
                    x2={scaleX(x0 + 1)} y2={scaleY(y0 + 1 * actualSlope)}
                    stroke="#7A8B6F" strokeWidth="2"
                  />

                  <circle cx={scaleX(x0)} cy={scaleY(y0)} r="5" fill="#FFF8F0"/>
                  <circle cx={scaleX(x0 + h)} cy={scaleY(y1)} r="5" fill="#D4A574"/>

                  <text x={scaleX(x0) - 5} y={scaleY(y0) - 10} fill="#FFF8F0" fontSize="11">x₀</text>
                  <text x={scaleX(x0 + h) + 5} y={scaleY(y1) - 5} fill="#D4A574" fontSize="11">x₀+h</text>
                </svg>

                <div className="mt-3 w-full max-w-xs space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-navy/60">h = {h.toFixed(3)}</span>
                    </div>
                    <input type="range" min="0.01" max="1.5" step="0.01" value={h}
                      onChange={(e) => setH(parseFloat(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-navy/50 accent-amber"/>
                    <div className="text-xs text-navy/40 mt-1">Reduce h para ver la convergencia</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 w-full bg-navy rounded-lg">
                <div className="text-4xl text-navy/20">d/dx</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-amber/20">
          <button onClick={prevStep} disabled={step === 0}
            className={`px-5 py-2 rounded-lg text-sm ${step === 0 ? 'bg-navy/10 text-navy/30' : 'bg-navy hover:bg-navy/90 text-cream'}`}>
            ← Anterior
          </button>
          <button onClick={nextStep} disabled={step === totalSteps - 1}
            className={`px-5 py-2 rounded-lg text-sm ${step === totalSteps - 1 ? 'bg-navy/10 text-navy/30' : 'bg-amber hover:bg-amber/80 text-navy'}`}>
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EULER'S IDENTITY DEMO
// ============================================================================
function EulerIdentityDemo({ onBack }) {
  const [step, setStep] = useState(0);
  const [theta, setTheta] = useState(0);
  const [animating, setAnimating] = useState(false);

  const totalSteps = 5;

  React.useEffect(() => {
    if (!animating) return;
    const interval = setInterval(() => {
      setTheta(t => (t + 0.03) % (2 * Math.PI));
    }, 30);
    return () => clearInterval(interval);
  }, [animating]);

  const width = 350;
  const height = 300;
  const cx = 175;
  const cy = 150;
  const r = 100;

  const realPart = Math.cos(theta);
  const imagPart = Math.sin(theta);
  const pointX = cx + r * realPart;
  const pointY = cy - r * imagPart;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const steps = [
    {
      title: "La fórmula de Euler",
      content: (
        <div className="space-y-4">
          <div className="text-center text-xl p-4 bg-navy rounded-lg">
            e<sup>ix</sup> = cos(x) + i·sin(x)
          </div>
          <p>
            Esta fórmula establece una conexión profunda entre la función
            exponencial y las funciones trigonométricas a través de los
            números complejos.
          </p>
          <p>
            Geométricamente, e<sup>ix</sup> describe un punto que se mueve
            sobre el círculo unitario en el plano complejo conforme x varía.
          </p>
        </div>
      )
    },
    {
      title: "El plano complejo",
      content: (
        <div className="space-y-4">
          <p>
            Un número complejo z = a + bi se representa como un punto en el plano:
          </p>
          <ul className="space-y-2 ml-4 text-sm">
            <li>Eje horizontal (Re): parte real a</li>
            <li>Eje vertical (Im): parte imaginaria b</li>
          </ul>
          <p>
            El número e<sup>iθ</sup> tiene:
          </p>
          <div className="p-3 bg-navy rounded-lg font-mono text-sm">
            <div>Re(e<sup>iθ</sup>) = cos(θ) = <span className="text-amber">{realPart.toFixed(4)}</span></div>
            <div>Im(e<sup>iθ</sup>) = sin(θ) = <span className="text-sage">{imagPart.toFixed(4)}</span></div>
          </div>
        </div>
      ),
      showPlane: true
    },
    {
      title: "Movimiento circular",
      content: (
        <div className="space-y-4">
          <p>
            Conforme θ aumenta, el punto e<sup>iθ</sup> traza el círculo unitario
            en sentido antihorario.
          </p>
          <p>
            La velocidad angular es constante: cada incremento Δθ produce el
            mismo desplazamiento angular sobre el círculo.
          </p>
          <button
            onClick={() => setAnimating(!animating)}
            className={`px-4 py-2 rounded-lg text-sm ${animating ? 'bg-terracotta text-cream' : 'bg-sage text-cream'}`}
          >
            {animating ? 'Detener' : 'Animar'}
          </button>
          <p className="text-sm text-navy/50">
            Esto explica por qué las funciones trigonométricas aparecen
            naturalmente en fenómenos oscilatorios y ondulatorios.
          </p>
        </div>
      ),
      showPlane: true
    },
    {
      title: "Casos especiales",
      content: (
        <div className="space-y-3">
          <p className="text-sm">Evaluando en ángulos notables:</p>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-navy/80 rounded flex justify-between">
              <span>θ = 0:</span>
              <span className="font-mono">e<sup>i·0</sup> = 1</span>
            </div>
            <div className="p-2 bg-navy/80 rounded flex justify-between">
              <span>θ = π/2:</span>
              <span className="font-mono">e<sup>iπ/2</sup> = i</span>
            </div>
            <div className="p-2 bg-terracotta/20 border border-terracotta/40 rounded flex justify-between">
              <span>θ = π:</span>
              <span className="font-mono">e<sup>iπ</sup> = -1</span>
            </div>
            <div className="p-2 bg-navy/80 rounded flex justify-between">
              <span>θ = 3π/2:</span>
              <span className="font-mono">e<sup>i3π/2</sup> = -i</span>
            </div>
          </div>
          <p className="text-sm text-navy/50 mt-3">
            El caso θ = π produce la célebre identidad de Euler.
          </p>
        </div>
      ),
      showPlane: true
    },
    {
      title: "Identidad de Euler",
      content: (
        <div className="space-y-4">
          <p>De e<sup>iπ</sup> = -1 se obtiene:</p>
          <div className="text-center text-2xl p-6 bg-gradient-to-r from-terracotta/20 to-sage/20 rounded-lg border border-terracotta/40">
            e<sup>iπ</sup> + 1 = 0
          </div>
          <p className="text-sm">
            Esta ecuación conecta cinco constantes fundamentales de las matemáticas:
          </p>
          <div className="grid grid-cols-5 gap-2 text-center text-sm">
            <div className="p-2 bg-navy/80 rounded">
              <div className="text-lg">e</div>
              <div className="text-xs text-cream/60">Base natural</div>
            </div>
            <div className="p-2 bg-navy/80 rounded">
              <div className="text-lg">i</div>
              <div className="text-xs text-cream/40">Unidad imaginaria</div>
            </div>
            <div className="p-2 bg-navy/80 rounded">
              <div className="text-lg">π</div>
              <div className="text-xs text-cream/40">Razón circular</div>
            </div>
            <div className="p-2 bg-navy/80 rounded">
              <div className="text-lg">1</div>
              <div className="text-xs text-cream/40">Identidad mult.</div>
            </div>
            <div className="p-2 bg-navy/80 rounded">
              <div className="text-lg">0</div>
              <div className="text-xs text-cream/40">Identidad adit.</div>
            </div>
          </div>
        </div>
      ),
      showPlane: false
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-4 px-4 py-2 text-sm text-navy/50 hover:text-navy transition">
          ← Volver al índice
        </button>

        <div className="flex gap-1 mb-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i <= step ? 'bg-sage' : 'bg-navy/20'}`} />
          ))}
        </div>

        <div className="text-sm text-navy/40 mb-2">Paso {step + 1} de {totalSteps}</div>
        <h1 className="text-xl font-serif font-bold mb-4 text-sage">{currentStep.title}</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-navy/80 leading-relaxed">{currentStep.content}</div>

          <div className="flex flex-col items-center">
            {currentStep.showPlane ? (
              <>
                <svg width={width} height={height} className="bg-navy rounded-lg">
                  <line x1={30} y1={cy} x2={width-30} y2={cy} stroke="#D4A574" strokeWidth="1" opacity="0.3"/>
                  <line x1={cx} y1={30} x2={cx} y2={height-30} stroke="#D4A574" strokeWidth="1" opacity="0.3"/>

                  <text x={width-25} y={cy-5} fill="#D4A574" fontSize="12" opacity="0.5">Re</text>
                  <text x={cx+5} y={35} fill="#D4A574" fontSize="12" opacity="0.5">Im</text>

                  <circle cx={cx} cy={cy} r={r} fill="none" stroke="#D4A574" strokeWidth="2" opacity="0.4"/>

                  {theta > 0.01 && (
                    <path
                      d={`M ${cx + 30} ${cy} A 30 30 0 ${theta > Math.PI ? 1 : 0} 0 ${cx + 30*Math.cos(theta)} ${cy - 30*Math.sin(theta)}`}
                      fill="none" stroke="#7A8B6F" strokeWidth="2"
                    />
                  )}

                  <line x1={pointX} y1={pointY} x2={pointX} y2={cy} stroke="#D4A574" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
                  <line x1={pointX} y1={pointY} x2={cx} y2={pointY} stroke="#7A8B6F" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>

                  <line x1={cx} y1={cy} x2={pointX} y2={pointY} stroke="#7A8B6F" strokeWidth="2"/>

                  <circle cx={pointX} cy={pointY} r="6" fill="#7A8B6F"/>

                  <circle cx={cx+r} cy={cy} r="3" fill="#D4A574" opacity="0.5"/>
                  <circle cx={cx} cy={cy-r} r="3" fill="#D4A574" opacity="0.5"/>
                  <circle cx={cx-r} cy={cy} r="3" fill="#C17654"/>
                  <circle cx={cx} cy={cy+r} r="3" fill="#D4A574" opacity="0.5"/>

                  <text x={pointX + 10} y={pointY - 10} fill="#7A8B6F" fontSize="11">e^(iθ)</text>

                  <text x={cx+r+5} y={cy+15} fill="#D4A574" fontSize="10" opacity="0.5">1</text>
                  <text x={cx-r-10} y={cy+15} fill="#C17654" fontSize="10">-1</text>
                  <text x={cx+5} y={cy-r-5} fill="#D4A574" fontSize="10" opacity="0.5">i</text>
                  <text x={cx+5} y={cy+r+15} fill="#D4A574" fontSize="10" opacity="0.5">-i</text>
                </svg>

                <div className="mt-3 w-full max-w-xs">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-navy/60">θ = {theta.toFixed(3)} rad</span>
                    <span className="text-navy/40">{(theta * 180 / Math.PI).toFixed(1)}°</span>
                  </div>
                  <input type="range" min="0" max={2*Math.PI} step="0.01" value={theta}
                    onChange={(e) => { setAnimating(false); setTheta(parseFloat(e.target.value)); }}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-navy/50 accent-sage"/>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 w-full bg-navy rounded-lg">
                <div className="text-4xl font-serif text-terracotta">e<sup>iπ</sup> + 1 = 0</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-amber/20">
          <button onClick={prevStep} disabled={step === 0}
            className={`px-5 py-2 rounded-lg text-sm ${step === 0 ? 'bg-navy/10 text-navy/30' : 'bg-navy hover:bg-navy/90 text-cream'}`}>
            ← Anterior
          </button>
          <button onClick={nextStep} disabled={step === totalSteps - 1}
            className={`px-5 py-2 rounded-lg text-sm ${step === totalSteps - 1 ? 'bg-navy/10 text-navy/30' : 'bg-sage hover:bg-sage/80 text-cream'}`}>
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
