'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Camera, Wand2, ArrowLeft, ArrowRight, Download, CheckCircle2, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Teeth3DViewer = dynamic(() => import('@/components/common/teeth-3d-model'), { ssr: false });

export function AiSmileSimulatorPage() {
  const router = useRouter();
  const { user } = useAppContext();
  const isDoctor = user?.role === 'Médecin';
  const isKidPatient = user?.role === 'Patient' && !!user?.isKid;
  const [photo, setPhoto] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [patientType, setPatientType] = useState<'adult' | 'kid'>(isKidPatient ? 'kid' : 'adult');
  const [selectedModel, setSelectedModel] = useState<'adult_api' | 'kid_api'>(isKidPatient ? 'kid_api' : 'adult_api');
  const [prediction, setPrediction] = useState<{ label: string, confidence: number } | null>(null);
  const [infectedTeethIds, setInfectedTeethIds] = useState<number[]>([]);

  useEffect(() => {
    if (isKidPatient) {
      setPatientType('kid');
      setSelectedModel('kid_api');
      return;
    }

    if (user?.role === 'Patient') {
      setPatientType('adult');
      setSelectedModel('adult_api');
      return;
    }

    if (isDoctor) {
      setPatientType('adult');
      setSelectedModel('adult_api');
    }
  }, [isDoctor, isKidPatient, user?.role]);

  const runAiSimulation = async (photoFile?: File, type?: 'adult' | 'kid') => {
    const targetFile = photoFile || file;
    const targetType = type || patientType;
    if (!targetFile) return;

    setScanning(true);
    setAnalyzed(false);
    setPrediction(null);

    try {
      const formData = new FormData();
      formData.append("file", targetFile);
      formData.append("patient_type", targetType);
      formData.append("model", selectedModel);
      if (user?.email) {
        formData.append("patient_email", user.email);
      }

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("AI Prediction Error");

      const data = await response.json();
      setPrediction({ label: data.prediction, confidence: data.confidence });
      setInfectedTeethIds(Array.isArray(data.infected_tooth_ids) ? data.infected_tooth_ids : []);

    } catch (error) {
      console.error(error);
      // Allow visual demo to proceed even if AI API is not running
      setPrediction({ label: "Erreur Analyse", confidence: 0 });
      setInfectedTeethIds([]);
    }

    setScanning(false);
    setAnalyzed(true);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const url = URL.createObjectURL(f);
      setPhoto(url);
      setAnalyzed(false);
      setPrediction(null);
      // Auto start simulation
      runAiSimulation(f, patientType);
    }
  };

  const changePatientType = (type: 'adult' | 'kid') => {
    if (!isDoctor) return;
    setPatientType(type);
    setSelectedModel(type === 'kid' ? 'kid_api' : 'adult_api');
    if (photo && file && analyzed) {
       runAiSimulation(file, type);
    }
  };

  const changeModel = (model: 'adult_api' | 'kid_api') => {
    if (!isDoctor) return;
    setSelectedModel(model);
    const nextType = model === 'kid_api' ? 'kid' : 'adult';
    setPatientType(nextType);
    if (photo && file && analyzed) {
      runAiSimulation(file, nextType);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <button
          onClick={() => router.push('/home')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold font-display bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">
              Analyse IA du sourire
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
              Choisissez le modèle adulte ou enfant, envoyez une radiographie, et visualisez immédiatement
              le résultat dans un espace large et lisible.
            </p>
          </div>
        </div>

        <div className="grid gap-8 items-start lg:grid-cols-[1.45fr_0.55fr]">
          <div className="bg-secondary/30 border border-border rounded-3xl p-6 overflow-hidden relative min-h-125 flex flex-col items-center justify-center shadow-inner gap-6">
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
              <>
                {!analyzed && (
                    <div className="relative w-full h-full min-h-112.5 max-h-150 rounded-2xl overflow-hidden group">
                    {/* Original Photo */}
                    <img src={photo} alt="Sourie original" className="absolute inset-0 w-full h-full object-cover" />

                    {/* Scanning Animation overlay */}
                    {scanning && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col gap-4 backdrop-blur-sm z-50">
                        <div className="w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                        <Wand2 className="w-16 h-16 text-primary animate-pulse" />
                        <p className="text-white font-bold text-xl tracking-tight">Intelligence Artificielle en analyse...</p>
                      </div>
                    )}
                  </div>
                )}
                
                {analyzed && prediction && (
                  <div className="w-full h-full animate-in fade-in zoom-in duration-500">
                    <Teeth3DViewer patientType={patientType} predictionLabel={prediction.label} infectedTeethIds={infectedTeethIds} />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-6">
             <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
               {isDoctor ? (
                 <>
                   <h3 className="font-bold text-xl mb-4">Âge du patient</h3>

                   <div className="space-y-3">
                     <button
                       onClick={() => changePatientType('adult')}
                       className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${patientType === 'adult' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                     >
                       <div className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center border-2 ${patientType === 'adult' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                         {patientType === 'adult' && <CheckCircle2 className="w-4 h-4 text-white" />}
                       </div>
                       <div>
                         <p className="font-bold text-foreground">12 ans et plus</p>
                         <p className="text-sm text-muted-foreground mt-1">Analyse spécifique pour les patients de 12 ans et plus.</p>
                       </div>
                     </button>

                     <button
                       onClick={() => changePatientType('kid')}
                       className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${patientType === 'kid' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                     >
                       <div className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center border-2 ${patientType === 'kid' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                         {patientType === 'kid' && <CheckCircle2 className="w-4 h-4 text-white" />}
                       </div>
                       <div>
                         <p className="font-bold text-foreground">Moins de 12 ans</p>
                         <p className="text-sm text-muted-foreground mt-1">Analyse orthodontique spécifique pour les enfants.</p>
                       </div>
                     </button>
                   </div>

                   <div className="mt-6">
                     <h4 className="font-bold mb-3">Sélection du modèle IA</h4>
                     <div className="space-y-3">
                       <button
                         onClick={() => changeModel('adult_api')}
                         className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${selectedModel === 'adult_api' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                       >
                         <div className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center border-2 ${selectedModel === 'adult_api' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                           {selectedModel === 'adult_api' && <CheckCircle2 className="w-4 h-4 text-white" />}
                         </div>
                         <div>
                           <p className="font-bold text-foreground">Modèle adulte</p>
                           <p className="text-sm text-muted-foreground mt-1">Utilise le modèle adulte pour les patients de 12 ans et plus.</p>
                         </div>
                       </button>

                       <button
                         onClick={() => changeModel('kid_api')}
                         className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${selectedModel === 'kid_api' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                       >
                         <div className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center border-2 ${selectedModel === 'kid_api' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                           {selectedModel === 'kid_api' && <CheckCircle2 className="w-4 h-4 text-white" />}
                         </div>
                         <div>
                           <p className="font-bold text-foreground">Modèle enfant</p>
                           <p className="text-sm text-muted-foreground mt-1">Utilise le modèle enfant et détecte les dents concernées.</p>
                         </div>
                       </button>
                     </div>
                   </div>
                 </>
               ) : isKidPatient ? (
                 <div>
                   <h3 className="font-bold text-xl mb-4">Modèle enfant verrouillé</h3>
                   <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                     <p className="text-sm text-foreground">
                       <span className="font-bold">Modèle enfant</span> utilisé pour votre analyse.
                     </p>
                     <p className="text-xs text-muted-foreground mt-2">
                       L’âge et le modèle sont définis automatiquement pour les enfants.
                     </p>
                   </div>
                 </div>
               ) : (
                 <div>
                   <h3 className="font-bold text-xl mb-4">Modèle adulte verrouillé</h3>
                   <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                     <p className="text-sm text-foreground">
                       <span className="font-bold">Modèle adulte</span> utilisé pour votre analyse.
                     </p>
                     <p className="text-xs text-muted-foreground mt-2">
                       L’âge et le modèle sont définis automatiquement pour les adultes.
                     </p>
                   </div>
                 </div>
               )}

               {prediction && prediction.label !== "Erreur Analyse" && (
                 <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5">
                   <h4 className="font-bold text-primary flex items-center gap-2">
                     <Wand2 className="w-4 h-4"/> Résultat IA (Prédiction)
                   </h4>
                   <p className="font-semibold text-lg mt-2">{prediction.label}</p>
                   <p className="text-sm text-muted-foreground">
                     Confiance : {(prediction.confidence * 100).toFixed(1)}%
                   </p>
                 </div>
               )}

               <div className="mt-8 space-y-3">
                 <button
                   onClick={() => runAiSimulation(file || undefined, patientType)}
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
