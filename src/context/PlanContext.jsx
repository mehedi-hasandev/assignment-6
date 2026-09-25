"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [plan, setPlan] = useState([]);
  const [saved, setSaved] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem("fitlog_plan");
      const storedSaved = localStorage.getItem("fitlog_saved");
      if (storedPlan) setPlan(JSON.parse(storedPlan));
      if (storedSaved) setSaved(JSON.parse(storedSaved));
    } catch (e) {
      console.error("Failed to parse local storage data:", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("fitlog_plan", JSON.stringify(plan));
      localStorage.setItem("fitlog_saved", JSON.stringify(saved));
    } catch (e) {
      console.error("Failed to save to local storage:", e);
    }
  }, [plan, saved, isLoaded]);

  const addToPlan = (workout) => {
    let added = false;

    setPlan((prev) => {
      if (prev.length >= 5) {
        toast.error("Cap of 5 lifts reached! Complete or remove some first.");
        return prev;
      }
      if (prev.some((item) => item.id === workout.id)) {
        toast.info("This workout is already in today's plan.");
        return prev;
      }
      added = true;
      return [...prev, { ...workout, isDone: false }];
    });

    if (added) {
      toast.success(`"${workout.name || workout.title}" added to today's plan!`);
    }
    return added;
  };

  const addToSaved = (workout) => {
    let savedSuccessfully = false;

    setSaved((prev) => {
      if (prev.some((item) => item.id === workout.id)) {
        toast.info("This workout is already saved.");
        return prev;
      }
      savedSuccessfully = true;
      return [...prev, workout];
    });

    if (savedSuccessfully) {
      toast.success(`"${workout.name || workout.title}" saved for later!`);
    }
    return savedSuccessfully;
  };

  const removeFromPlan = (id) => {
    setPlan((prev) => prev.filter((item) => item.id !== id));
    toast.info("Workout removed from today's plan.");
  };

  const removeFromSaved = (id) => {
    setSaved((prev) => prev.filter((item) => item.id !== id));
    toast.info("Workout removed from saved.");
  };

  const toggleDone = (id) => {
    setPlan((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedState = !item.isDone;
          toast.success(updatedState ? "Workout marked as done!" : "Marked as incomplete.");
          return { ...item, isDone: updatedState };
        }
        return item;
      })
    );
  };

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        addToPlan,
        addToSaved,
        removeFromPlan,
        removeFromSaved,
        toggleDone,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
};