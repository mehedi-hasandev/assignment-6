"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlan } from "@/context/PlanContext";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@/components/Icons";

export default function WorkoutDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToPlan, addToSaved, plan } = usePlan();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`);
        if (!res.ok) throw new Error("Could not find workout");
        const json = await res.json();
        setWorkout(json.data || json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#ccff00] border-r-transparent" />
        <p className="text-xs uppercase font-mono tracking-widest text-neutral-400">Loading workout...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-black uppercase text-white mb-4 font-[Oswald]">Workout Not Found</h2>
        <Link href="/" className="px-6 py-2.5 bg-[#ccff00] text-black font-bold uppercase text-xs rounded-full inline-block">
          Back to Library
        </Link>
      </div>
    );
  }

  const name = workout.name || workout.title;
  const description = workout.description || "A compound movement designed to build strength and athletic performance.";
  const image = workout.image || workout.illustration || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80";
  const instructions = workout.instructions || [
    "Lie on the bench with eyes under the bar and feet planted.",
    "Unrack with locked elbows and lower the bar to mid-chest.",
    "Press up in a slight arc until elbows lock without bouncing.",
    "Keep shoulder blades pinched and a natural arch in the back."
  ];

  const durationVal = workout.duration ? `${workout.duration} min` : "25 min";
  const caloriesVal = workout.caloriesBurned 
    ? `${workout.caloriesBurned} kcal` 
    : (workout.calories ? `${workout.calories} kcal` : "180 kcal");
  const categories = workout.muscleGroups || workout.category || ["Chest", "Arms"];
  const categoryList = Array.isArray(categories) ? categories : [categories];
  const isPlanCapped = plan.length >= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14">
      
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-[#12151b] text-neutral-400 hover:text-white hover:border-neutral-600 transition mb-6 sm:mb-8 cursor-pointer text-xs font-bold uppercase tracking-wider font-mono active:scale-95"
      >
        <ArrowLeftIcon className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <div className="lg:col-span-6 w-full">
          <div className="rounded-2xl overflow-hidden bg-[#12151b] border border-neutral-800/80 shadow-2xl relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square">
            <Image
              src={image}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-tight font-[Oswald]">
              {name}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed font-sans max-w-xl">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {categoryList.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold uppercase rounded-full bg-[#ccff00] text-black"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="rounded-xl bg-[#12151b]/90 border border-neutral-800/80 p-3.5 sm:p-5 divide-y divide-neutral-800/60 font-sans text-xs sm:text-sm">
            <div className="flex justify-between py-2 sm:py-2.5">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">EQUIPMENT</span>
              <span className="text-neutral-100 font-medium">{workout.equipment || "Barbell, Bench"}</span>
            </div>
            <div className="flex justify-between py-2 sm:py-2.5">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">DIFFICULTY</span>
              <span className="text-neutral-100 font-medium">{workout.difficulty || "Intermediate"}</span>
            </div>
            <div className="flex justify-between py-2 sm:py-2.5">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">SETS</span>
              <span className="text-neutral-100 font-medium">{workout.sets || 4}</span>
            </div>
            <div className="flex justify-between py-2 sm:py-2.5">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">REPS</span>
              <span className="text-neutral-100 font-medium">{workout.reps || "6-8"}</span>
            </div>
            <div className="flex justify-between py-2 sm:py-2.5">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">DURATION</span>
              <span className="text-neutral-100 font-medium">{durationVal}</span>
            </div>
            <div className="flex justify-between py-2 sm:py-2.5">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">CALORIES</span>
              <span className="text-neutral-100 font-medium">{caloriesVal}</span>
            </div>
            <div className="flex justify-between py-2 sm:py-2.5">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">RATING</span>
              <span className="text-[#ccff00] font-bold">{workout.rating || "4.8"}</span>
            </div>
          </div>

          <div className="pt-1">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white mb-2.5 font-[Oswald]">
              INSTRUCTIONS
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              {instructions.map((step, idx) => (
                <li key={idx} className="flex gap-2.5">
                  <span className="text-neutral-400 font-bold font-mono">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
            <button
              onClick={() => addToPlan(workout)}
              disabled={isPlanCapped}
              className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition ${
                isPlanCapped
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                  : "bg-[#ccff00] text-black hover:brightness-110 active:scale-95 cursor-pointer shadow-sm"
              }`}
            >
              <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <line x1="12" y1="14" x2="12" y2="18" />
                <line x1="10" y1="16" x2="14" y2="16" />
              </svg>
              <span>{isPlanCapped ? "Plan Full (Cap 5)" : "Add to today's plan"}</span>
            </button>

            <button
              onClick={() => addToSaved(workout)}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider border border-neutral-700 bg-transparent text-neutral-200 hover:border-neutral-500 hover:text-white transition active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span>Save for later</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}