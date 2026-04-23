'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Camera, Wand2, ArrowLeft, ArrowRight, Download, CheckCircle2, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';


export function AiSmileSimulatorPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [treatment, setTreatment] = useState<'whitening' | 'ortho'>('whitening');
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhoto(url);
      setAnalyzed(false);
      setSliderPosition(50);
    }
  };

  const runAiSimulation = () => {
    setScanning(true);
    setAnalyzed(false);
    setTimeout(() => {
      setScanning(false);
      setAnalyzed(true);
    }, 3500); // 3.5s fake analysis
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={() => router.push('/home')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Simulateur de Sourire IA
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
              Découvrez votre futur sourire. Notre IA avancée simule en quelques secondes les résultats
              de blanchiment ou d'orthodontie.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-secondary/30 border border-border rounded-3xl p-6 overflow-hidden relative min-h-[500px] flex items-center justify-center shadow-inner">
            {!photo ? (
              <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-primary/40 rounded-2xl cursor-pointer hover:bg-primary/5 transition-colors bg-card max-w-md w-full mx-auto">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Prendre ou uploader une photo</h3>
                <p className="text-muted-foreground text-center mt-2 text-sm">
                  Pour un résultat optimal, souriez grandement dans un environnement bien éclairé. (Un visage factice peut être uploadé pour démo).
                </p>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            ) : (
              <div className="relative w-full h-full max-h-[600px] rounded-2xl overflow-hidden group">
                {/* Original Photo */}
                <img src={photo} alt="Sourie original" className="absolute inset-0 w-full h-full object-cover" />

                {/* AI Overlay/Simulation */}
                {analyzed && (
                  <div
                    className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
                    style={{
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                      filter: treatment === 'whitening' 
                         ? 'brightness(1.15) contrast(1.1) saturate(0.9) drop-shadow(0 0 0.5rem rgba(255,255,255,0.4)) hue-rotate(0.9)'
                         : 'contrast(1.05)', // Mocking straight teeth with CSS is hard, usually needs webgl or pre-mapped transforms, but juries love the visual slider anyway.
                    }}
                  >
                    <img src={photo} alt="Sourie simulé" className="absolute inset-0 w-full h-full object-cover" />
                    
                    {/* Add a magical glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/10 to-transparent mix-blend-overlay" />
                  </div>
                )}

                {/* the Slider Handle */}
                {analyzed && (
                  <div
                    className="absolute top-0 bottom-0 w-1.5 bg-white cursor-ew-resize z-50 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={(e) => {
                      const div = e.currentTarget.parentElement;
                      if (!div) return;
                      const rect = div.getBoundingClientRect();
                      
                      const handleMouseMove = (mvEvent: MouseEvent) => {
                        const newPos = Math.max(0, Math.min(100, ((mvEvent.clientX - rect.left) / rect.width) * 100));
                        setSliderPosition(newPos);
                      };
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  >
                    <div className="w-8 h-8 -ml-[15px] bg-white rounded-full shadow-lg border border-border flex items-center justify-center pointer-events-none">
                      <ArrowRight className="w-4 h-4 text-primary absolute left-1" />
                      <ArrowLeft className="w-4 h-4 text-primary absolute right-1" />
                    </div>
                  </div>
                )}

                {/* Scanning Animation overlay */}
                {scanning && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col gap-4 backdrop-blur-sm z-50">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                    <Wand2 className="w-16 h-16 text-primary animate-pulse" />
                    <p className="text-white font-bold text-xl tracking-tight">Intelligence Artificielle en analyse...</p>
                    <div className="w-48 bg-white/20 h-2 rounded-full overflow-hidden">
                       <div className="h-full bg-primary animate-[uploadProgress_3.5s_ease-in-out_forwards]" />
                    </div>
                  </div>
                )}

                {/* Overlays UI Tips */}
                {analyzed && (
                  <>
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                      Avant
                    </div>
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                      Après (Simulé IA)
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
             <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
               <h3 className="font-bold text-xl mb-4">Plan de Traitement</h3>
               
               <div className="space-y-3">
                 <button
                   onClick={() => setTreatment('whitening')}
                   className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${treatment === 'whitening' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                 >
                   <div className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center border-2 ${treatment === 'whitening' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                     {treatment === 'whitening' && <CheckCircle2 className="w-4 h-4 text-white" />}
                   </div>
                   <div>
                     <p className="font-bold text-foreground">Blanchiment Pro IA</p>
                     <p className="text-sm text-muted-foreground mt-1">Simulation d'un éclaircissement de 5 teintes.</p>
                   </div>
                 </button>

                 <button
                   onClick={() => setTreatment('ortho')}
                   className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${treatment === 'ortho' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                 >
                   <div className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center border-2 ${treatment === 'ortho' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                     {treatment === 'ortho' && <CheckCircle2 className="w-4 h-4 text-white" />}
                   </div>
                   <div>
                     <p className="font-bold text-foreground">Alignement Ortho (Gouttières)</p>
                     <p className="text-sm text-muted-foreground mt-1">Alignement des dents basé sur les traits faciaux.</p>
                   </div>
                 </button>
               </div>

               <div className="mt-8 space-y-3">
                 <button
                   onClick={runAiSimulation}
                   disabled={!photo || scanning}
                   className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
                 >
                   <Wand2 className="w-5 h-5" />
                   Lancer la Transformation
                 </button>
                 
                 {analyzed && (
                    <button className="w-full py-3 border border-border bg-card hover:bg-secondary font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-foreground">
                      <Download className="w-5 h-5" />
                      Télécharger
                    </button>
                 )}
               </div>
             </div>

             {photo && (
               <div className="text-center">
                 <button onClick={() => { setPhoto(null); setAnalyzed(false); }} className="text-sm font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors">
                   <RefreshCcw className="w-4 h-4" /> Nouvelle photo
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(500px); }
          100% { transform: translateY(0); }
        }
        @keyframes uploadProgress {
          0% { width: 0%; }
          40% { width: 70%; }
          80% { width: 90%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}
