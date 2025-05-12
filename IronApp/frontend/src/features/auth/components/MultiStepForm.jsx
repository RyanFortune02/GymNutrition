import React, { useReducer, useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { steps } from "../../formConfig";
import Step from "./Step";
import ProgressBar from "./ProgressBar";
import { formReducer } from "./useFormReducer";
import api from "../../auth/api";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { feetInchesToCm, lbsToKg } from "../../../utils/unitConversion";
/* MultiStepForm component is a form that allows users to fill out multiple steps to complete Registration.
*/

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

// Get initial value for a field to be used in the form
const getInitialValue = (field) => {
  if (field.type === "checkboxGroup") return [];
  if (field.name === "height" || field.name === "weight") return ""; 
  return "";
};

const initialData = steps.reduce((acc, s) => {
  if (s.fields) s.fields.forEach(f => acc[f.name] = getInitialValue(f));
  return acc;
}, {});

export default function MultiStepForm({ route = "/api/user/register/", method = "register", onSuccess }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [formData, dispatch] = useReducer(formReducer, initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const refs = [ref0, ref1, ref2, ref3, ref4];
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => { if (refs[step] && refs[step].current) refs[step].current.focus(); }, [step, refs]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === "Enter") { e.preventDefault(); if (step < steps.length-1 && canNext()) handleNext(); }
      if (e.key === "ArrowRight") { if (step < steps.length-1 && canNext()) handleNext(); }
      if (e.key === "ArrowLeft" && step > 0) handleBack();
      if (e.key === "Escape") { dispatch({ type: "RESET", payload: initialData }); setStep(0); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, formData, handleNext, handleBack, canNext, dispatch]);

  const setField = (name, value) => dispatch({ type: "SET_FIELD", field: name, value });

  const canNext = () => {
    const cfg = steps[step];
    if (cfg.review) return true;
    return cfg.fields.every(f => {
      const val = formData[f.name];
      // Height and weight need to be validated by the components to ensure they are within the valid range
      if ((f.name === "height" || f.name === "weight") && f.required) {
        return val !== undefined && val !== null && val !== "";
      }
      if (f.required && (val === "" || val === undefined || (Array.isArray(val) && val.length === 0))) return false;
      return !f.validate || f.validate(val);
    });
  };

  const handleNext = () => { setDir(1); setStep(s => s + 1); };
  const handleBack = () => { setDir(-1); setStep(s => s - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Prepare payload for backend
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile_data: {
          age: Number(formData.age),
          sex: formData.sex,
          height: feetInchesToCm(formData.height?.feet, formData.height?.inches),
          weight: lbsToKg(formData.weight),
          activity_level: Number(formData.activity_level),
          food_preferences: Array.isArray(formData.food_preferences) 
            ? formData.food_preferences.reduce((a, b) => a | b, 0)
            : Number(formData.food_preferences) || 0,
          allergies: Array.isArray(formData.allergies)
            ? formData.allergies.reduce((a, b) => a | b, 0)
            : Number(formData.allergies) || 0,
        }
      };
      if (method === "register") {
        await register(payload);
        if (onSuccess) onSuccess();
        else navigate("/");
      } else {
        await api.post(route, payload);
      }
      dispatch({ type: "RESET", payload: initialData });
      setStep(0);
    } catch (e) {
      setError(e.response?.data?.detail || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 py-12 my-8">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <ProgressBar step={step} total={steps.length} />
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Step
              config={steps[step]}
              formData={formData}
              setField={setField}
              inputRef={refs[step]}
            />
            <div className="flex justify-between mt-6">
              {step > 0 ? (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                >Back</button>
              ) : <div />}
              {step < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canNext()}
                  className="px-4 py-2 bg-[var(--primary-color-blue)] text-white rounded disabled:opacity-50"
                >Next</button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-[var(--accent-color-orange)] text-white rounded"
                >{loading ? "Submitting..." : "Submit"}</button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
}
