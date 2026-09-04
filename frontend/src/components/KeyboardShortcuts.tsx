import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCMS } from "@/context/CMSContext";

const KeyboardShortcuts: React.FC = () => {
  const { isAdminLoggedIn } = useCMS();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        navigate("/admin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, isAdminLoggedIn]);

  return null;
};

export default KeyboardShortcuts;
